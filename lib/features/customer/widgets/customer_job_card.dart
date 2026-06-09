import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';
import '../../../models/job_model.dart';
import '../../../services/job_service.dart';

/// A widget that displays a summary card for a specific job.
///
/// It shows details such as item description, price, pickup/dropoff addresses,
/// creation time, and the current status of the job. Also provides action buttons
/// based on the job status (e.g., Repost or View Details).
class CustomerJobCard extends ConsumerWidget {
  /// The job model containing the data to display.
  final JobModel job;

  /// Creates a [CustomerJobCard].
  const CustomerJobCard({super.key, required this.job});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Formatter to display the price in EGP.
    final currencyFormat = NumberFormat.currency(
      symbol: 'EGP ',
      decimalDigits: 2,
    );

    final dateStr = DateFormat('MMM d, h:mm a').format(job.createdAt);

    const darkBlue = Color(0xFF0F1F91);
    const softOrange = Color(0xFFFF8A3D);

    return Container(
      margin: const EdgeInsets.only(bottom: 16),

      decoration: BoxDecoration(
        color: darkBlue,
        borderRadius: BorderRadius.circular(20),

        boxShadow: [
          BoxShadow(
            color: darkBlue.withValues(alpha: 0.3),
            blurRadius: 14,
            offset: const Offset(0, 6),
          ),
        ],
      ),

      child: Padding(
        padding: const EdgeInsets.all(16),

        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// TITLE + PRICE
            Row(
              children: [
                Expanded(
                  child: Text(
                    job.itemDescription,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),

                const SizedBox(width: 10),

                Text(
                  currencyFormat.format(job.pricePiastres / 100),
                  style: const TextStyle(
                    color: softOrange,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            /// PICKUP
            Row(
              children: [
                const Icon(
                  Icons.location_on_outlined,
                  size: 18,
                  color: softOrange,
                ),

                const SizedBox(width: 8),

                Expanded(
                  child: Text(
                    job.pickupAddress,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 10),

            /// DROPOFF
            Row(
              children: [
                const Icon(
                  Icons.flag_outlined,
                  size: 18,
                  color: Colors.white70,
                ),

                const SizedBox(width: 8),

                Expanded(
                  child: Text(
                    job.dropoffAddress,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            /// FOOTER
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.access_time_rounded,
                      size: 14,
                      color: Colors.white70,
                    ),

                    const SizedBox(width: 6),

                    Text(
                      dateStr,
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),

                _CustomerStatusBadge(status: job.status),
              ],
            ),

            const SizedBox(height: 14),

            if (job.status == 'cancelled') ...[
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        context.push('/customer/jobs/${job.id}');
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white.withValues(alpha: 0.15),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                          side: const BorderSide(color: Colors.white24),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: const Text(
                        'Details',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () async {
                        final confirm = await showDialog<bool>(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: const Text('Repost Job?'),
                            content: const Text('Would you like to repost this job with the same delivery details?'),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context, false),
                                child: const Text('CANCEL'),
                              ),
                              TextButton(
                                onPressed: () => Navigator.pop(context, true),
                                child: const Text('REPOST', style: TextStyle(color: softOrange)),
                              ),
                            ],
                          ),
                        );
                        if (confirm == true) {
                          final error = await repostJob(job.id);
                          if (error != null && context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text(error), backgroundColor: Colors.red),
                            );
                          } else if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Job reposted successfully!'),
                                backgroundColor: Colors.green,
                              ),
                            );
                          }
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: softOrange,
                        foregroundColor: Colors.white,
                        elevation: 2,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: const Text(
                        'Repost Job',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ] else ...[
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    context.push('/customer/jobs/${job.id}');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: darkBlue,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  child: const Text(
                    'View Details',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

/// A small badge widget to visually indicate the current status of a job.
class _CustomerStatusBadge extends StatelessWidget {
  /// The raw status string from the backend (e.g. 'pending', 'accepted').
  final String status;

  /// Creates a [_CustomerStatusBadge].
  const _CustomerStatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    Color color;

    // Determine the badge color based on the job status.

    switch (status) {
      case 'pending':
        color = Colors.white70;
        break;
      case 'accepted':
        color = Colors.lightBlueAccent;
        break;
      case 'in_transit':
        color = Colors.orange;
        break;
      case 'delivered':
        color = Colors.greenAccent;
        break;
      case 'cancelled':
        color = Colors.redAccent;
        break;
      default:
        color = Colors.white70;
    }

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 10,
        vertical: 4,
      ),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
