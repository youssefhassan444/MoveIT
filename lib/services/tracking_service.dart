import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/tracking_model.dart';

/// Stream provider for real-time driver tracking documents at `tracking/{jobId}`.
final trackingProvider = StreamProvider.family<TrackingModel?, String>((ref, jobId) {
  final doc = FirebaseFirestore.instance.collection('tracking').doc(jobId);
  return doc.snapshots().map((snap) {
    if (!snap.exists) return null;
    return TrackingModel.fromFirestore(snap);
  });
});
