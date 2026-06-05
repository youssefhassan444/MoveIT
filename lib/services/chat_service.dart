import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/chat_message_model.dart';

final chatServiceProvider = Provider<ChatService>((ref) {
  return ChatService(FirebaseFirestore.instance);
});

class ChatService {
  final FirebaseFirestore _db;

  ChatService(this._db);

  Stream<List<ChatMessageModel>> watchMessages(String jobId) {
    return _db
        .collection('chats')
        .where('jobId', isEqualTo: jobId)
        .orderBy('createdAt', descending: false)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => ChatMessageModel.fromFirestore(doc))
          .toList();
    });
  }

  Future<void> sendMessage(ChatMessageModel message) async {
    await _db.collection('chats').add(message.toFirestore());
  }
}
