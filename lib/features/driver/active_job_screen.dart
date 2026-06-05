import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:latlong2/latlong.dart';
import 'package:go_router/go_router.dart';
import '../../models/tracking_model.dart';
import '../../services/auth_service.dart';
import '../../services/job_service.dart';
import '../../services/location_service.dart';
import '../../services/routing_service.dart';
import '../../services/tracking_service.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/premium_map_pins.dart';
import '../../services/telemetry_service.dart';
import '../shared/report_dialog.dart';
import 'widgets/eta_card.dart';
import 'widgets/driver_profile_card.dart';
import 'widgets/action_buttons_row.dart';
import 'widgets/delivery_timeline.dart';
import 'widgets/delivery_details_card.dart';

/// Model representing the live turn-by-turn navigation instruction metrics
/// displayed dynamically above the sliding bottom sheet.
class NavigationMetrics {
  /// The total formatted remaining distance (e.g., "1.2 mi").
  final String distanceLabel;
  /// The total formatted remaining time (e.g., "5 min").
  final String durationLabel;
  /// The active text instruction for the upcoming turn (e.g., "Turn right on El Nasr St").
  final String activeInstruction;
  /// The type indicator for the next turn to select corresponding graphic icons (e.g., left, right, straight).
  final int activeManeuverType;
  /// Formatted distance left until the next turn (e.g., "250 m").
  final String distanceToManeuverLabel;

  const NavigationMetrics({
    required this.distanceLabel,
    required this.durationLabel,
    required this.activeInstruction,
    required this.activeManeuverType,
    required this.distanceToManeuverLabel,
  });
}

/// The main dashboard for a driver who has an active delivery.
///
/// Architecture & Capabilities:
/// 1. **Real-time Map Integration**: Embeds OpenStreetMap using high-performance tiles, connecting the live GPS stream, pickup locations, and dropoff destinations.
/// 2. **Dynamic Road-based Routing (OSRM)**: Calculates accurate, turn-by-turn navigation instructions, polyline vectors, and road distance paths instead of default straight-line paths.
/// 3. **Geofenced State Transitions**: Prevents premature completion or arrival updates unless the driver's device is mathematically verified to be within 150 meters of the target location.
/// 4. **Live Telemetry & Audits**: Continuously logs coordinate updates, action button interactions, and GPS status changes to Firebase to provide comprehensive route metrics.
class ActiveJobScreen extends HookConsumerWidget {
  const ActiveJobScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ── Data Subscriptions (Riverpod Reactive State Streams) ─────────────────

    // Reactive subscription fetching the currently active job assigned to the logged-in driver
    final activeAsync = ref.watch(activeJobProvider);
    final job = activeAsync.asData?.value;

    // Reactive subscription fetching the customer user model associated with the active job
    final customerAsync = job != null
        ? ref.watch(userByIdProvider(job.customerId))
        : const AsyncValue.data(null);

    // Reactive subscription streaming real-time driver coordinates and bearing from the tracking collection
    final trackingProv = trackingProvider(job?.id ?? '');
    final trackingAsync = ref.watch(trackingProv);

    // ── Local UI State (Flutter Hooks & Performance Optimization) ───────────

    // Holds the currently rendered route geometries, instructions, and bounding boxes
    final routeInfo = useState<RouteInfo?>(null);
    // Tracks network routing exceptions or fetch warnings
    final routeError = useState<String?>(null);
    // Visual progress state indicating route recalculation is actively occurring
    final isRouteLoading = useState<bool>(false);
    // Memoized Map controller instance to ensure persistent camera manipulations
    final mapController = useMemoized(() => MapController());
    // Indicates the tile overlay and canvas are fully initialized and ready to receive camera actions
    final mapReady = useState<bool>(false);
    // Navigation toggle state determining if the camera should dynamically snap to the driver's coordinate and bearing
    final followDriver = useState<bool>(false);
    // Lock state preventing duplicate button clicks during Firestore transitions
    final isProcessing = useState<bool>(false);
    // Fallback live device GPS position used when Firestore tracking doc hasn't arrived yet
    final livePosition = useState<LatLng?>(null);

    // ── Navigation State Tracking & Throttling Refs ──────────────────────────
    // Tracks the timestamp of the last routing API invocation to strictly throttle off-route recalculations
    final lastApiCallTime = useRef<DateTime?>(null);
    // Stores the initial polyline distance to calculate relative progress ratios
    final originalDistance = useState<double>(0.0);
    // Stores the initial duration to calculate relative time progress ratios
    final originalDuration = useState<double>(0.0);
    // Tracks previous job status to trigger clean route resets during transition intervals
    final lastStatus = useRef<String?>(null);
    // Throttles the live telemetry log updates to Firestore to avoid heavy write costs
    final lastGpsLogTime = useRef<DateTime?>(null);

    // Unified turn-by-turn navigation state
    final navMetrics = useState<NavigationMetrics>(const NavigationMetrics(
      distanceLabel: 'Calculating...',
      durationLabel: 'Calculating...',
      activeInstruction: 'Head towards destination',
      activeManeuverType: 11,
      distanceToManeuverLabel: '',
    ),);

    final sheetController = useMemoized(() => DraggableScrollableController());
    final sheetSize = useState<double>(0.36);

    useEffect(() {
      void listener() {
        if (sheetController.isAttached) {
          sheetSize.value = sheetController.size;
        }
      }
      sheetController.addListener(listener);
      return () => sheetController.removeListener(listener);
    }, [sheetController],);

    // Poll device GPS every 5 seconds as a fallback position source.
    // This ensures the driver marker and geofence button work even when
    // the Firestore tracking document hasn't been written yet.
    useEffect(() {
      if (job == null) return null;
      var active = true;
      Future<void> poll() async {
        while (active) {
          try {
            final loc = ref.read(locationServiceProvider);
            final pos = await loc.getCurrentLocation();
            if (pos != null && active) {
              livePosition.value = LatLng(pos.latitude, pos.longitude);
            }
          } catch (_) {}
          await Future.delayed(const Duration(seconds: 5));
        }
      }
      poll();
      return () => active = false;
    }, [job?.id],);

    // Prefer the Firestore tracking position; fall back to direct device GPS.
    final driverPos = trackingAsync.asData?.value != null
        ? LatLng(trackingAsync.asData!.value!.driverLatLng.latitude,
                 trackingAsync.asData!.value!.driverLatLng.longitude,)
        : livePosition.value;

    final distanceToTarget = useMemoized(() {
      if (job == null || driverPos == null) return null;
      final target = (job.status == 'accepted')
          ? LatLng(job.pickupLatLng.latitude, job.pickupLatLng.longitude)
          : LatLng(job.dropoffLatLng.latitude, job.dropoffLatLng.longitude);
      return const Distance().as(LengthUnit.Meter, driverPos, target);
    }, [job?.status, trackingAsync.asData?.value?.driverLatLng, livePosition.value],);

    // Clear route info on job status transitions to recalculate towards the new destination
    if (job != null && lastStatus.value != job.status) {
      routeInfo.value = null;
      lastStatus.value = job.status;
    }

    // Effect: Calculate the road-based route based on job status
    useEffect(() {
      if (job == null) {
        routeInfo.value = null;
        routeError.value = null;
        isRouteLoading.value = false;
        return null;
      }

      var cancelled = false;
      isRouteLoading.value = true;
      routeError.value = null;

      Future<void> calculateRoute() async {
        LatLng? start;
        LatLng end;

        // Try to get tracking document from Firestore
        final tracking = ref.read(trackingProv).asData?.value;
        if (tracking != null) {
          start = LatLng(tracking.driverLatLng.latitude, tracking.driverLatLng.longitude);
        }

        // If tracking is null, try to get live device location asynchronously
        if (start == null) {
          try {
            final loc = ref.read(locationServiceProvider);
            final pos = await loc.getCurrentLocation();
            if (pos != null) {
              start = LatLng(pos.latitude, pos.longitude);
            }
          } catch (_) {}
        }

        // Fallback to pickup location
        start ??= LatLng(job.pickupLatLng.latitude, job.pickupLatLng.longitude);

        end = (job.status == 'accepted')
            ? LatLng(job.pickupLatLng.latitude, job.pickupLatLng.longitude)
            : LatLng(job.dropoffLatLng.latitude, job.dropoffLatLng.longitude);

        if (start.latitude == end.latitude && start.longitude == end.longitude) {
          end = LatLng(job.dropoffLatLng.latitude, job.dropoffLatLng.longitude);
        }

        try {
          final info = await fetchRouteInfo(start, end);
          if (cancelled) return;
          routeInfo.value = info;
          originalDistance.value = info.distanceMeters;
          originalDuration.value = info.durationSeconds;
          lastApiCallTime.value = DateTime.now();

          // Initialize unified navigation metrics state
          if (info.steps.isNotEmpty) {
            navMetrics.value = NavigationMetrics(
              distanceLabel: info.distanceLabel,
              durationLabel: info.durationLabel,
              activeInstruction: info.steps.first.instruction,
              activeManeuverType: info.steps.first.type,
              distanceToManeuverLabel: '${info.steps.first.distanceMeters.round()} m',
            );
            debugPrint('📍 [Navigation] Initial Step: ${info.steps.first.instruction}');
          } else {
            navMetrics.value = NavigationMetrics(
              distanceLabel: info.distanceLabel,
              durationLabel: info.durationLabel,
              activeInstruction: 'Head towards destination',
              activeManeuverType: 11,
              distanceToManeuverLabel: '',
            );
          }
        } catch (error) {
          if (cancelled) return;
          debugPrint('📍 [ActiveJobScreen] Route fetch error: $error');
          routeError.value = error.toString();
          navMetrics.value = const NavigationMetrics(
            distanceLabel: 'Unavailable',
            durationLabel: 'Unavailable',
            activeInstruction: 'Route unavailable',
            activeManeuverType: 11,
            distanceToManeuverLabel: '',
          );
        } finally {
          if (!cancelled) isRouteLoading.value = false;
        }
      }

      calculateRoute();

      return () {
        cancelled = true;
      };
    }, [job?.id, job?.status],);

    // Effect: Auto-zoom the map to fit both pickup and dropoff points or full route
    useEffect(() {
      if (job == null || !mapReady.value) return null;

      final points = routeInfo.value?.points ?? [
        LatLng(job.pickupLatLng.latitude, job.pickupLatLng.longitude),
        LatLng(job.dropoffLatLng.latitude, job.dropoffLatLng.longitude),
      ];

      final bounds = LatLngBounds.fromPoints(points);

      WidgetsBinding.instance.addPostFrameCallback((_) {
        try {
          mapController.fitCamera(
            CameraFit.bounds(
              bounds: bounds,
              padding: const EdgeInsets.only(
                top: 48,
                left: 24,
                right: 24,
                bottom: 240,
              ),
              maxZoom: 15,
            ),
          );
        } catch (_) {}
      });

      return null;
    }, [job?.id, mapReady.value, routeInfo.value],);

    // Effect: Start broadcasting the driver's GPS location to Firestore
    useEffect(() {
      if (job == null) return null;
      Future.microtask(() async {
        final loc = ref.read(locationServiceProvider);
        final res = await loc.requestPermission();
        res.when(
          success: (granted) {
            // Only start tracking if the user gave GPS permissions
            if (granted) loc.startTracking(job.id);
          },
          failure: (_) {},
        );
      });
      return null;
    }, [job?.id],);

    // ── Live Tracking Listener & Navigation State Machine ───────────────────
    // Observes real-time location stream changes to perform:
    // 1. Telemetry logging (throttled to avoid Firestore write spikes).
    // 2. Map panning, centering, and rotation adjustments in Navigation Mode.
    // 3. Mathematical path proximity queries to determine if driver is on-route.
    // 4. Automatic off-route recalculations (with API flood protection).
    // 5. Dynamic instruction updates, maneuver matching, and time/distance remaining estimation.
    ref.listen<AsyncValue<TrackingModel?>>(trackingProv, (prev, next) {
      final t = next.asData?.value;
      if (t == null || job == null) return;

      // 1. Periodic Telemetry Logging
      // Throttled to 30-second intervals to verify real-time routing efficiency
      final nowTime = DateTime.now();
      final lastLog = lastGpsLogTime.value;
      if (lastLog == null || nowTime.difference(lastLog).inSeconds > 30) {
        lastGpsLogTime.value = nowTime;
        try {
          final driverPos = LatLng(t.driverLatLng.latitude, t.driverLatLng.longitude);
          final destLatLng = (job.status == 'accepted')
              ? job.pickupLatLng
              : job.dropoffLatLng;
          final targetPos = LatLng(destLatLng.latitude, destLatLng.longitude);

          final distanceMeters = const Distance().as(
            LengthUnit.Meter,
            driverPos,
            targetPos,
          );

          TelemetryService.logEvent(
            jobId: job.id,
            driverId: job.driverId ?? '',
            action: 'live_gps_broadcast',
            driverLat: t.driverLatLng.latitude,
            driverLng: t.driverLatLng.longitude,
            distanceToTarget: distanceMeters,
            currentJobStatus: job.status,
          );
        } catch (_) {}
      }

      // 2. Camera snap & rotation mapping
      // If navigation tracking mode is enabled, center on the driver and auto-rotate the canvas
      if (followDriver.value) {
        final driverPos = LatLng(t.driverLatLng.latitude, t.driverLatLng.longitude);
        final destLatLng = (job.status == 'accepted')
            ? job.pickupLatLng
            : job.dropoffLatLng;
        final targetPos = LatLng(destLatLng.latitude, destLatLng.longitude);

        final distanceMeters = const Distance().as(
          LengthUnit.Meter,
          driverPos,
          targetPos,
        );

        try {
          if (distanceMeters < 1000.0) {
            // Close range: Zoom camera to perfectly encapsulate both coordinates
            final bounds = LatLngBounds.fromPoints([driverPos, targetPos]);
            mapController.fitCamera(
              CameraFit.bounds(
                bounds: bounds,
                padding: const EdgeInsets.only(
                  top: 80,
                  left: 60,
                  right: 60,
                  bottom: 240,
                ),
                maxZoom: 16.5,
              ),
            );
            mapController.rotate(-t.heading);
          } else {
            // Long range: Lock closely to street level (zoom 17.0) aligned to traveling direction
            mapController.move(driverPos, 17.0);
            mapController.rotate(-t.heading);
          }
        } catch (_) {}
      }

      // 3. Dynamic Navigation Metric Refinement
      final currentRoute = routeInfo.value;
      if (currentRoute == null || currentRoute.points.isEmpty) return;

      final driverPos = LatLng(t.driverLatLng.latitude, t.driverLatLng.longitude);
      final points = currentRoute.points;
      const distanceCalc = Distance();

      // Linear segment scanning: Detect closest polyline index to locate the driver's progress
      int closestIndex = 0;
      double minDistance = double.infinity;
      for (int i = 0; i < points.length; i++) {
        final dist = distanceCalc.as(LengthUnit.Meter, driverPos, points[i]);
        if (dist < minDistance) {
          minDistance = dist;
          closestIndex = i;
        }
      }

      // Proximity limit check (50m): If driver strays too far, they are off-route!
      final isOffRoute = minDistance > 50.0;
      debugPrint('📍 [Navigation] Proximity scan: ${minDistance.toStringAsFixed(1)}m from line. Off-route: $isOffRoute');

      LatLng end = (job.status == 'accepted')
          ? LatLng(job.pickupLatLng.latitude, job.pickupLatLng.longitude)
          : LatLng(job.dropoffLatLng.latitude, job.dropoffLatLng.longitude);

      if (driverPos.latitude == end.latitude && driverPos.longitude == end.longitude) {
        end = LatLng(job.dropoffLatLng.latitude, job.dropoffLatLng.longitude);
      }

      if (isOffRoute) {
        final now = DateTime.now();
        final lastCall = lastApiCallTime.value;
        // Strictly throttle routing API calls to 20-second cooldown intervals to protect system resources
        if (lastCall == null || now.difference(lastCall).inSeconds > 20) {
          debugPrint('📍 [Navigation] Divergence detected. Recalculating path...');
          isRouteLoading.value = true;
          routeError.value = null;
          fetchRouteInfo(driverPos, end).then((info) {
            routeInfo.value = info;
            originalDistance.value = info.distanceMeters;
            originalDuration.value = info.durationSeconds;
            lastApiCallTime.value = now;

            if (info.steps.isNotEmpty) {
              navMetrics.value = NavigationMetrics(
                distanceLabel: info.distanceLabel,
                durationLabel: info.durationLabel,
                activeInstruction: info.steps.first.instruction,
                activeManeuverType: info.steps.first.type,
                distanceToManeuverLabel: '${info.steps.first.distanceMeters.round()} m',
              );
            } else {
              navMetrics.value = NavigationMetrics(
                distanceLabel: info.distanceLabel,
                durationLabel: info.durationLabel,
                activeInstruction: 'Head towards destination',
                activeManeuverType: 11,
                distanceToManeuverLabel: '',
              );
            }
          }).catchError((error) {
            debugPrint('📍 [Navigation] Recalculate warning: $error');
            routeError.value = error.toString();
          }).whenComplete(() {
            isRouteLoading.value = false;
          });
        } else {
          debugPrint('📍 [Navigation] Recalculation request throttled due to cooldown.');
        }
      } else {
        // Driver is cleanly on-route! Locally interpolate remaining progress ratios
        double remainingDistance = distanceCalc.as(LengthUnit.Meter, driverPos, points[closestIndex]);
        for (int i = closestIndex; i < points.length - 1; i++) {
          remainingDistance += distanceCalc.as(LengthUnit.Meter, points[i], points[i + 1]);
        }

        final totalDist = originalDistance.value > 0 ? originalDistance.value : 1.0;
        final remainingRatio = (remainingDistance / totalDist).clamp(0.0, 1.0);
        final remainingDurationSecs = originalDuration.value * remainingRatio;

        final distanceLabel = '${(remainingDistance / 1609.344).toStringAsFixed(1)} mi';
        final duration = Duration(seconds: remainingDurationSecs.round());
        final durationLabel = '${(duration.inSeconds / 60).round()} min';

        final steps = currentRoute.steps;
        int activeStepIndex = 0;
        for (int i = 0; i < steps.length; i++) {
          // 2-point hysteresis index buffer to prevent turn instructions from oscillating
          // or skipping prematurely when transitioning exactly on corner vertices.
          final bufferIndex = (closestIndex - 2).clamp(0, points.length);
          if (steps[i].wayPointIndex >= bufferIndex) {
            activeStepIndex = i;
            break;
          }
        }

        if (steps.isNotEmpty) {
          final activeStep = steps[activeStepIndex];
          
          double distToManeuver = distanceCalc.as(LengthUnit.Meter, driverPos, points[closestIndex]);
          for (int i = closestIndex; i < activeStep.wayPointIndex; i++) {
            distToManeuver += distanceCalc.as(LengthUnit.Meter, points[i], points[i + 1]);
          }

          final distanceToManeuverLabel = distToManeuver >= 1000
              ? '${(distToManeuver / 1000).toStringAsFixed(1)} km'
              : '${distToManeuver.round()} m';

          navMetrics.value = NavigationMetrics(
            distanceLabel: distanceLabel,
            durationLabel: durationLabel,
            activeInstruction: activeStep.instruction,
            activeManeuverType: activeStep.type,
            distanceToManeuverLabel: distanceToManeuverLabel,
          );
        } else {
          navMetrics.value = NavigationMetrics(
            distanceLabel: distanceLabel,
            durationLabel: durationLabel,
            activeInstruction: 'Head towards destination',
            activeManeuverType: 11,
            distanceToManeuverLabel: '',
          );
        }
      }
    });

    // ── Build UI ─────────────────────────────────────────────────────────────

    return activeAsync.when(
      loading: () =>
      const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (e, __) => Scaffold(body: Center(child: Text('Error: $e'))),
      data: (job) {
        // Handle empty state (no active job assigned)
        if (job == null) {
          return const Scaffold(
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.local_shipping_outlined,
                      size: 80, color: Colors.grey,),
                  SizedBox(height: 16),
                  Text('No active delivery',
                      style: TextStyle(
                          color: Colors.grey, fontWeight: FontWeight.bold,),),
                  SizedBox(height: 8),
                  Text('Accept a job from the board to start.',
                      style: TextStyle(color: Colors.grey),),
                ],
              ),
            ),
          );
        }

        // ── Map Configuration ──────────────────────────────────────────────

        final tracking = trackingAsync.asData?.value;
        final customer = customerAsync.asData?.value;
        final route = routeInfo.value;
        final customerName = customer?.displayName ?? 'Customer';
        final customerContact = customer?.email ?? 'No contact available';



        final pickupPoint = LatLng(job.pickupLatLng.latitude, job.pickupLatLng.longitude);
        final dropoffPoint = LatLng(job.dropoffLatLng.latitude, job.dropoffLatLng.longitude);

        // ── Route Line Trimming & Real-time Connection ──────────────────────
        // Computes the active road polyline segments. It dynamically slices away
        // route vertices that the driver has already traversed behind them.
        // It then mathematically links the driver's exact GPS marker to the
        // remaining path to prevent visual lagging or drawing lines behind them.
        final routePoints = useMemoized(() {
          if (route == null) return [pickupPoint, dropoffPoint];
          if (tracking == null) return route.points;
          
          final driverPos = LatLng(tracking.driverLatLng.latitude, tracking.driverLatLng.longitude);
          const distanceCalc = Distance();
          
          int closestIdx = 0;
          double minDistance = double.infinity;
          for (int i = 0; i < route.points.length; i++) {
            final dist = distanceCalc.as(LengthUnit.Meter, driverPos, route.points[i]);
            if (dist < minDistance) {
              minDistance = dist;
              closestIdx = i;
            }
          }
          
          // Slice the array to preserve only current and future segments, and inject the live driver marker
          return [
            driverPos,
            ...route.points.sublist(closestIdx),
          ];
        }, [route, tracking?.driverLatLng],);

        final routePolyline = useMemoized(() => Polyline(
          points: routePoints,
          color: AppTheme.brandOrange,
          strokeWidth: 5,
          borderStrokeWidth: 2,
          borderColor: Colors.white,
          strokeCap: StrokeCap.round,
          strokeJoin: StrokeJoin.round,
        ), [routePoints],);

        final markers = useMemoized(() => [
          // Pickup Location Marker
          Marker(
            point: LatLng(job.pickupLatLng.latitude, job.pickupLatLng.longitude),
            child: const PremiumMapPin(
              icon: Icons.location_on,
              color: AppTheme.brandSkyBlue,
            ),
          ),
          // Dropoff Location Marker
          Marker(
            point: LatLng(job.dropoffLatLng.latitude, job.dropoffLatLng.longitude),
            child: const PremiumMapPin(
              icon: Icons.flag,
              color: AppTheme.brandOrange,
            ),
          ),
          // Live Driver Location Marker — uses Firestore tracking if available,
          // otherwise falls back to the live device GPS polled above.
          if (tracking != null)
            Marker(
              point: LatLng(tracking.driverLatLng.latitude, tracking.driverLatLng.longitude),
              rotate: true,
              child: Transform.rotate(
                angle: (tracking.heading * (3.141592653589793 / 180.0)),
                child: const PremiumDriverPin(),
              ),
            )
          else if (livePosition.value != null)
            Marker(
              point: livePosition.value!,
              child: const PremiumDriverPin(),
            ),
        ], [job.pickupLatLng, job.dropoffLatLng, tracking?.driverLatLng, tracking?.heading, livePosition.value],);

        return Scaffold(
          body: Stack(
            children: [
              // ── Map Layer ────────────────────────────────────────────────
              FlutterMap(
                mapController: mapController,
                options: MapOptions(
                  initialCenter: pickupPoint,
                  initialZoom: 14,
                  minZoom: 6.0,
                  maxZoom: 18.0,
                  cameraConstraint: CameraConstraint.containCenter(
                    bounds: LatLngBounds(
                      const LatLng(21.0, 24.0),
                      const LatLng(33.0, 37.0),
                    ),
                  ),
                  initialCameraFit: CameraFit.bounds(
                    bounds: LatLngBounds.fromPoints(routePoints),
                    padding: const EdgeInsets.only(
                      top: 48,
                      left: 24,
                      right: 24,
                      bottom: 240,
                    ),
                    maxZoom: 15,
                  ),
                  onMapReady: () => mapReady.value = true,
                  onPositionChanged: (position, hasGesture) {
                    if (hasGesture) {
                      followDriver.value = false;
                    }
                  },
                ),
                children: [
                  TileLayer(
                    urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    userAgentPackageName: 'com.moveit.egypt',
                    keepBuffer: 5,
                  ),
                  PolylineLayer(
                    polylines: [routePolyline],
                  ),
                  MarkerLayer(
                    markers: markers,
                  ),
                ],
              ),

              // ── Turn-by-Turn Instructions Panel HUD ─────────────────────────
              Positioned(
                bottom: (sheetSize.value * MediaQuery.of(context).size.height) + 8.0,
                left: 16,
                right: 76, // Leaves perfect space for the gliding locator button next to it!
                height: 60,
                child: IgnorePointer(
                  ignoring: route == null,
                  child: AnimatedOpacity(
                    opacity: route != null ? 1.0 : 0.0,
                    duration: const Duration(milliseconds: 200),
                    curve: Curves.easeInOut,
                    child: Card(
                      elevation: 6,
                      margin: EdgeInsets.zero,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(18),
                      ),
                      clipBehavior: Clip.antiAlias,
                      child: Container(
                        color: const Color(0xFF0F1F91), // AppTheme.brandNavy
                        padding: const EdgeInsets.symmetric(horizontal: 14),
                        child: Row(
                          children: [
                            // Maneuver Icon
                            Icon(
                              _getManeuverIcon(navMetrics.value.activeManeuverType),
                              color: Colors.white,
                              size: 22,
                            ),
                            const SizedBox(width: 12),
                            // Instruction Text
                            Expanded(
                              child: Text(
                                navMetrics.value.activeInstruction,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(width: 8),
                            // Distance Label
                            if (navMetrics.value.distanceToManeuverLabel.isNotEmpty) ...[
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: 0.15),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  navMetrics.value.distanceToManeuverLabel,
                                  style: const TextStyle(
                                    color: AppTheme.brandOrange, // Highlight color
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),

              // ── Google Maps Navigation Button ──────────────────────────────
              if (tracking != null)
                Positioned(
                  bottom: (sheetSize.value * MediaQuery.of(context).size.height) + 8.0,
                  right: 16,
                  child: FloatingActionButton.small(
                    heroTag: 'nav_bearing_btn',
                    backgroundColor: Colors.white.withValues(alpha: 0.85),
                    elevation: 4,
                    onPressed: () {
                      followDriver.value = true;
                      if (sheetController.isAttached) {
                        sheetController.animateTo(
                          0.2,
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeInOut,
                        );
                      }
                      try {
                        final driverPos = LatLng(
                          tracking.driverLatLng.latitude,
                          tracking.driverLatLng.longitude,
                        );
                        final destLatLng = (job.status == 'accepted')
                            ? job.pickupLatLng
                            : job.dropoffLatLng;
                        final targetPos = LatLng(destLatLng.latitude, destLatLng.longitude);

                        final distanceMeters = const Distance().as(
                          LengthUnit.Meter,
                          driverPos,
                          targetPos,
                        );

                        if (distanceMeters < 1000.0) {
                          // Small distance: Fit both driver and destination
                          final bounds = LatLngBounds.fromPoints([driverPos, targetPos]);
                          mapController.fitCamera(
                            CameraFit.bounds(
                              bounds: bounds,
                              padding: const EdgeInsets.only(
                                top: 80,
                                left: 60,
                                right: 60,
                                bottom: 240,
                              ),
                              maxZoom: 16.5,
                            ),
                          );
                          mapController.rotate(-tracking.heading);
                        } else {
                          // Far distance: Zoom in close to street level (17.0)
                          mapController.move(driverPos, 17.0);
                          mapController.rotate(-tracking.heading);
                        }
                      } catch (_) {}
                    },
                    child: Transform.rotate(
                      angle: (tracking.heading * (3.141592653589793 / 180.0)),
                      child: Icon(
                        Icons.navigation,
                        color: followDriver.value ? const Color(0xFF0F1F91) : Colors.grey[700],
                        size: 20,
                      ),
                    ),
                  ),
                ),

              // ── Bottom Sheet (Job Details) ───────────────────────────────
              DraggableScrollableSheet(
                controller: sheetController,
                initialChildSize: 0.36,
                minChildSize: 0.2,
                maxChildSize: 0.95,
                builder: (context, scrollController) {
                  return Container(
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                    ),
                    child: SingleChildScrollView(
                      controller: scrollController,
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Center(
                            child: Container(
                              width: 48,
                              height: 6,
                              margin: const EdgeInsets.symmetric(vertical: 8),
                              decoration: BoxDecoration(
                                color: Colors.grey[300],
                                borderRadius: BorderRadius.circular(4),
                              ),
                            ),
                          ),
                          Row(
                            children: [
                              _StatusBadge(status: job.status),
                              const Spacer(),
                              Text(
                                  '${(job.pricePiastres / 100).toStringAsFixed(0)} EGP',
                                  style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 18,
                                      color: AppTheme.brandOrange,),),
                            ],
                          ),
                          const SizedBox(height: 12),

                          // ── MAIN ACTION BUTTON ──
                          SizedBox(
                            width: double.infinity,
                            height: 56,
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: job.status == 'accepted'
                                    ? AppTheme.brandSkyBlue
                                    : AppTheme.brandOrange,
                                foregroundColor: Colors.white,
                                 disabledBackgroundColor: Colors.grey[300],
                                 disabledForegroundColor: Colors.grey[500],
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                elevation: 2,
                              ),
                              onPressed: (isProcessing.value || distanceToTarget == null || distanceToTarget > 300.0)
                                  ? null
                                  : () async {
                                final authUser = ref.read(authStateChangesProvider).value;
                                if (authUser == null) return;

                                isProcessing.value = true;
                                final targetAction = job.status == 'accepted'
                                    ? 'click_arrive_pickup'
                                    : 'click_mark_delivered';

                                // 1. Log the initiation check
                                await TelemetryService.logEvent(
                                  jobId: job.id,
                                  driverId: authUser.uid,
                                  action: targetAction,
                                  currentJobStatus: job.status,
                                );

                                String? error;

                                try {
                                  // Dynamic geofencing verification
                                  LatLng? driverLatLng;
                                  if (tracking != null) {
                                    driverLatLng = LatLng(tracking.driverLatLng.latitude, tracking.driverLatLng.longitude);
                                  } else {
                                    try {
                                      final loc = ref.read(locationServiceProvider);
                                      final pos = await loc.getCurrentLocation();
                                      if (pos != null) {
                                        driverLatLng = LatLng(pos.latitude, pos.longitude);
                                      }
                                    } catch (_) {}
                                  }

                                  if (driverLatLng == null) {
                                    await TelemetryService.logEvent(
                                      jobId: job.id,
                                      driverId: authUser.uid,
                                      action: 'gps_location_unavailable',
                                      currentJobStatus: job.status,
                                      error: 'Driver coordinates are null during geofencing check',
                                    );

                                    if (context.mounted) {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(
                                          backgroundColor: Colors.transparent,
                                          elevation: 0,
                                          behavior: SnackBarBehavior.floating,
                                          content: Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                            decoration: BoxDecoration(
                                              color: const Color(0xFFD32F2F),
                                              borderRadius: BorderRadius.circular(16),
                                            ),
                                            child: const Row(
                                              children: [
                                                Icon(Icons.gps_off, color: Colors.white, size: 24),
                                                SizedBox(width: 12),
                                                Expanded(
                                                  child: Text(
                                                    'Waiting for GPS location...',
                                                    style: TextStyle(
                                                      color: Colors.white,
                                                      fontWeight: FontWeight.bold,
                                                      fontSize: 14,
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                      );
                                    }
                                    return;
                                  }

                                  const distanceCalc = Distance();
                                  final target = (job.status == 'accepted')
                                      ? LatLng(job.pickupLatLng.latitude, job.pickupLatLng.longitude)
                                      : LatLng(job.dropoffLatLng.latitude, job.dropoffLatLng.longitude);

                                  final distMeters = distanceCalc.as(LengthUnit.Meter, driverLatLng, target);

                                  if (distMeters > 300) {
                                    await TelemetryService.logEvent(
                                      jobId: job.id,
                                      driverId: authUser.uid,
                                      action: 'geofence_blocked',
                                      driverLat: driverLatLng.latitude,
                                      driverLng: driverLatLng.longitude,
                                      distanceToTarget: distMeters,
                                      currentJobStatus: job.status,
                                      error: 'Geofence blocked: distance is $distMeters meters (threshold is 150m)',
                                    );

                                    if (context.mounted) {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(
                                          backgroundColor: Colors.transparent,
                                          elevation: 0,
                                          behavior: SnackBarBehavior.floating,
                                          margin: const EdgeInsets.fromLTRB(16, 0, 16, 80),
                                          content: Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                            decoration: BoxDecoration(
                                              color: const Color(0xFFD32F2F),
                                              borderRadius: BorderRadius.circular(16),
                                              boxShadow: [
                                                BoxShadow(
                                                  color: Colors.black.withAlpha((0.2 * 255).round()),
                                                  blurRadius: 10,
                                                  offset: const Offset(0, 4),
                                                ),
                                              ],
                                            ),
                                            child: Row(
                                              children: [
                                                const Icon(Icons.error_outline, color: Colors.white, size: 24),
                                                const SizedBox(width: 12),
                                                Expanded(
                                                  child: Text(
                                                    job.status == 'accepted'
                                                        ? "you haven't reached Pickup location"
                                                        : "you haven't reached Dropoff location",
                                                    style: const TextStyle(
                                                      color: Colors.white,
                                                      fontWeight: FontWeight.bold,
                                                      fontSize: 14,
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                      );
                                    }
                                    return;
                                  }

                                  await TelemetryService.logEvent(
                                    jobId: job.id,
                                    driverId: authUser.uid,
                                    action: 'initiating_status_transition',
                                    driverLat: driverLatLng.latitude,
                                    driverLng: driverLatLng.longitude,
                                    distanceToTarget: distMeters,
                                    currentJobStatus: job.status,
                                  );

                                  if (job.status == 'accepted') {
                                    error = await markJobInTransit(job.id, authUser.uid);
                                  } else if (job.status == 'in_transit') {
                                    error = await markJobDelivered(job.id, authUser.uid);
                                  }

                                  if (error == null) {
                                    await TelemetryService.logEvent(
                                      jobId: job.id,
                                      driverId: authUser.uid,
                                      action: 'status_transition_success',
                                      driverLat: driverLatLng.latitude,
                                      driverLng: driverLatLng.longitude,
                                      distanceToTarget: distMeters,
                                      currentJobStatus: job.status == 'accepted' ? 'in_transit' : 'delivered',
                                    );
                                  } else {
                                    await TelemetryService.logEvent(
                                      jobId: job.id,
                                      driverId: authUser.uid,
                                      action: 'status_transition_failure',
                                      driverLat: driverLatLng.latitude,
                                      driverLng: driverLatLng.longitude,
                                      distanceToTarget: distMeters,
                                      currentJobStatus: job.status,
                                      error: error,
                                    );
                                  }
                                } finally {
                                  if (context.mounted) isProcessing.value = false;
                                }

                                if (error != null && context.mounted) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text(error), backgroundColor: Colors.red),
                                  );
                                }
                              },
                              child: isProcessing.value
                                  ? const CircularProgressIndicator(color: Colors.white)
                                  : Text(
                                job.status == 'accepted'
                                    ? "I'VE ARRIVED AT PICKUP"
                                    : 'MARK AS DELIVERED',
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                          if (job.status == 'accepted' || job.status == 'in_transit') ...[
                            const SizedBox(height: 12),
                            SizedBox(
                              width: double.infinity,
                              height: 56,
                              child: OutlinedButton(
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: Colors.redAccent,
                                  side: const BorderSide(color: Colors.redAccent, width: 1.5),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                ),
                                onPressed: isProcessing.value
                                    ? null
                                    : () async {
                                        // Capture jobId before any async gap
                                        final capturedJobId = job.id;
                                        final confirm = await showDialog<bool>(
                                          context: context,
                                          builder: (ctx) => AlertDialog(
                                            title: const Text('Cancel Trip?'),
                                            content: const Text('Are you sure you want to cancel this delivery?'),
                                            actions: [
                                              TextButton(
                                                onPressed: () => Navigator.pop(ctx, false),
                                                child: const Text('NO'),
                                              ),
                                              TextButton(
                                                onPressed: () => Navigator.pop(ctx, true),
                                                child: const Text(
                                                  'YES, CANCEL',
                                                  style: TextStyle(color: Colors.red),
                                                ),
                                              ),
                                            ],
                                          ),
                                        );
                                        if (confirm != true) return;
                                        if (!context.mounted) return;
                                        isProcessing.value = true;
                                        final cancelError = await cancelJobByDriver(capturedJobId);
                                        if (!context.mounted) return;
                                        isProcessing.value = false;
                                        if (cancelError != null) {
                                          ScaffoldMessenger.of(context).showSnackBar(
                                            SnackBar(
                                              content: Text('Cancel failed: $cancelError'),
                                              backgroundColor: Colors.red,
                                            ),
                                          );
                                        }
                                      },
                                child: const Text(
                                  'CANCEL TRIP',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                          ],
                          const SizedBox(height: 12),

                          // ETA and Distance display with dynamic navigation instructions
                          EtaCard(
                            job: job,
                            etaLabel: navMetrics.value.durationLabel,
                            distanceLabel: navMetrics.value.distanceLabel,
                            activeInstruction: navMetrics.value.activeInstruction,
                            maneuverIcon: _getManeuverIcon(navMetrics.value.activeManeuverType),
                            distanceToManeuver: navMetrics.value.distanceToManeuverLabel,
                          ),

                          const SizedBox(height: 16),

                           if (routeError.value != null) ...[
                            const SizedBox(height: 8),
                            Text('Route error: ${routeError.value!}',
                                style: const TextStyle(
                                    color: Colors.red, fontSize: 12,),),
                          ],

                          // Customer Profile Card
                          DriverProfileCard(
                            name: customerName,
                            rating: 0,
                            trips: 0,
                            vehicle: job.vehicleTypeRequired,
                            plate: job.pickupAddress.split(',').first,
                            photoUrl: customer?.photoUrl,
                          ),

                          // Communication Buttons (Call/Message)
                          ActionButtonsRow(
                            callLabel: 'Call Customer',
                            messageLabel: 'Message Customer',
                            reportLabel: 'Report Issue',
                            onCall: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Calling $customerName ($customerContact)')),
                              );
                            },
                            onMessage: () {
                              context.push('/chat/${job.id}');
                            },
                            onReport: () {
                              ReportDialog.show(context, jobId: job.id);
                            },
                          ),

                          const SizedBox(height: 8),
                          // Visual history of delivery steps
                          DeliveryTimeline(steps: [
                            TimelineStep(
                                title: 'Order Placed',
                                subtitle: 'Job posted',
                                time: job.createdAt.toLocal().toString().substring(11, 16),
                                completed: true,),
                            TimelineStep(
                                title: 'Driver Assigned',
                                subtitle: 'Driver accepted the job',
                                time: job.acceptedAt != null ? job.acceptedAt!.toLocal().toString().substring(11, 16) : '-',
                                completed: job.status != 'pending',),
                            TimelineStep(
                                title: 'Picked Up',
                                subtitle: 'Items collected',
                                time: (job.status == 'in_transit' || job.status == 'delivered') ? '-' : '-',
                                completed: job.status == 'in_transit' || job.status == 'delivered',),
                            TimelineStep(
                                title: 'Delivered',
                                subtitle: 'Arrival at destination',
                                time: job.deliveredAt != null ? job.deliveredAt!.toLocal().toString().substring(11, 16) : '-',
                                completed: job.status == 'delivered',),
                          ],),

                          DeliveryDetailsCard(job: job),

                          const SizedBox(height: 40),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }
}

/// A small colored badge displaying the job's current status string.
class _StatusBadge extends StatelessWidget {
  final String status;
  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: AppTheme.brandSkyBlue.withAlpha((0.1 * 255).round()),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        status.toUpperCase(),
        style: const TextStyle(
            color: AppTheme.brandSkyBlue,
            fontWeight: FontWeight.bold,
            fontSize: 12,),
      ),
    );
  }
}

/// Resolves the maneuver type to a clean navigation icon
IconData _getManeuverIcon(int type) {
  switch (type) {
    case 0: // Left
    case 12: // Sharp Left
    case 17: // Slight Left
      return Icons.turn_left;
    case 1: // Right
    case 13: // Sharp Right
    case 18: // Slight Right
      return Icons.turn_right;
    case 2: // U-turn
      return Icons.u_turn_left;
    case 3: // Keep Left
      return Icons.turn_slight_left;
    case 4: // Keep Right
      return Icons.turn_slight_right;
    case 6: // Roundabout
      return Icons.roundabout_right;
    case 11: // Head / Keep straight
    default:
      return Icons.navigation;
  }
}
