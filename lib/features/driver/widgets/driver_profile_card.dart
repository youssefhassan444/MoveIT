import 'package:flutter/material.dart';

/// Minimal driver profile card skeleton (non-functional placeholder)
/// 
/// Intended to display the driver's basic profile stats:
/// name, rating, trips count, and vehicle information.
class DriverProfileCard extends StatelessWidget {
  /// The driver's name.
  final String name;
  /// The driver's star rating (0.0 to 5.0).
  final double rating;
  /// The total number of trips completed.
  final int trips;
  /// The type or name of the driver's vehicle.
  final String vehicle;
  /// The license plate of the driver's vehicle.
  final String plate;
  /// An optional URL for the driver's profile picture.
  final String? photoUrl;

  /// Creates a [DriverProfileCard].
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
      color: const Color(0xFF1E2124),
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            CircleAvatar(radius: 28, backgroundImage: photoUrl != null ? NetworkImage(photoUrl!) : null, child: photoUrl == null ? const Icon(Icons.person) : null),
            const SizedBox(width: 12),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center, children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 16), maxLines: 1, overflow: TextOverflow.ellipsis),
              ],),
            ),
          ],
        ),
      ),
    );
  }
}
