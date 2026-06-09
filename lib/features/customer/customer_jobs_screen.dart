import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../../core/widgets/job_card_shimmer.dart';
import '../../core/widgets/error_state_widget.dart';
import '../../services/job_service.dart';
import '../../models/job_model.dart';
import 'widgets/customer_job_card.dart';

/// A screen that displays the active jobs for a customer.
///
/// It combines actual jobs fetched from the backend with optimistic jobs
/// that have been created locally but might not have been fully synchronized yet.
class CustomerJobsScreen extends ConsumerWidget {
  /// Creates a [CustomerJobsScreen].
  const CustomerJobsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watch providers for active jobs, all jobs, and optimistic jobs.
    final activeJobsAsync = ref.watch(customerActiveJobsProvider);
    final allJobsAsync = ref.watch(customerJobsProvider);
    final optimisticAsync = ref.watch(optimisticJobsProvider);

    // Resolve the optimistic jobs, defaulting to an empty list on loading or error.
    final optimistic = optimisticAsync.when(
      data: (jobs) => jobs,
      loading: () => const <JobModel>[],
      error: (_, __) => const <JobModel>[],
    );

    return Scaffold(
      backgroundColor: Colors.white,
      body: activeJobsAsync.when(
        data: (jobs) {
          // Create a map of active jobs by ID for quick lookup.
          final byId = {for (var j in jobs) j.id: j};

          // Find optimistic jobs that have now arrived from the backend.
          final arrived = optimistic
              .where((o) => byId.containsKey(o.id))
              .map((o) => o.id)
              .toList();

          // Remove the arrived optimistic jobs from the local state.
          if (arrived.isNotEmpty) {
            Future.microtask(() => removeOptimisticJobsByIds(arrived));
          }

          // Merge actual jobs and remaining optimistic jobs.
          final merged = <JobModel>[];
          merged.addAll(jobs);

          for (final o in optimistic) {
            if (!byId.containsKey(o.id)) merged.add(o);
          }

          if (merged.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.local_shipping_outlined,
                      size: 64, color: Colors.grey,),
                  SizedBox(height: 16),
                  Text(
                    'No active deliveries.',
                    style: TextStyle(color: Colors.grey, fontSize: 16),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Post a job or repost a cancelled one.',
                    style: TextStyle(color: Colors.grey, fontSize: 13),
                  ),
                ],
              ),
            );
          }

          merged.sort((a, b) => b.createdAt.compareTo(a.createdAt));

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: merged.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) =>
                CustomerJobCard(job: merged[index]),
          );
        },
        loading: () {
          // While loading active jobs, try to fallback to the `allJobs` provider.
          return allJobsAsync.maybeWhen(
            data: (allJobs) {
              // Filter out jobs that are not in an active state.
              final fallback = allJobs
                  .where((j) => [
                'pending',
                'accepted',
                'in_transit',
                'cancelled',
              ].contains(j.status),)
                  .toList();

              final byId = {for (var j in fallback) j.id: j};
              final merged = <JobModel>[];

              merged.addAll(fallback);

              // Include optimistic jobs that aren't in the fallback list.
              for (final o in optimistic) {
                if (!byId.containsKey(o.id)) merged.add(o);
              }

              // If there are merged jobs, display them sorted by creation time.
              if (merged.isNotEmpty) {
                merged.sort((a, b) => b.createdAt.compareTo(a.createdAt));
                return ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: merged.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) =>
                      CustomerJobCard(job: merged[index]),
                );
              }

              // Otherwise, show shimmering placeholders.
              return ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: 5,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) => const JobCardShimmer(),
              );
            },
            orElse: () => ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: 5,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) => const JobCardShimmer(),
            ),
          );
        },
        error: (e, st) => ErrorStateWidget(
          message: e.toString(),
          onRetry: () => ref.invalidate(customerActiveJobsProvider),
        ),
      ),
    );
  }
}