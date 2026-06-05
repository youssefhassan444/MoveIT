import 'package:flutter/material.dart';

class TimelineStep {
  final String title;
  final String subtitle;
  final String time;
  final bool completed;

  TimelineStep({required this.title, required this.subtitle, required this.time, this.completed = false});
}

class DeliveryTimeline extends StatelessWidget {
  final List<TimelineStep> steps;

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
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(s.title, style: const TextStyle(fontWeight: FontWeight.bold)), Text(s.subtitle, style: const TextStyle(color: Colors.grey)), const SizedBox(height: 6)]),
              ),
              Text(s.time, style: const TextStyle(color: Colors.grey, fontSize: 12)),
            ],
          );
        }).toList(),
      ),
    );
  }
}
