import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:intl/intl.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/moveit_loading_shimmer.dart';
import '../../core/widgets/error_state_widget.dart';
import '../../services/job_service.dart';
import '../../models/job_model.dart';

class CustomerJobsScreen extends ConsumerWidget {
  const CustomerJobsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final jobsAsync = ref.watch(customerJobsProvider);

    return Scaffold(
      body: jobsAsync.when(
        data: (jobs) {
          if (jobs.isEmpty) {
            return const Center(child: Text("You haven't posted any jobs yet."));
          }
          return ListView.builder(
            itemCount: jobs.length,
            itemBuilder: (context, index) => _JobCard(job: jobs[index]),
          );
        },
        loading: () => ListView.builder(
          itemCount: 5,
          itemBuilder: (context, index) => const MoveItLoadingShimmer(height: 120),
        ),
        error: (e, st) => ErrorStateWidget(
          message: e.toString(),
          onRetry: () => ref.invalidate(customerJobsProvider),
        ),
      ),
    );
  }
}

class _JobCard extends StatelessWidget {
  final JobModel job;
  const _JobCard({required this.job});

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(symbol: 'EGP ', decimalDigits: 2);
    final dateStr = DateFormat('MMM d, h:mm a').format(job.createdAt);

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        title: Text(job.itemDescription, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.access_time, size: 14, color: Colors.grey[600]),
                const SizedBox(width: 4),
                Text(dateStr, style: TextStyle(fontSize: 12, color: Colors.grey[600])),
              ],
            ),
            const SizedBox(height: 8),
            _StatusChip(status: job.status),
          ],
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(currencyFormat.format(job.pricePiastres / 100), style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.brandOrange, fontSize: 16)),
            const Icon(Icons.chevron_right),
          ],
        ),
        onTap: () {
          // TODO: Navigate to detail
        },
      ),
    );
  }
}

class _StatusChip extends StatelessWidget {
  final String status;
  const _StatusChip({required this.status});

  @override
  Widget build(BuildContext context) {
    Color color;
    IconData icon;
    switch (status) {
      case 'pending': color = Colors.grey; icon = Icons.timer_outlined; break;
      case 'accepted': color = AppTheme.brandSkyBlue; icon = Icons.check_circle_outline; break;
      case 'in_transit': color = AppTheme.brandOrange; icon = Icons.local_shipping_outlined; break;
      case 'delivered': color = AppTheme.brandSuccess; icon = Icons.done_all; break;
      default: color = Colors.grey; icon = Icons.help_outline;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withAlpha((0.1 * 255).round()),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withAlpha((0.5 * 255).round())),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: color),
          const SizedBox(width: 4),
          Text(status.replaceAll('_', ' ').toUpperCase(), style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
