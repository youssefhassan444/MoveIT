import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';

class TelemetryService {
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
      await col.add({
        'jobId': jobId,
        'driverId': driverId,
        'timestamp': FieldValue.serverTimestamp(),
        'action': action,
        'driverLocation': (driverLat != null && driverLng != null)
            ? GeoPoint(driverLat, driverLng)
            : null,
        'distanceToTargetMeters': distanceToTarget,
        'currentJobStatus': currentJobStatus,
        'error': error,
        'deviceInfo': 'RMX3630 (Realme 10) - Active Driver Debug Testing',
        'platform': kIsWeb ? 'web' : 'mobile',
      });
      debugPrint('🔥 [Telemetry] Logged action "$action" for job $jobId');
    } catch (e) {
      debugPrint('🔥 [Telemetry] Failed to log telemetry: $e');
    }
  }
}
