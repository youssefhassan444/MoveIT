import 'package:flutter/material.dart';
import '../../../models/job_model.dart';

/// A card that displays detailed information about a specific delivery job,
/// including the order ID, item descriptions, weight, addresses, and price.
class DeliveryDetailsCard extends StatelessWidget {
  /// The job whose details will be displayed.
  final JobModel job;

  /// Creates a [DeliveryDetailsCard].
  const DeliveryDetailsCard({super.key, required this.job});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('Delivery Details', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          _row('Order ID', job.id),
          _row('Items', job.itemDescription),
          _row('Weight', job.itemWeightKg != null ? '${job.itemWeightKg} kg' : 'Not specified'),
          _row('Pickup', job.pickupAddress),
          _row('Dropoff', job.dropoffAddress),
          const SizedBox(height: 8),
          Row(mainAxisAlignment: MainAxisAlignment.end, children: [Text('${(job.pricePiastres / 100).toStringAsFixed(2)} EGP', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green))]),
        ],),
      ),
    );
  }

  /// Helper to build a two-column row with a label and a value.
  Widget _row(String label, String value) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [Text(label, style: const TextStyle(color: Colors.white70)), Expanded(child: Text(value, textAlign: TextAlign.right, style: const TextStyle(fontWeight: FontWeight.w500)))],
        ),
      );
}
