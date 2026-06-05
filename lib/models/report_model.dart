import 'package:cloud_firestore/cloud_firestore.dart';

class ReportModel {
  final String id;
  final String reporterId;
  final String reporterName;
  final String reporterEmail;
  final String reporterRole;
  final String subject;
  final String description;
  final String? jobId;
  final String priority; // 'low', 'medium', 'high'
  final String status; // 'pending', 'in_review', 'resolved', 'dismissed'
  final DateTime createdAt;
  final String? adminResponse;

  const ReportModel({
    required this.id,
    required this.reporterId,
    required this.reporterName,
    required this.reporterEmail,
    required this.reporterRole,
    required this.subject,
    required this.description,
    this.jobId,
    this.priority = 'medium',
    this.status = 'pending',
    required this.createdAt,
    this.adminResponse,
  });

  factory ReportModel.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    return ReportModel(
      id: doc.id,
      reporterId: d['reporterId'] as String? ?? '',
      reporterName: d['reporterName'] as String? ?? '',
      reporterEmail: d['reporterEmail'] as String? ?? '',
      reporterRole: d['reporterRole'] as String? ?? 'customer',
      subject: d['subject'] as String? ?? '',
      description: d['description'] as String? ?? '',
      jobId: d['jobId'] as String?,
      priority: d['priority'] as String? ?? 'medium',
      status: d['status'] as String? ?? 'pending',
      createdAt: (d['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      adminResponse: d['adminResponse'] as String?,
    );
  }

  Map<String, dynamic> toFirestore() => {
        'reporterId': reporterId,
        'reporterName': reporterName,
        'reporterEmail': reporterEmail,
        'reporterRole': reporterRole,
        'subject': subject,
        'description': description,
        if (jobId != null) 'jobId': jobId,
        'priority': priority,
        'status': status,
        'createdAt': FieldValue.serverTimestamp(),
        if (adminResponse != null) 'adminResponse': adminResponse,
      };
}
