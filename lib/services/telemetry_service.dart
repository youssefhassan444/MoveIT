import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';

/// Service for logging critical application events and driver metrics to Firestore.
/// 
/// Used to track driver behavior, job state changes, and debug issues remotely.
class TelemetryService {
  /// Logs a structured telemetry event to the 'telemetry' collection.
  /// 
  /// Captures contextual data like location, job status, and potential errors.
  static Future<void> logEvent({
    required String jobId,
    required String driverId,
    required String action,
    double? driverLat,
    double? driverLng,
    double? distanceToTarget,
    String? currentJobStatus,
    String? error,
  }) async {
    try {
      final col = FirebaseFirestore.instance.collection('telemetry');
      
      // Add a new document with the event details
      await col.add({
        'jobId': jobId,
        'driverId': driverId,
        'timestamp': FieldValue.serverTimestamp(),
        'action': action,
        // Only store location if both lat and lng are provided
        'driverLocation': (driverLat != null && driverLng != null)
            ? GeoPoint(driverLat, driverLng)
            : null,
        'distanceToTargetMeters': distanceToTarget,
        'currentJobStatus': currentJobStatus,
        'error': error,
        // Hardcoded device info for debugging, could be dynamic in the future
        'deviceInfo': 'RMX3630 (Realme 10) - Active Driver Debug Testing',
        'platform': kIsWeb ? 'web' : 'mobile',
      });
      debugPrint('🔥 [Telemetry] Logged action "$action" for job $jobId');
    } catch (e) {
      // Fail silently to the user, but print to debug console
      debugPrint('🔥 [Telemetry] Failed to log telemetry: $e');
    }
  }
}
