import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../models/report_model.dart';
import 'auth_service.dart';

/// Provider for the [ReportService] instance.
final reportServiceProvider = Provider<ReportService>((ref) {
  return ReportService(ref.watch(firestoreProvider));
});

/// Stream provider that watches the list of reports for the admin dashboard.
/// 
/// Filters reports based on the current user's admin role.
final adminReportsProvider = StreamProvider<List<ReportModel>>((ref) {
  final user = ref.watch(firebaseAuthProvider).currentUser;
  // If not logged in, return empty list
  if (user == null) return Stream.value([]);
  
  return ref.watch(currentUserDocProvider).when(
    data: (userDoc) {
      final role = userDoc?.role;
      // If role is missing, return empty list
      if (role == null) return Stream.value([]);
      
      // Super admins see 'elevated' reports, standard admins see 'pending'
      final statusFilter = role == 'super_admin' ? 'elevated' : 'pending';
      
      return FirebaseFirestore.instance
          .collection('reports')
          .where('status', isEqualTo: statusFilter)
          .snapshots()
          .map((snap) {
            final reports = snap.docs.map((d) => ReportModel.fromFirestore(d)).toList();
            // Sort by creation time, newest first
            reports.sort((a, b) => b.createdAt.compareTo(a.createdAt));
            return reports;
          });
    },
    loading: () => Stream.value([]),
    error: (_, __) => Stream.value([]),
  );
});

/// Service responsible for managing user reports and support tickets.
class ReportService {
  final FirebaseFirestore _db;

  /// Creates a [ReportService] with the given Firestore instance.
  ReportService(this._db);

  /// Updates the status of a specific report.
  Future<void> updateReportStatus(String reportId, String status) async {
    await _db.collection('reports').doc(reportId).update({'status': status});
  }

  /// Submits a new report or updates an existing one if an ID is provided.
  Future<void> submitReport(ReportModel report) async {
    // Generate a new document reference if the ID is empty
    final docRef = report.id.isEmpty
        ? _db.collection('reports').doc()
        : _db.collection('reports').doc(report.id);
    
    // Write the report data to Firestore
    await docRef.set(report.toFirestore());
  }
}
