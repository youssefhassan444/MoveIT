import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:latlong2/latlong.dart';

import '../../models/job_model.dart';
import '../../services/auth_service.dart';
import '../../services/job_service.dart';
import '../../services/location_service.dart';

import 'widgets/job_board_filters.dart';
import 'widgets/job_board_item.dart';
import '../../core/widgets/location_address_banner.dart';

/// The main dashboard for drivers to view and accept available jobs.
///
/// It displays today's earnings and distance, a list of pending jobs,
/// and allows the driver to filter and accept new deliveries.
class JobBoardScreen extends HookConsumerWidget {
  /// Creates a [JobBoardScreen].
  const JobBoardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watch relevant providers for jobs, authentication, and driver history
    final jobsAsync = ref.watch(pendingJobsProvider);
    final optimisticAsync = ref.watch(optimisticJobsProvider);
    final authState = ref.watch(authStateChangesProvider);
    final historyAsync = ref.watch(driverHistoryProvider);

    // Local state for tracking which job is currently being accepted
    final acceptingJobId = useState<String?>(null);
    
    // Local state for the selected filter option
    final selectedFilter = useState<String>('All');

    // Calculate today's earnings and distance from the driver's history
    int todayEarnings = 0;
    double todayDistanceKm = 0.0;
    final now = DateTime.now();

    if (historyAsync.value != null) {
      for (final job in historyAsync.value!) {
        // Only consider delivered jobs with a valid delivery timestamp
        if (job.status == 'delivered' && job.deliveredAt != null) {
          if (job.deliveredAt!.year == now.year &&
              job.deliveredAt!.month == now.month &&
              job.deliveredAt!.day == now.day) {
            todayEarnings += job.netEarningsPiastres;
            
            final distanceMeters = const Distance().as(
              LengthUnit.Meter,
              job.pickupLatLng2,
              job.dropoffLatLng2,
            );
            todayDistanceKm += (distanceMeters / 1000);
          }
        }
      }
    }

    final earningsString = (todayEarnings / 100).toStringAsFixed(2);
    final distanceString = '${(todayDistanceKm * 0.621371).toStringAsFixed(1)} mi';

    // Request location permissions when the screen is first built
    useEffect(() {
      WidgetsBinding.instance.addPostFrameCallback((_) async {
        final locService = ref.read(locationServiceProvider);
        await locService.requestPermission();
      });
      return null;
    }, const [],);

    // Handle the job acceptance flow
    Future<void> handleAcceptJob(JobModel job) async {
      if (acceptingJobId.value != null) return;

      acceptingJobId.value = job.id;

      final messenger = ScaffoldMessenger.of(context);
      final router = GoRouter.of(context);

      final user = authState.asData?.value;

      if (user == null) {
        acceptingJobId.value = null;

        messenger.showSnackBar(
          const SnackBar(
            content: Text('No authenticated user found'),
            backgroundColor: Colors.red,
          ),
        );

        return;
      }

      final error = await acceptJob(job.id, user.uid);

      acceptingJobId.value = null;

      if (error != null) {
        messenger.showSnackBar(
          SnackBar(
            content: Text(error),
            backgroundColor: Colors.red,
          ),
        );
      } else {
        messenger.showSnackBar(
          const SnackBar(
            content: Text('Job accepted successfully'),
            backgroundColor: Color(0xFF0F1F91),
          ),
        );

        router.go('/driver/active');
      }
    }

    const blue = Color(0xFF0F1F91);
    const orange = Color(0xFFFF7A00);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            const Padding(
              padding: EdgeInsets.fromLTRB(16, 16, 16, 0),
              child: LocationAddressBanner(),
            ),
            Expanded(
              child: jobsAsync.when(
                loading: () => const Center(
                  child: CircularProgressIndicator(color: blue),
                ),

                error: (e, __) => Center(child: Text('Error: $e')),

                data: (jobs) {
                  // Merge optimistic jobs (local state) with server data
                  final optimistic = optimisticAsync.asData?.value ?? [];

                  final Map<String, JobModel> byId = {};

                  for (final o in optimistic) {
                    byId[o.id] = o;
                  }

                  for (final j in jobs) {
                    byId.putIfAbsent(j.id, () => j);
                  }

                  // Sort merged jobs by creation time (newest first)
                  final merged = byId.values.toList()
                    ..sort((a, b) => b.createdAt.compareTo(a.createdAt));

                  // Apply current filter selection
                  final filtered = selectedFilter.value == 'All'
                      ? merged
                      : merged.where((_) => true).toList();

                  return Column(
                    children: [
                      const SizedBox(height: 12),

                /// HEADER WITH ORANGE TEXT
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),

                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(14),

                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [blue, Color(0xFF1D4ED8)],
                      ),
                      borderRadius: BorderRadius.circular(18),
                      boxShadow: [
                        BoxShadow(
                          color: blue.withValues(alpha: 0.15),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),

                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [

                        /// TITLE WITH ORANGE
                        const Row(
                          children: [
                            Text(
                              'Today ',
                              style: TextStyle(
                                color: Colors.white70,
                                fontSize: 14,
                              ),
                            ),
                            Text(
                              'Earnings',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 6),

                        /// AMOUNT WITH ORANGE SYMBOL
                        RichText(
                          text: TextSpan(
                            children: [
                              const TextSpan(
                                text: 'EGP ',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              TextSpan(
                                text: earningsString,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 12),

                        Row(
                          children: [
                            Expanded(
                              child: _smallInfoBox(
                                icon: Icons.route,
                                title: 'Distance',
                                value: distanceString,
                                color: const Color(0xFFE0F2FE),
                                textColor: orange, // 🔥 orange accent
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 14),

                /// FILTERS
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: JobBoardFilters(
                    selected: selectedFilter.value,
                    onSelected: (s) => selectedFilter.value = s,
                  ),
                ),

                const SizedBox(height: 12),

                /// LIST
                Expanded(
                  child: filtered.isEmpty
                      ? const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [

                        Icon(
                          Icons.inbox_outlined,
                          size: 60,
                          color: Color(0xFF9CA3AF),
                        ),

                        SizedBox(height: 12),

                        Text(
                          'No jobs available',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF6B7280),
                          ),
                        ),

                        SizedBox(height: 6),

                        Text(
                          'Try changing filters or check again later',
                          style: TextStyle(
                            fontSize: 13,
                            color: Color(0xFF9CA3AF),
                          ),
                        ),
                      ],
                    ),
                  )
                      : ListView.separated(
                    padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
                    itemCount: filtered.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 14),
                    itemBuilder: (context, index) {
                      final job = filtered[index];

                      return Container(
                        decoration: BoxDecoration(
                          color: const Color(0xFF0F1F91),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(8),
                          child: JobBoardItem(
                            job: job,
                            accepting: acceptingJobId.value == job.id,
                            onAccept: () => handleAcceptJob(job),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            );
          },
        ),
      ),
    ],
  ),
),
);
  }

  static Widget _smallInfoBox({
    required IconData icon,
    required String title,
    required String value,
    required Color color,
    required Color textColor,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 10),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Icon(icon, color: textColor, size: 20),
          const SizedBox(height: 6),
          Text(
            title,
            style: TextStyle(
              color: textColor.withValues(alpha: 0.8),
              fontSize: 11,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            value,
            style: TextStyle(
              color: textColor,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}