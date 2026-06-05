import 'package:flutter/material.dart';

/// Minimal driver profile card skeleton (non-functional placeholder)
class DriverProfileCard extends StatelessWidget {
  final String name;
  final double rating;
  final int trips;
  final String vehicle;
  final String plate;
  final String? photoUrl;

  const DriverProfileCard({
    super.key,
    required this.name,
    required this.rating,
    required this.trips,
    required this.vehicle,
    required this.plate,
    this.photoUrl,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            CircleAvatar(radius: 28, backgroundImage: photoUrl != null ? NetworkImage(photoUrl!) : null, child: photoUrl == null ? const Icon(Icons.person) : null),
            const SizedBox(width: 12),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  Expanded(child: Text(name, style: const TextStyle(fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis)),
                  const SizedBox(width: 8),
                  Text('VERIFIED', style: TextStyle(color: Colors.green[400], fontSize: 12)),
                ],),
                const SizedBox(height: 6),
                Row(children: [const Icon(Icons.star, size: 14, color: Colors.amber), const SizedBox(width:6), Flexible(child: Text('$rating · $trips trips', style: const TextStyle(color: Colors.grey), overflow: TextOverflow.ellipsis))]),
              ],),
            ),
            ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 120),
              child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [Text(vehicle, style: const TextStyle(fontSize: 12), overflow: TextOverflow.ellipsis), const SizedBox(height: 6), Text(plate, style: const TextStyle(fontWeight: FontWeight.bold))]),
            ),
          ],
        ),
      ),
    );
  }
}
