import 'package:flutter/material.dart';

/// A simple progress bar widget used to display routing or delivery progress.
///
/// It visually represents the progress fraction and provides a text label
/// (e.g., remaining distance) alongside the bar.
class RouteProgress extends StatelessWidget {
  /// The fractional progress of the route (0.0 to 1.0).
  final double progressFraction;
  /// A text string describing the remaining distance or time.
  final String distanceText;

  /// Creates a [RouteProgress] indicator.
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
