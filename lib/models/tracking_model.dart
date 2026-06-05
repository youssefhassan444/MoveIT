import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:latlong2/latlong.dart';

/// Live driver location for a specific job — Firestore tracking/{jobId}.
class TrackingModel {
  final GeoPoint driverLatLng;
  final DateTime updatedAt;
  final double heading;

  const TrackingModel({
    required this.driverLatLng,
    required this.updatedAt,
    this.heading = 0.0,
  });

  LatLng get latLng => LatLng(driverLatLng.latitude, driverLatLng.longitude);

  factory TrackingModel.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    return TrackingModel(
      driverLatLng: d['driverLatLng'] as GeoPoint,
      updatedAt: (d['updatedAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      heading: (d['heading'] as num?)?.toDouble() ?? 0.0,
    );
  }
}
