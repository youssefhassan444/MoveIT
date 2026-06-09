import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:latlong2/latlong.dart';

/// Data model representing the live location of a driver for a specific job.
/// 
/// Stored in the 'tracking/{jobId}' document in Firestore.
class TrackingModel {
  /// The current geographical coordinates of the driver.
  final GeoPoint driverLatLng;
  
  /// The timestamp of the last location update.
  final DateTime updatedAt;
  
  /// The direction the driver is facing, in degrees (0-360).
  final double heading;

  /// Creates a new [TrackingModel] instance.
  const TrackingModel({
    required this.driverLatLng,
    required this.updatedAt,
    this.heading = 0.0,
  });

  /// Helper getter to convert Firestore's [GeoPoint] to flutter_map's [LatLng].
  LatLng get latLng => LatLng(driverLatLng.latitude, driverLatLng.longitude);

  /// Creates a [TrackingModel] from a Firestore [DocumentSnapshot].
  /// 
  /// Parses the raw document data and provides defaults to prevent crashes.
  factory TrackingModel.fromFirestore(DocumentSnapshot doc) {
    // Extract data as a Map
    final d = doc.data() as Map<String, dynamic>;
    
    return TrackingModel(
      driverLatLng: d['driverLatLng'] as GeoPoint,
      // Convert Timestamp to DateTime safely
      updatedAt: (d['updatedAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      // Cast the heading to double safely
      heading: (d['heading'] as num?)?.toDouble() ?? 0.0,
    );
  }
}
