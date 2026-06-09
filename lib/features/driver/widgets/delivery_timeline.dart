import 'package:flutter/material.dart';

/// Represents a single event step in the [DeliveryTimeline].
class TimelineStep {
  /// The title of the step (e.g., "Order Placed").
  final String title;
  /// Additional details or address for the step.
  final String subtitle;
  /// The formatted time string when the step occurred.
  final String time;
  /// Indicates if this step has already been completed.
  final bool completed;

  /// Creates a [TimelineStep].
  TimelineStep({required this.title, required this.subtitle, required this.time, this.completed = false});
}

/// A vertical timeline visualization of the delivery progress,
/// showing a list of [TimelineStep] objects sequentially.
class DeliveryTimeline extends StatelessWidget {
  /// The list of steps to display.
  final List<TimelineStep> steps;

  /// Creates a [DeliveryTimeline].
  const DeliveryTimeline({super.key, required this.steps});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Column(
        children: steps.map((s) {
          return Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Column(children: [
                Icon(s.completed ? Icons.check_circle : Icons.radio_button_unchecked, color: s.completed ? Colors.green : Colors.grey),
                const SizedBox(height: 8),
              ],),
              const SizedBox(width: 12),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(s.title, style: const TextStyle(fontWeight: FontWeight.bold)), Text(s.subtitle, style: const TextStyle(color: Colors.black87)), const SizedBox(height: 6)]),
              ),
              Text(s.time, style: const TextStyle(color: Colors.black87, fontSize: 12)),
            ],
          );
        }).toList(),
      ),
    );
  }
}
