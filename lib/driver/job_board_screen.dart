import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:latlong2/latlong.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../models/job_model.dart';
import '../../services/location_service.dart';
import '../../services/auth_service.dart';
import '../../services/job_service.dart';
import '../../core/widgets/location_address_banner.dart';
import '../../core/widgets/moveit_loading_shimmer.dart';

class JobBoardScreen extends HookConsumerWidget {
  const JobBoardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    
    final userAsync = ref.watch(currentUserDocProvider);
    final isVerified = userAsync.asData?.value?.isVerified ?? true; // Default true during load
    
    final jobsAsync = ref.watch(pendingJobsProvider);
    final mapController = useMemoized(() => MapController());
    final driverPosition = useState<LatLng?>(null);

    useEffect(() {
      if (!isVerified) return null; // Don't fetch location if not verified
      
      Future<void> initDriverLocation() async {
        debugPrint('📍 [JobBoardScreen:initDriverLocation] Started driver location sequence...');
        final locService = ref.read(locationServiceProvider);
        
        debugPrint('📍 [JobBoardScreen:initDriverLocation] Fetching coordinates...');
        final pos = await locService.getCurrentLocation();
        if (pos != null) {
          debugPrint('📍 [JobBoardScreen:initDriverLocation] Success! Received position: (${pos.latitude}, ${pos.longitude})');
          final latlng = LatLng(pos.latitude, pos.longitude);
          driverPosition.value = latlng;
          mapController.move(latlng, 13);
        } else {
          debugPrint('📍 [JobBoardScreen:initDriverLocation] Failed to retrieve coordinates (getCurrentLocation returned null). Map remains at default.');
        }
      }
      initDriverLocation();
      return null;
    }, [isVerified],);

    if (userAsync.isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (!isVerified) {
      return const _PendingVerificationScreen();
    }

    return Scaffold(
      body: Stack(
        children: [
          // FULL SCREEN MAP
          FlutterMap(
            mapController: mapController,
            options: const MapOptions(
              initialCenter: LatLng(30.0444, 31.2357),
              initialZoom: 12,
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.moveit.egypt',
              ),
              MarkerLayer(
                markers: [
                  if (driverPosition.value != null)
                    Marker(
                      point: driverPosition.value!,
                      child: Container(
                        decoration: BoxDecoration(
                          color: AppTheme.brandOrange.withValues(alpha: 0.1),
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.blue, width: 2),
                        ),
                        child: const Center(
                          child: Icon(
                            Icons.navigation,
                            color: Colors.blue,
                            size: 16,
                          ),
                        ),
                      ),
                    ),
                  ...jobsAsync.maybeWhen(
                    data: (jobs) => jobs.map((job) => Marker(
                      point: LatLng(job.pickupLatLng.latitude, job.pickupLatLng.longitude),
                      child: const Icon(Icons.location_on, color: AppTheme.brandOrange, size: 30),
                    ),).toList(),
                    orElse: () => [],
                  ),
                ],
              ),
            ],
          ),

          // DRIVER LOCATION BANNER (OVERLAY ON MAP TOP)
          const Positioned(
            top: 16,
            left: 16,
            right: 16,
            child: LocationAddressBanner(),
          ),

          // DRAGGABLE BOTTOM SHEET
          DraggableScrollableSheet(
            initialChildSize: 0.3,
            minChildSize: 0.1,
            maxChildSize: 0.8,
            builder: (context, scrollController) {
              return Container(
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                  boxShadow: [BoxShadow(blurRadius: 10, color: Colors.black12)],
                ),
                child: jobsAsync.when(
                  data: (jobs) {
                    if (jobs.isEmpty) {
                      return ListView(
                        controller: scrollController,
                        padding: const EdgeInsets.all(24),
                        children: [
                          Center(
                            child: Container(width: 40, height: 5, decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(5))),
                          ),
                          const SizedBox(height: 24),
                          Text('Available Jobs', style: Theme.of(context).textTheme.headlineMedium, textAlign: TextAlign.center),
                          const SizedBox(height: 32),
                          const Center(child: Text('No jobs available right now. Keep an eye out!', style: TextStyle(color: Colors.grey))),
                        ],
                      );
                    }
                    return ListView.builder(
                      controller: scrollController,
                      padding: const EdgeInsets.all(24),
                      itemCount: jobs.length + 1,
                      itemBuilder: (context, index) {
                        if (index == 0) {
                          return Column(
                            children: [
                              Container(width: 40, height: 5, decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(5))),
                              const SizedBox(height: 24),
                              Text('Available Jobs', style: Theme.of(context).textTheme.headlineMedium),
                              const SizedBox(height: 16),
                            ],
                          );
                        }
                        return _JobBoardCard(job: jobs[index - 1]);
                      },
                    );
                  },
                  loading: () => ListView.builder(
                    controller: scrollController,
                    padding: const EdgeInsets.all(24),
                    itemCount: 4,
                    itemBuilder: (context, index) {
                      if (index == 0) {
                        return Column(
                          children: [
                            Container(width: 40, height: 5, decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(5))),
                            const SizedBox(height: 24),
                            Text('Available Jobs', style: Theme.of(context).textTheme.headlineMedium),
                            const SizedBox(height: 16),
                          ],
                        );
                      }
                      return const MoveItLoadingShimmer(height: 120);
                    },
                  ),
                  error: (e, _) => Center(child: Text('Error loading jobs: $e')),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _JobBoardCard extends StatelessWidget {
  final JobModel job;
  const _JobBoardCard({required this.job});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(job.itemDescription, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                Text(
                  '${(job.pricePiastres / 100).toStringAsFixed(0)} EGP',
                  style: const TextStyle(color: AppTheme.brandOrange, fontWeight: FontWeight.bold, fontSize: 18),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.location_on_outlined, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(job.pickupAddress, style: const TextStyle(color: Colors.grey), maxLines: 1, overflow: TextOverflow.ellipsis),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () {
                // Accept job logic would go here
              },
              child: const Text('View Details'),
            ),
          ],
        ),
      ),
    );
  }
}

class _PendingVerificationScreen extends ConsumerWidget {
  const _PendingVerificationScreen();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Verification Pending', style: TextStyle(color: Colors.black)),
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.red),
            onPressed: () async {
              await ref.read(authServiceProvider).signOut();
              if (context.mounted) {
                context.go('/auth');
              }
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.hourglass_top, size: 100, color: AppTheme.brandOrange),
            const SizedBox(height: 32),
            const Text(
              'Account Under Review',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.brandNavy),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            const Text(
              'We are currently reviewing your documents (National ID and Vehicle License). This usually takes 1-2 business days. You will be able to access the Job Board once approved.',
              style: TextStyle(fontSize: 16, color: Colors.grey, height: 1.5),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 48),
            ElevatedButton.icon(
              onPressed: () {
                // TODO: Upload documents logic
              },
              icon: const Icon(Icons.upload_file),
              label: const Text('Upload Documents'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.brandNavy,
                foregroundColor: Colors.white,
                minimumSize: const Size(double.infinity, 56),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
