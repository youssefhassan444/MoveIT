import 'package:flutter/material.dart';
import '../../../models/job_model.dart';

class DeliveryDetailsCard extends StatelessWidget {
  final JobModel job;

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
          _row('Weight', '—'),
          _row('Pickup', job.pickupAddress),
          _row('Dropoff', job.dropoffAddress),
          const SizedBox(height: 8),
          Row(mainAxisAlignment: MainAxisAlignment.end, children: [Text('${(job.pricePiastres / 100).toStringAsFixed(2)} EGP', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green))]),
        ],),
      ),
    );
  }

  Widget _row(String label, String value) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [Text(label, style: const TextStyle(color: Colors.grey)), Expanded(child: Text(value, textAlign: TextAlign.right))],
        ),
      );
}
