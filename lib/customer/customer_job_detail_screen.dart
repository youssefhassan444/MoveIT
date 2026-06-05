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

class CustomerJobDetailScreen extends HookConsumerWidget {
  final String jobId;
  const CustomerJobDetailScreen({super.key, required this.jobId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final jobAsync = ref.watch(singleJobProvider(jobId));
    final job = jobAsync.asData?.value;
    final trackingAsync = ref.watch(trackingProvider(jobId));
    final driverAsync = job != null && job.driverId != null
        ? ref.watch(userByIdProvider(job.driverId!))
        : const AsyncValue.data(null);

    final routeInfo = useState<RouteInfo?>(null);
    final routeError = useState<String?>(null);
    final isRouteLoading = useState<bool>(false);
    final mapController = useMemoized(() => MapController());

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

      fetchRouteInfo(job.pickupLatLng2, job.dropoffLatLng2).then((info) {
        if (cancelled) return;
        routeInfo.value = info;

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
      }).whenComplete(() {
        if (!cancelled) isRouteLoading.value = false;
      });

      return () {
        cancelled = true;
      };
    }, [job?.id],);

    return Scaffold(
      body: Stack(
        children: [
          FlutterMap(
            mapController: mapController,
            options: MapOptions(
              initialCenter:
                  job?.pickupLatLng2 ?? const LatLng(30.0444, 31.2357),
              initialZoom: 13,
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.moveit.egypt',
              ),
              if (routeInfo.value != null)
                PolylineLayer(
                  polylines: [
                    Polyline(
                      points: routeInfo.value!.points,
                      color: AppTheme.brandSkyBlue,
                      strokeWidth: 5,
                    ),
                  ],
                ),
              if (job != null)
                MarkerLayer(
                  markers: [
                    Marker(
                      point: job.pickupLatLng2,
                      child: const Icon(Icons.home,
                          color: AppTheme.brandSkyBlue, size: 40,),
                    ),
                    Marker(
                      point: job.dropoffLatLng2,
                      child: const Icon(Icons.flag,
                          color: AppTheme.brandOrange, size: 40,),
                    ),
                    if (trackingAsync.asData?.value != null)
                      Marker(
                        point: trackingAsync.asData!.value!.latLng,
                        rotate: true,
                        child: Transform.rotate(
                          angle: trackingAsync.asData!.value!.heading *
                              (3.14159 / 180),
                          child: const Icon(Icons.local_shipping,
                              color: AppTheme.brandNavy, size: 40,),
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
                icon: const Icon(Icons.arrow_back, color: AppTheme.brandNavy),
                onPressed: () => Navigator.pop(context),
              ),
            ),
          ),
          DraggableScrollableSheet(
            initialChildSize: 0.35,
            minChildSize: 0.15,
            maxChildSize: 0.65,
            builder: (context, scrollController) {
              final driver = driverAsync.asData?.value;
              final route = routeInfo.value;
              final isAccepted = job?.status == 'accepted';
              final isInTransit = job?.status == 'in_transit';
              final isDelivered = job?.status == 'delivered';

              return Container(
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                  boxShadow: [BoxShadow(blurRadius: 10, color: Colors.black12)],
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
                        const _StatusStep(label: 'Order', active: true, done: true),
                        _StatusStep(
                            label: 'Pickup',
                            active: isAccepted || isInTransit || isDelivered,
                            done: isInTransit || isDelivered,),
                        _StatusStep(
                            label: 'Transit',
                            active: isInTransit || isDelivered,
                            done: isDelivered,),
                        _StatusStep(
                            label: 'Done',
                            active: isDelivered,
                            done: isDelivered,),
                      ],
                    ),
                    const SizedBox(height: 32),
                    if (job != null) ...[
                      Text(job.itemDescription,
                          style: const TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold,),),
                      const SizedBox(height: 8),
                      Text(
                        job.pickupAddress,
                        style:
                            const TextStyle(color: Colors.grey, fontSize: 12),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        job.dropoffAddress,
                        style:
                            const TextStyle(color: Colors.grey, fontSize: 12),
                      ),
                      const SizedBox(height: 24),
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
                                    route?.distanceLabel ??
                                        (isRouteLoading.value
                                            ? 'Calculating...'
                                            : 'Unavailable'),
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
                                    route?.durationLabel ??
                                        (isRouteLoading.value
                                            ? 'Calculating...'
                                            : 'Unavailable'),
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
                      const Divider(height: 32),
                      Row(
                        children: [
                          const CircleAvatar(
                              backgroundColor: AppTheme.brandSkyBlue,
                              child: Icon(Icons.person, color: Colors.white),),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  driver?.displayName ??
                                      'Driver not assigned yet',
                                  style: const TextStyle(
                                      fontWeight: FontWeight.bold,),
                                ),
                                Text(
                                  driver != null
                                      ? (driver.vehicleType ?? 'Driver')
                                      : 'Waiting for assignment',
                                  style: const TextStyle(fontSize: 12),
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            onPressed: () {},
                            icon: const Icon(Icons.phone,
                                color: AppTheme.brandSuccess,),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              );
            },
          ),
        ],
      ),
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
        Text(
          label,
          style: TextStyle(
            fontSize: 10,
            color: active ? AppTheme.brandNavy : Colors.grey,
            fontWeight: active ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ],
    );
  }
}
