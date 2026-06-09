import 'package:cloud_firestore/cloud_firestore.dart';

/// Data model representing a single chat message between a user and driver.
/// 
/// Messages are typically stored in a subcollection under a specific job
/// document in Firestore.
class ChatMessageModel {
  /// The unique identifier for this message document.
  final String id;
  
  /// The ID of the job this message is associated with.
  final String jobId;
  
  /// The Firebase Auth UID of the user sending the message.
  final String senderId;
  
  /// The display name of the sender at the time of sending.
  final String senderName;
  
  /// The actual text content of the chat message.
  final String text;
  
  /// The timestamp when this message was created.
  final DateTime createdAt;

  /// Creates a new [ChatMessageModel] instance.
  const ChatMessageModel({
    required this.id,
    required this.jobId,
    required this.senderId,
    required this.senderName,
    required this.text,
    required this.createdAt,
  });

  /// Creates a [ChatMessageModel] from a Firestore [DocumentSnapshot].
  /// 
  /// Handles null checks and provides default values for missing data
  /// to prevent parsing errors when fetching from Firestore.
  factory ChatMessageModel.fromFirestore(DocumentSnapshot doc) {
    // Extract the raw data map from the document
    final d = doc.data() as Map<String, dynamic>?;
    
    // If the document has no data, return a default empty model
    if (d == null) {
      return ChatMessageModel(
        id: doc.id,
        jobId: '',
        senderId: '',
        senderName: '',
        text: '',
        createdAt: DateTime.now(),
      );
    }
    
    // Parse fields with fallbacks to ensure type safety
    return ChatMessageModel(
      id: doc.id,
      jobId: d['jobId'] as String? ?? '',
      senderId: d['senderId'] as String? ?? '',
      senderName: d['senderName'] as String? ?? '',
      text: d['text'] as String? ?? '',
      // Safely convert Timestamp to DateTime, fallback to current time if missing
      createdAt: d['createdAt'] is Timestamp 
          ? (d['createdAt'] as Timestamp).toDate() 
          : DateTime.now(),
    );
  }

  /// Converts this [ChatMessageModel] into a Map for Firestore storage.
  /// 
  /// Uses [FieldValue.serverTimestamp()] to ensure the creation time is
  /// synchronized with the server's clock.
  Map<String, dynamic> toFirestore() => {
        'jobId': jobId,
        'senderId': senderId,
        'senderName': senderName,
        'text': text,
        'createdAt': FieldValue.serverTimestamp(),
      };
}
