import 'package:cloud_firestore/cloud_firestore.dart';

class ChatMessageModel {
  final String id;
  final String jobId;
  final String senderId;
  final String senderName;
  final String text;
  final DateTime createdAt;

  const ChatMessageModel({
    required this.id,
    required this.jobId,
    required this.senderId,
    required this.senderName,
    required this.text,
    required this.createdAt,
  });

  factory ChatMessageModel.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>?;
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
    
    return ChatMessageModel(
      id: doc.id,
      jobId: d['jobId'] as String? ?? '',
      senderId: d['senderId'] as String? ?? '',
      senderName: d['senderName'] as String? ?? '',
      text: d['text'] as String? ?? '',
      createdAt: d['createdAt'] is Timestamp 
          ? (d['createdAt'] as Timestamp).toDate() 
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toFirestore() => {
        'jobId': jobId,
        'senderId': senderId,
        'senderName': senderName,
        'text': text,
        'createdAt': FieldValue.serverTimestamp(),
      };
}
