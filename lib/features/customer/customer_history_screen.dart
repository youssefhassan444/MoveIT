import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../../core/widgets/job_card_shimmer.dart';
import '../../core/widgets/error_state_widget.dart';
import '../../services/job_service.dart';
import 'widgets/customer_job_card.dart';

class CustomerHistoryScreen extends ConsumerWidget {
  const CustomerHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final historyAsync = ref.watch(customerHistoryProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        title: const Text('Trip History'),
        centerTitle: true,
      ),
      body: historyAsync.when(
        data: (jobs) {
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

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: jobs.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) =>
                CustomerJobCard(job: jobs[index]),
          );
        },
        loading: () => ListView.separated(
          padding: const EdgeInsets.all(16),
          itemCount: 5,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) => const JobCardShimmer(),
        ),
        error: (e, st) => ErrorStateWidget(
          message: e.toString(),
          onRetry: () => ref.invalidate(customerHistoryProvider),
        ),
      ),
    );
  }
}