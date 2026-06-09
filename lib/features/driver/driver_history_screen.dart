import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../core/widgets/job_card_shimmer.dart';
import '../../core/widgets/error_state_widget.dart';
import '../../services/job_service.dart';
import 'widgets/driver_job_card.dart';

/// A screen that displays the driver's history of completed jobs.
///
/// It fetches the job history from [driverHistoryProvider] and displays
/// it in a scrollable list. If the data is loading or errors out,
/// it shows appropriate fallback states.
class DriverHistoryScreen extends ConsumerWidget {
  /// Creates a [DriverHistoryScreen].
  const DriverHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watch the history of completed jobs from the job service
    final historyAsync = ref.watch(driverHistoryProvider);

    const blue = Color(0xFF0F1F91);

    return Scaffold(
      backgroundColor: Colors.white,

      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        centerTitle: true,

        title: const Text(
          'Trip History',
          style: TextStyle(
            color: Color(0xFF111827),
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: historyAsync.when(
        data: (jobs) {
          // If the list of completed jobs is empty, show a fallback message
          if (jobs.isEmpty) {
            return const Center(
              child: Text('No finished deliveries yet'),
            );
          }

          // Use a refresh indicator to allow pull-to-refresh
          return RefreshIndicator(
            color: blue,

            onRefresh: () async {
              ref.invalidate(driverHistoryProvider);
            },

            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: jobs.length,
              separatorBuilder: (_, __) =>
              const SizedBox(height: 12),

              // Build a card for each completed job
              itemBuilder: (context, index) {
                final job = jobs[index];
                return DriverJobCard(
                  job: job,
                  actionLabel: 'View Details',
                  onTap: () {
                    // Navigate to the job details screen when tapped
                    context.push('/driver/history/${job.id}');
                  },
                );
              },
            ),
          );
        },

        // Show shimmers while the data is loading
        loading: () => ListView.builder(
          itemCount: 5,
          itemBuilder: (context, index) => const JobCardShimmer(),
        ),

        // Show an error widget if the fetch fails
        error: (e, st) => ErrorStateWidget(
          message: e.toString(),
          onRetry: () {
            ref.invalidate(driverHistoryProvider);
          },
        ),
      ),
    );
  }
}