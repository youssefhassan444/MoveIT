import 'package:flutter/material.dart';

class RouteProgress extends StatelessWidget {
  final double progressFraction;
  final String distanceText;

  const RouteProgress({super.key, required this.progressFraction, required this.distanceText});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Route Progress', style: TextStyle(fontWeight: FontWeight.bold)),
              Text(distanceText, style: const TextStyle(color: Colors.grey)),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(value: progressFraction, minHeight: 8),
          ),
        ],
      ),
    );
  }
}
