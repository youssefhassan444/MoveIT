import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../../core/widgets/job_card_shimmer.dart';
import '../../core/widgets/error_state_widget.dart';
import '../../services/job_service.dart';
import '../../models/job_model.dart';
import 'widgets/customer_job_card.dart';

class CustomerJobsScreen extends ConsumerWidget {
  const CustomerJobsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final activeJobsAsync = ref.watch(customerActiveJobsProvider);
    final allJobsAsync = ref.watch(customerJobsProvider);
    final optimisticAsync = ref.watch(optimisticJobsProvider);

    final optimistic = optimisticAsync.when(
      data: (jobs) => jobs,
      loading: () => const <JobModel>[],
      error: (_, __) => const <JobModel>[],
    );

    return Scaffold(
      backgroundColor: Colors.white,
      body: activeJobsAsync.when(
        data: (jobs) {
          final byId = {for (var j in jobs) j.id: j};

          final arrived = optimistic
              .where((o) => byId.containsKey(o.id))
              .map((o) => o.id)
              .toList();

          if (arrived.isNotEmpty) {
            Future.microtask(() => removeOptimisticJobsByIds(arrived));
          }

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
          return allJobsAsync.maybeWhen(
            data: (allJobs) {
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

              for (final o in optimistic) {
                if (!byId.containsKey(o.id)) merged.add(o);
              }

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