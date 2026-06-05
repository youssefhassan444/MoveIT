import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/report_model.dart';

final reportServiceProvider = Provider<ReportService>((ref) {
  return ReportService(FirebaseFirestore.instance);
});

class ReportService {
  final FirebaseFirestore _db;

  ReportService(this._db);

  Future<void> submitReport(ReportModel report) async {
    await _db.collection('reports').add(report.toFirestore());
  }
}
