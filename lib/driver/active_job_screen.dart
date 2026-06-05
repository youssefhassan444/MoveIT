import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:latlong2/latlong.dart';
import '../../core/theme/app_theme.dart';
import '../services/auth_service.dart';
import '../services/job_service.dart';
import '../services/routing_service.dart';
import '../services/tracking_service.dart';

class ActiveJobScreen extends HookConsumerWidget {
  const ActiveJobScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final activeJobAsync = ref.watch(activeJobProvider);
    final job = activeJobAsync.asData?.value;
    final customerAsync = job != null
        ? ref.watch(userByIdProvider(job.customerId))
        : const AsyncValue.data(null);
    final trackingAsync = job != null
        ? ref.watch(trackingProvider(job.id))
        : const AsyncValue.data(null);
    final tracking = trackingAsync.asData?.value;

    final routeInfo = useState<RouteInfo?>(null);
    final routeError = useState<String?>(null);
    final isRouteLoading = useState<bool>(false);
    final actionLoading = useState<bool>(false);
    final mapController = useMemoized(() => MapController());

    // Tracking dynamic routing states
    final lastApiCallTime = useRef<DateTime?>(null);
    final originalDistance = useState<double>(0.0);
    final originalDuration = useState<double>(0.0);
    final displayDistanceLabel = useState<String>('Calculating...');
    final displayDurationLabel = useState<String>('Calculating...');
    final lastStatus = useRef<String?>(null);

    // Turn-by-turn navigation states
    final activeInstruction = useState<String>('Head towards destination');
    final activeManeuverType = useState<int>(11);
    final distanceToManeuverLabel = useState<String>('');

    // Clear route info on job status transitions to recalculate towards the new destination
    if (job != null && lastStatus.value != job.status) {
      routeInfo.value = null;
      lastStatus.value = job.status;
    }

    useEffect(() {
      if (job == null) {
        routeInfo.value = null;
        routeError.value = null;
        isRouteLoading.value = false;
        return null;
      }

      var cancelled = false;

      // Start calculation either from current live location or pickup location
      final start = tracking?.latLng ?? job.pickupLatLng2;
      final dest = job.status == 'accepted' ? job.pickupLatLng2 : job.dropoffLatLng2;

      // 1. Initial route calculation
      if (routeInfo.value == null) {
        isRouteLoading.value = true;
        routeError.value = null;
        fetchRouteInfo(start, dest).then((info) {
          if (cancelled) return;
          routeInfo.value = info;
          originalDistance.value = info.distanceMeters;
          originalDuration.value = info.durationSeconds;
          displayDistanceLabel.value = info.distanceLabel;
          displayDurationLabel.value = info.durationLabel;
          lastApiCallTime.value = DateTime.now();

          // Initialize navigation instruction values
          if (info.steps.isNotEmpty) {
            activeInstruction.value = info.steps.first.instruction;
            activeManeuverType.value = info.steps.first.type;
            distanceToManeuverLabel.value = '${info.steps.first.distanceMeters.round()} m';
          } else {
            activeInstruction.value = 'Head towards destination';
            activeManeuverType.value = 11;
            distanceToManeuverLabel.value = '';
          }

          if (info.points.isNotEmpty) {
            WidgetsBinding.instance.addPostFrameCallback((_) {
              try {
                final bounds = LatLngBounds.fromPoints(info.points);
                final center = LatLng(
                  (bounds.north + bounds.south) / 2,
                  (bounds.west + bounds.east) / 2,
                );
                mapController.move(center, 13);
              } catch (_) {}
            });
          }
        }).catchError((error) {
          if (cancelled) return;
          routeError.value = error.toString();
          displayDistanceLabel.value = 'Unavailable';
          displayDurationLabel.value = 'Unavailable';
          activeInstruction.value = 'Route unavailable';
          activeManeuverType.value = 11;
          distanceToManeuverLabel.value = '';
        }).whenComplete(() {
          if (!cancelled) isRouteLoading.value = false;
        });
      } else {
        // 2. We already have a route loaded! Let's check for deviation/off-route
        if (tracking != null && routeInfo.value != null && routeInfo.value!.points.isNotEmpty) {
          final driverPos = tracking.latLng;
          final points = routeInfo.value!.points;
          const distanceCalc = Distance();

          // Find the segment/point closest to the driver
          int closestIndex = 0;
          double minDistance = double.infinity;
          for (int i = 0; i < points.length; i++) {
            final dist = distanceCalc.as(LengthUnit.Meter, driverPos, points[i]);
            if (dist < minDistance) {
              minDistance = dist;
              closestIndex = i;
            }
          }

          // Off-route check threshold: 50 meters
          final isOffRoute = minDistance > 50.0;

          if (isOffRoute) {
            final now = DateTime.now();
            final lastCall = lastApiCallTime.value;
            // Only trigger API call if at least 20 seconds have passed since the last calculation
            if (lastCall == null || now.difference(lastCall).inSeconds > 20) {
              isRouteLoading.value = true;
              routeError.value = null;
              fetchRouteInfo(driverPos, dest).then((info) {
                if (cancelled) return;
                routeInfo.value = info;
                originalDistance.value = info.distanceMeters;
                originalDuration.value = info.durationSeconds;
                displayDistanceLabel.value = info.distanceLabel;
                displayDurationLabel.value = info.durationLabel;
                lastApiCallTime.value = now;

                if (info.steps.isNotEmpty) {
                  activeInstruction.value = info.steps.first.instruction;
                  activeManeuverType.value = info.steps.first.type;
                  distanceToManeuverLabel.value = '${info.steps.first.distanceMeters.round()} m';
                } else {
                  activeInstruction.value = 'Head towards destination';
                  activeManeuverType.value = 11;
                  distanceToManeuverLabel.value = '';
                }
              }).catchError((error) {
                if (cancelled) return;
                routeError.value = error.toString();
              }).whenComplete(() {
                if (!cancelled) isRouteLoading.value = false;
              });
            }
          } else {
            // Driver is on the route! Locally update the remaining distance & ETA
            double remainingDistance = distanceCalc.as(LengthUnit.Meter, driverPos, points[closestIndex]);
            for (int i = closestIndex; i < points.length - 1; i++) {
              remainingDistance += distanceCalc.as(LengthUnit.Meter, points[i], points[i + 1]);
            }

            final totalDist = originalDistance.value > 0 ? originalDistance.value : 1.0;
            final remainingRatio = (remainingDistance / totalDist).clamp(0.0, 1.0);
            final remainingDurationSecs = originalDuration.value * remainingRatio;

            displayDistanceLabel.value = '${(remainingDistance / 1000).toStringAsFixed(1)} km';
            
            final duration = Duration(seconds: remainingDurationSecs.round());
            if (duration.inHours > 0) {
              displayDurationLabel.value = '${duration.inHours}h ${duration.inMinutes % 60}m';
            } else {
              displayDurationLabel.value = '${duration.inMinutes} min';
            }

            // --- Update navigation instructions dynamically ---
            final steps = routeInfo.value!.steps;
            int activeStepIndex = 0;
            for (int i = 0; i < steps.length; i++) {
              if (steps[i].wayPointIndex >= closestIndex) {
                activeStepIndex = i;
                break;
              }
            }

            if (steps.isNotEmpty) {
              final activeStep = steps[activeStepIndex];
              
              // Calculate distance to this active maneuver
              double distToManeuver = distanceCalc.as(LengthUnit.Meter, driverPos, points[closestIndex]);
              for (int i = closestIndex; i < activeStep.wayPointIndex; i++) {
                distToManeuver += distanceCalc.as(LengthUnit.Meter, points[i], points[i + 1]);
              }

              activeInstruction.value = activeStep.instruction;
              activeManeuverType.value = activeStep.type;
              
              if (distToManeuver >= 1000) {
                distanceToManeuverLabel.value = '${(distToManeuver / 1000).toStringAsFixed(1)} km';
              } else {
                distanceToManeuverLabel.value = '${distToManeuver.round()} m';
              }
            }
          }
        }
      }

      return () {
        cancelled = true;
      };
    }, [job?.id, job?.status, tracking?.latLng],);

    return activeJobAsync.when(
      loading: () => const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      ),
      error: (error, stack) => Scaffold(
        body: Center(child: Text('Unable to load active job: $error')),
      ),
      data: (job) {
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

        final customer = customerAsync.asData?.value;
        final route = routeInfo.value;

        return Scaffold(
          body: Stack(
            children: [
              FlutterMap(
                mapController: mapController,
                options: MapOptions(
                  initialCenter: job.pickupLatLng2,
                  initialZoom: 13,
                ),
                children: [
                  TileLayer(
                    urlTemplate:
                        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    userAgentPackageName: 'com.moveit.egypt',
                  ),
                  if (route != null)
                    PolylineLayer(
                      polylines: [
                        Polyline(
                          points: route.points,
                          color: AppTheme.brandSkyBlue,
                          strokeWidth: 5,
                        ),
                      ],
                    ),
                  MarkerLayer(
                    markers: [
                      Marker(
                        point: job.pickupLatLng2,
                        child: const Icon(Icons.location_on,
                            color: AppTheme.brandSkyBlue, size: 40,),
                      ),
                      Marker(
                        point: job.dropoffLatLng2,
                        child: const Icon(Icons.flag,
                            color: AppTheme.brandOrange, size: 40,),
                      ),
                      if (tracking != null)
                        Marker(
                          point: tracking.latLng,
                          rotate: true,
                          child: Transform.rotate(
                            angle: tracking.heading * (3.14159 / 180),
                            child: const Icon(Icons.local_shipping,
                                color: AppTheme.brandNavy, size: 40,),
                          ),
                        ),
                    ],
                  ),
                ],
              ),
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: Container(
                  padding: const EdgeInsets.all(24),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius:
                        BorderRadius.vertical(top: Radius.circular(24)),
                    boxShadow: [
                      BoxShadow(blurRadius: 10, color: Colors.black12),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          _StatusBadge(status: job.status),
                          const Spacer(),
                          Text(
                            '${(job.pricePiastres / 100).toStringAsFixed(0)} EGP',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                              color: AppTheme.brandOrange,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      if (route != null && activeInstruction.value.isNotEmpty) ...[
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          margin: const EdgeInsets.only(bottom: 16),
                          decoration: BoxDecoration(
                            color: AppTheme.brandNavy.withAlpha((0.05 * 255).round()),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: AppTheme.brandNavy.withAlpha((0.1 * 255).round()),
                              width: 1,
                            ),
                          ),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: AppTheme.brandNavy,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Icon(
                                  _getManeuverIcon(activeManeuverType.value),
                                  color: Colors.white,
                                  size: 24,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      activeInstruction.value,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14,
                                        color: AppTheme.brandNavy,
                                      ),
                                    ),
                                    if (distanceToManeuverLabel.value.isNotEmpty) ...[
                                      const SizedBox(height: 2),
                                      Text(
                                        'In ${distanceToManeuverLabel.value}',
                                        style: const TextStyle(
                                          fontSize: 12,
                                          color: Colors.grey,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Distance',
                                    style: TextStyle(
                                        color: Colors.grey, fontSize: 12,),),
                                const SizedBox(height: 4),
                                Text(
                                    displayDistanceLabel.value,
                                    style: const TextStyle(
                                        fontWeight: FontWeight.bold,),),
                              ],
                            ),
                          ),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('ETA',
                                    style: TextStyle(
                                        color: Colors.grey, fontSize: 12,),),
                                const SizedBox(height: 4),
                                Text(
                                    displayDurationLabel.value,
                                    style: const TextStyle(
                                        fontWeight: FontWeight.bold,),),
                              ],
                            ),
                          ),
                        ],
                      ),
                      if (routeError.value != null) ...[
                        const SizedBox(height: 12),
                        Text(routeError.value!,
                            style: const TextStyle(
                                color: Colors.red, fontSize: 12,),),
                      ],
                      const SizedBox(height: 16),
                      Text(job.itemDescription,
                          style: const TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold,),),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          const Icon(Icons.person_outline, size: 16),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'Customer: ${customer?.displayName ?? 'Loading customer...'}',
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(job.pickupAddress,
                          style: const TextStyle(
                              color: Colors.grey, fontSize: 12,),),
                      const SizedBox(height: 4),
                      Text(job.dropoffAddress,
                          style: const TextStyle(
                              color: Colors.grey, fontSize: 12,),),
                      const Divider(height: 32),
                      if (job.status == 'accepted')
                        ElevatedButton(
                          onPressed: actionLoading.value
                              ? null
                              : () async {
                                  actionLoading.value = true;
                                  final error = await markJobInTransit(
                                      job.id, job.driverId ?? '',);
                                  actionLoading.value = false;
                                  if (!context.mounted) return;
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text(error == null
                                          ? 'Status updated to in transit.'
                                          : 'Unable to update status: $error',),
                                    ),
                                  );
                                },
                          style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.brandSkyBlue,),
                          child: actionLoading.value
                              ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.white,
                                  ),
                                )
                              : const Text("I've Arrived at Pickup"),
                        )
                      else if (job.status == 'in_transit')
                        ElevatedButton(
                          onPressed: actionLoading.value
                              ? null
                              : () async {
                                  actionLoading.value = true;
                                  final error = await markJobDelivered(
                                      job.id, job.driverId ?? '',);
                                  actionLoading.value = false;
                                  if (!context.mounted) return;
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text(error == null
                                          ? 'Job marked delivered.'
                                          : 'Unable to update status: $error',),
                                    ),
                                  );
                                },
                          style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.brandSuccess,),
                          child: actionLoading.value
                              ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.white,
                                  ),
                                )
                              : const Text('Mark as Delivered'),
                        ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

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

IconData _getManeuverIcon(int type) {
  switch (type) {
    case 0:
    case 2:
    case 15:
      return Icons.turn_left_rounded;
    case 1:
    case 3:
    case 16:
      return Icons.turn_right_rounded;
    case 4:
      return Icons.turn_slight_left_rounded;
    case 5:
      return Icons.turn_slight_right_rounded;
    case 9:
    case 10:
      return Icons.u_turn_left_rounded;
    case 7:
    case 8:
      return Icons.roundabout_right_rounded;
    case 12:
      return Icons.flag_rounded;
    case 6:
    case 11:
    default:
      return Icons.straight_rounded;
  }
}
