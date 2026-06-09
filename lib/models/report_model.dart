import 'package:cloud_firestore/cloud_firestore.dart';

/// Data model representing a support ticket or issue report.
/// 
/// Stored in the 'reports' collection in Firestore. Used for both
/// customer complaints and driver issues.
class ReportModel {
  /// The unique identifier of the report document.
  final String id;
  
  /// The Firebase Auth UID of the user who filed the report.
  final String reporterId;
  
  /// The name of the person reporting the issue.
  final String reporterName;
  
  /// The email address of the reporter for follow-up.
  final String reporterEmail;
  
  /// The role of the reporter ('customer' or 'driver').
  final String reporterRole;
  
  /// A brief summary or title of the issue.
  final String subject;
  
  /// A detailed explanation of the problem.
  final String description;
  
  /// Optional associated job ID if the issue pertains to a specific delivery.
  final String? jobId;
  
  /// Urgency level of the report: 'low', 'medium', 'high'.
  final String priority;
  
  /// Current state of the report: 'pending', 'elevated', 'resolved', 'dismissed'.
  final String status;
  
  /// The time the report was submitted.
  final DateTime createdAt;
  
  /// Optional response from an admin or support agent.
  final String? adminResponse;

  /// Creates a new [ReportModel] instance.
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

  /// Creates a [ReportModel] from a Firestore [DocumentSnapshot].
  /// 
  /// Safely extracts and maps document fields, providing sensible defaults
  /// for missing or malformed data.
  factory ReportModel.fromFirestore(DocumentSnapshot doc) {
    // Cast the raw document data to a map
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
      // Convert Timestamp to DateTime, fallback to current time
      createdAt: (d['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      adminResponse: d['adminResponse'] as String?,
    );
  }

  /// Converts this [ReportModel] into a Map for saving to Firestore.
  /// 
  /// Automatically injects the server timestamp for the creation time.
  Map<String, dynamic> toFirestore() => {
        'reporterId': reporterId,
        'reporterName': reporterName,
        'reporterEmail': reporterEmail,
        'reporterRole': reporterRole,
        'subject': subject,
        'description': description,
        // Only include optional fields if they are not null
        if (jobId != null) 'jobId': jobId,
        'priority': priority,
        'status': status,
        'createdAt': FieldValue.serverTimestamp(),
        if (adminResponse != null) 'adminResponse': adminResponse,
      };
}
