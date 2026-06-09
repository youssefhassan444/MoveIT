import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/chat_message_model.dart';

/// Provider for the [ChatService] instance.
final chatServiceProvider = Provider<ChatService>((ref) {
  return ChatService(FirebaseFirestore.instance);
});

/// Service responsible for handling real-time chat between customers and drivers.
class ChatService {
  final FirebaseFirestore _db;

  /// Creates a [ChatService] with the given Firestore instance.
  ChatService(this._db);

  /// Watches all chat messages associated with a specific [jobId].
  /// 
  /// Returns a stream of [ChatMessageModel]s ordered chronologically by creation time.
  Stream<List<ChatMessageModel>> watchMessages(String jobId) {
    return _db
        .collection('chats')
        .where('jobId', isEqualTo: jobId)
        .orderBy('createdAt', descending: false)
        .snapshots()
        .map((snapshot) {
      // Map each document in the snapshot to a ChatMessageModel
      return snapshot.docs
          .map((doc) => ChatMessageModel.fromFirestore(doc))
          .toList();
    });
  }

  /// Sends a new chat message to Firestore.
  Future<void> sendMessage(ChatMessageModel message) async {
    // Add the message as a new document in the 'chats' collection
    await _db.collection('chats').add(message.toFirestore());
  }
}

/// Stream provider that watches the chat messages for a specific [jobId].
final chatMessagesProvider = StreamProvider.family<List<ChatMessageModel>, String>((ref, jobId) {
  return ref.watch(chatServiceProvider).watchMessages(jobId);
});
