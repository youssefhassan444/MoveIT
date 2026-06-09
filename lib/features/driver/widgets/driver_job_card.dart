import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../models/job_model.dart';

/// A card widget that displays a summary of a job for the driver.
///
/// Shows the job description, price, pickup and dropoff locations,
/// creation time, and status. It optionally displays an action button
/// if [onTap] is provided.
class DriverJobCard extends StatelessWidget {
  /// The job data to display.
  final JobModel job;
  /// Callback triggered when the action button is pressed.
  final VoidCallback? onTap;
  /// The text to display on the action button. Defaults to 'View Details'.
  final String? actionLabel;

  /// Creates a [DriverJobCard].
  const DriverJobCard({
    super.key,
    required this.job,
    this.onTap,
    this.actionLabel,
  });

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(
      symbol: 'EGP ',
      decimalDigits: 2,
    );

    final dateStr = DateFormat('MMM d, h:mm a')
        .format(job.createdAt);

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

                _StatusBadge(status: job.status),
              ],
            ),

            if (onTap != null) ...[
              const SizedBox(height: 14),

              SizedBox(
                width: double.infinity,

                child: ElevatedButton(
                  onPressed: onTap,

                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: darkBlue,
                    elevation: 0,

                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),

                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),

                  child: Text(
                    actionLabel ?? 'View Details',
                    style: const TextStyle(
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

/// A visual badge that displays the status of a job.
class _StatusBadge extends StatelessWidget {
  /// The current status string.
  final String status;

  /// Creates a [_StatusBadge].
  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    Color color;

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