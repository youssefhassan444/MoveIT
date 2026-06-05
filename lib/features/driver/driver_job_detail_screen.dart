import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:latlong2/latlong.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/premium_map_pins.dart';
import '../../services/auth_service.dart';
import '../../services/job_service.dart';
import '../../services/routing_service.dart';

class DriverJobDetailScreen extends HookConsumerWidget {
  final String jobId;
  const DriverJobDetailScreen({super.key, required this.jobId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final jobAsync = ref.watch(singleJobProvider(jobId));
    final job = jobAsync.asData?.value;
    final customerAsync = job != null
        ? ref.watch(userByIdProvider(job.customerId))
        : const AsyncValue.data(null);

    final routeInfo = useState<RouteInfo?>(null);
    final routeError = useState<String?>(null);
    final isRouteLoading = useState<bool>(false);
    final mapController = useMemoized(() => MapController());
    final mapReady = useState<bool>(false);
    final sheetController = useMemoized(() => DraggableScrollableController());

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

      fetchRouteInfo(
        LatLng(job.pickupLatLng.latitude, job.pickupLatLng.longitude),
        LatLng(job.dropoffLatLng.latitude, job.dropoffLatLng.longitude),
      ).then((info) {
        if (cancelled) return;
        routeInfo.value = info;
      }).catchError((error) {
        if (cancelled) return;
        routeError.value = error.toString();
      }).whenComplete(() {
        if (!cancelled) isRouteLoading.value = false;
      });

      return () {
        cancelled = true;
      };
    }, [job?.id],);

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

      // Drag the details panel down automatically to not block the map
      if (routeInfo.value != null) {
        Future.delayed(const Duration(milliseconds: 1000), () {
          try {
            if (sheetController.isAttached) {
              sheetController.animateTo(
                0.15,
                duration: const Duration(milliseconds: 600),
                curve: Curves.easeInOut,
              );
            }
          } catch (_) {}
        });
      }

      return null;
    }, [job?.id, mapReady.value, routeInfo.value],);

    return jobAsync.when(
      loading: () =>
          const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (error, _) => Scaffold(body: Center(child: Text('Error: $error'))),
      data: (job) {
        if (job == null) {
          return const Scaffold(
            body: Center(child: Text('Job not found')),
          );
        }

        final customer = customerAsync.asData?.value;
        final route = routeInfo.value;
        final pickupPoint = LatLng(job.pickupLatLng.latitude, job.pickupLatLng.longitude);
        final dropoffPoint = LatLng(job.dropoffLatLng.latitude, job.dropoffLatLng.longitude);
        final routePoints = route?.points ?? [pickupPoint, dropoffPoint];
        final etaMinutes =
            route != null ? (route.durationSeconds / 60).round() : 0;
        final routePolyline = Polyline(
          points: routePoints,
          color: AppTheme.brandOrange,
          strokeWidth: 5,
          borderStrokeWidth: 2,
          borderColor: Colors.white,
          strokeCap: StrokeCap.round,
          strokeJoin: StrokeJoin.round,
        );
        final distanceMiles =
            route != null ? route.distanceMeters / 1609.344 :
            const Distance().as(LengthUnit.Meter, pickupPoint, dropoffPoint) / 1609.344;
        final statusLabel = job.status.replaceAll('_', ' ').toUpperCase();

        return Scaffold(
          body: Stack(
            children: [
              FlutterMap(
                mapController: mapController,
                options: MapOptions(
                  initialCenter: pickupPoint,
                  initialZoom: 13,
                  minZoom: 6.0,
                  maxZoom: 18.0,
                  cameraConstraint: CameraConstraint.containCenter(
                    bounds: LatLngBounds(
                      const LatLng(21.0, 24.0),
                      const LatLng(33.0, 37.0),
                    ),
                  ),
                  initialCameraFit: CameraFit.bounds(
                    bounds: LatLngBounds.fromPoints([pickupPoint, dropoffPoint]),
                    padding: const EdgeInsets.all(24),
                    maxZoom: 15,
                  ),
                  onMapReady: () => mapReady.value = true,
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
                    markers: [
                      Marker(
                        point: LatLng(job.pickupLatLng.latitude,
                            job.pickupLatLng.longitude,),
                        child: const PremiumMapPin(
                          icon: Icons.home,
                          color: AppTheme.brandSkyBlue,
                        ),
                      ),
                      Marker(
                        point: LatLng(job.dropoffLatLng.latitude,
                            job.dropoffLatLng.longitude,),
                        child: const PremiumMapPin(
                          icon: Icons.flag,
                          color: AppTheme.brandOrange,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              Positioned(
                top: 50,
                left: 16,
                child: CircleAvatar(
                  backgroundColor: Colors.white,
                  child: IconButton(
                    icon:
                        const Icon(Icons.arrow_back, color: AppTheme.brandNavy),
                    onPressed: () => Navigator.pop(context),
                  ),
                ),
              ),
              DraggableScrollableSheet(
                controller: sheetController,
                initialChildSize: 0.35,
                minChildSize: 0.15,
                maxChildSize: 0.65,
                builder: (context, scrollController) {
                  const orderDone = true;
                  final pickupDone = job.status != 'pending';
                  final transitDone =
                      job.status == 'in_transit' || job.status == 'delivered';
                  final doneDone = job.status == 'delivered';

                  return Container(
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      borderRadius:
                          BorderRadius.vertical(top: Radius.circular(24)),
                      boxShadow: [
                        BoxShadow(blurRadius: 10, color: Colors.black12),
                      ],
                    ),
                    child: ListView(
                      controller: scrollController,
                      padding: const EdgeInsets.all(24),
                      children: [
                        Center(
                          child: Container(
                            width: 40,
                            height: 5,
                            decoration: BoxDecoration(
                                color: Colors.grey[300],
                                borderRadius: BorderRadius.circular(5),),
                          ),
                        ),
                        const SizedBox(height: 24),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(job.itemDescription,
                                  style: const TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,),),
                            ),
                            Chip(
                              label: Text(statusLabel,
                                  style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,),),
                              backgroundColor: AppTheme.brandSkyBlue,
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Row(children: [
                          const Icon(Icons.location_on,
                              color: AppTheme.brandSkyBlue,),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(job.pickupAddress,
                                style: const TextStyle(
                                    fontWeight: FontWeight.w600,),),
                          ),
                        ],),
                        const SizedBox(height: 12),
                        Row(children: [
                          const Icon(Icons.flag, color: AppTheme.brandOrange),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(job.dropoffAddress,
                                style: const TextStyle(
                                    fontWeight: FontWeight.w600,),),
                          ),
                        ],),
                        const SizedBox(height: 24),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Distance',
                                    style: TextStyle(
                                        color: Colors.grey, fontSize: 12,),),
                                const SizedBox(height: 4),
                                Text(
                                    distanceMiles > 0
                                        ? '${distanceMiles.toStringAsFixed(1)} mi'
                                        : (isRouteLoading.value
                                            ? 'Loading...'
                                            : 'Unavailable'),
                                    style: const TextStyle(
                                        fontWeight: FontWeight.bold,),),
                              ],
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('ETA',
                                    style: TextStyle(
                                        color: Colors.grey, fontSize: 12,),),
                                const SizedBox(height: 4),
                                Text(
                                    etaMinutes > 0
                                        ? '$etaMinutes min'
                                        : (isRouteLoading.value
                                            ? 'Loading...'
                                            : 'Unavailable'),
                                    style: const TextStyle(
                                        fontWeight: FontWeight.bold,),),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 32),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const _StatusStep(
                                label: 'Order',
                                active: orderDone,
                                done: orderDone,),
                            _StatusStep(
                                label: 'Pickup',
                                active: pickupDone,
                                done: pickupDone,),
                            _StatusStep(
                                label: 'Transit',
                                active: transitDone,
                                done: transitDone,),
                            _StatusStep(
                                label: 'Done',
                                active: doneDone,
                                done: doneDone,),
                          ],
                        ),
                        if (routeError.value != null) ...[
                          const SizedBox(height: 12),
                          Text(routeError.value!,
                              style: const TextStyle(
                                  color: Colors.red, fontSize: 12,),),
                        ],
                        const Divider(height: 40),
                        Row(
                          children: [
                            CircleAvatar(
                              backgroundColor: AppTheme.brandSkyBlue,
                              backgroundImage: customer?.photoUrl != null
                                  ? NetworkImage(customer!.photoUrl!)
                                  : null,
                              child: customer?.photoUrl == null
                                  ? const Icon(Icons.person, color: Colors.white)
                                  : null,
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                      customer?.displayName ??
                                          'Customer Name',
                                      style: const TextStyle(
                                          fontWeight: FontWeight.bold,),),
                                  const SizedBox(height: 4),
                                  Text(
                                      customer != null
                                          ? 'Contact: ${customer.email}'
                                          : 'Loading contact info',
                                      style: const TextStyle(fontSize: 12),),
                                ],
                              ),
                            ),
                            IconButton(
                                onPressed: customer != null
                                    ? () {
                                        ScaffoldMessenger.of(context)
                                            .showSnackBar(SnackBar(
                                          content: Text(
                                              'Calling ${customer.displayName}...',),
                                        ),);
                                      }
                                    : null,
                                icon: const Icon(Icons.phone,
                                    color: AppTheme.brandSuccess,),),
                          ],
                        ),
                      ],
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

class _StatusStep extends StatelessWidget {
  final String label;
  final bool active;
  final bool done;
  const _StatusStep(
      {required this.label, required this.active, required this.done,});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: done
                ? AppTheme.brandSuccess
                : (active ? AppTheme.brandSkyBlue : Colors.grey[300]),
            border: Border.all(color: Colors.white, width: 4),
          ),
          child: done
              ? const Icon(Icons.check, size: 12, color: Colors.white)
              : null,
        ),
        const SizedBox(height: 4),
        Text(label,
            style: TextStyle(
                fontSize: 10,
                color: active ? AppTheme.brandNavy : Colors.grey,
                fontWeight: active ? FontWeight.bold : FontWeight.normal,),),
      ],
    );
  }
}
