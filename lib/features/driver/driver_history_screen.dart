import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../core/widgets/job_card_shimmer.dart';
import '../../core/widgets/error_state_widget.dart';
import '../../services/job_service.dart';
import 'widgets/driver_job_card.dart';

class DriverHistoryScreen extends ConsumerWidget {
  const DriverHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
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
          if (jobs.isEmpty) {
            return const Center(
              child: Text('No finished deliveries yet'),
            );
          }

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

              itemBuilder: (context, index) {
                final job = jobs[index];
                return DriverJobCard(
                  job: job,
                  actionLabel: 'View Details',
                  onTap: () {
                    context.push('/driver/history/${job.id}');
                  },
                );
              },
            ),
          );
        },

        loading: () => ListView.builder(
          itemCount: 5,
          itemBuilder: (context, index) => const JobCardShimmer(),
        ),

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