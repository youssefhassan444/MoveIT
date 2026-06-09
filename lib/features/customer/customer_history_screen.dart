import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../../core/widgets/job_card_shimmer.dart';
import '../../core/widgets/error_state_widget.dart';
import '../../services/job_service.dart';
import 'widgets/customer_job_card.dart';

/// A screen that displays the history of completed trips/jobs for a customer.
///
/// It listens to the [customerHistoryProvider] to fetch and display the data.
/// Handles loading, error, empty, and populated states.
class CustomerHistoryScreen extends ConsumerWidget {
  /// Creates a [CustomerHistoryScreen].
  const CustomerHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watch the history provider to get the latest asynchronous job history data.
    final historyAsync = ref.watch(customerHistoryProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      // The application bar showing the screen title.
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        title: const Text('Trip History'),
        centerTitle: true,
      ),
      // Handle the various states of the asynchronous data.
      body: historyAsync.when(
        data: (jobs) {
          // If the list of jobs is empty, display a placeholder.
          if (jobs.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.history, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text(
                    'No finished deliveries.',
                    style: TextStyle(color: Colors.grey, fontSize: 16),
                  ),
                ],
              ),
            );
          }

          // Render a list of completed jobs using [CustomerJobCard].
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: jobs.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) =>
                CustomerJobCard(job: jobs[index]),
          );
        },
        // Display shimmering placeholder cards while loading.
        loading: () => ListView.separated(
          padding: const EdgeInsets.all(16),
          itemCount: 5,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) => const JobCardShimmer(),
        ),
        // Display an error widget if fetching history fails, with a retry option.
        error: (e, st) => ErrorStateWidget(
          message: e.toString(),
          onRetry: () => ref.invalidate(customerHistoryProvider),
        ),
      ),
    );
  }
}