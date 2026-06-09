import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Service responsible for managing push notifications via Firebase Cloud Messaging (FCM).
/// 
/// Handles permission requests, token generation/refresh, and local notification display.
class NotificationService {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  /// Initialize FCM: request permission, get token, save to Firestore,
  /// set up foreground listener.
  /// 
  /// [uid] is the current user's Firebase Auth UID.
  Future<void> init(String uid) async {
    // Request permission from the user to display notifications
    await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    // Initialize local notifications for foreground display
    const androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings();
    
    await _localNotifications.initialize(
      settings: const InitializationSettings(
        android: androidSettings,
        iOS: iosSettings,
      ),
      onDidReceiveNotificationResponse: (response) {
        // Handle notification tap — navigation is usually handled by onMessageOpenedApp
        debugPrint('Notification tapped: ${response.payload}');
      },
    );

    // Get the initial FCM token for the device
    final token = await _messaging.getToken();
    if (token != null) {
      // Save the token to the user's Firestore document
      await FirebaseFirestore.instance
          .collection('users')
          .doc(uid)
          .update({'fcmToken': token});
    }

    // Listen for token refreshes and update Firestore accordingly
    _messaging.onTokenRefresh.listen((newToken) {
      FirebaseFirestore.instance
          .collection('users')
          .doc(uid)
          .update({'fcmToken': newToken});
    });

    // Handle messages received while the app is in the foreground
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      final notification = message.notification;
      if (notification != null) {
        // Show a local notification since FCM does not display alerts in the foreground
        _localNotifications.show(
          id: notification.hashCode,
          title: notification.title,
          body: notification.body,
          notificationDetails: const NotificationDetails(
            android: AndroidNotificationDetails(
              'moveit_channel',
              'MoveIt Notifications',
              channelDescription: 'Delivery status updates',
              importance: Importance.high,
              priority: Priority.high,
            ),
          ),
          payload: message.data['jobId'],
        );
      }
    });
  }
}

/// Provider for the [NotificationService] instance.
final notificationServiceProvider =
    Provider<NotificationService>((ref) => NotificationService());
