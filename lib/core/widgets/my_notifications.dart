import 'package:flutter/material.dart';

class MyNotificationsPage extends StatefulWidget {
  const MyNotificationsPage({super.key});

  @override
  State<MyNotificationsPage> createState() => _MyNotificationsPageState();
}

class NotificationModel {
  final String title;
  final String body;
  final DateTime time;
  bool isRead;

  NotificationModel({
    required this.title,
    required this.body,
    required this.time,
    this.isRead = false,
  });
}

class _MyNotificationsPageState extends State<MyNotificationsPage> {
  List<NotificationModel> items = [];

  static const darkBlue = Color(0xFF0F1F91);
  static const accent = Color(0xFFFF8C42);
  static const bg = Color(0xFFF4F7FC);

  @override
  void initState() {
    super.initState();

    items = [
      NotificationModel(
        title: 'Order Accepted',
        body: 'Your order has been accepted successfully',
        time: DateTime.now(),
      ),
      NotificationModel(
        title: 'Driver on the way',
        body: 'Your driver is arriving in few minutes',
        time: DateTime.now().subtract(const Duration(hours: 1)),
      ),
    ];
  }

  void markAll() {
    setState(() {
      for (var e in items) {
        e.isRead = true;
      }
    });
  }

  String formatTime(DateTime time) {
    final diff = DateTime.now().difference(time);

    if (diff.inMinutes < 60) {
      return '${diff.inMinutes}m ago';
    } else if (diff.inHours < 24) {
      return '${diff.inHours}h ago';
    } else {
      return '${diff.inDays}d ago';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: bg,

      appBar: AppBar(
        backgroundColor: darkBlue,
        elevation: 0,

        title: const Text(
          'Notifications',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),

        actions: [
          TextButton.icon(
            onPressed: markAll,
            icon: const Icon(Icons.done_all, color: Colors.white),
            label: const Text(
              'Mark all',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),

      body: items.isEmpty
          ? _emptyState()
          : ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: items.length,
        itemBuilder: (context, i) {
          final n = items[i];

          return AnimatedContainer(
            duration: const Duration(milliseconds: 200),

            margin: const EdgeInsets.only(bottom: 12),

            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),

              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 12,
                  offset: const Offset(0, 6),
                ),
              ],
            ),

            child: ListTile(
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 10,
              ),

              leading: Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: n.isRead
                      ? Colors.grey.shade200
                      : accent.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  Icons.notifications_active,
                  color: n.isRead ? Colors.grey : accent,
                ),
              ),

              title: Text(
                n.title,
                style: TextStyle(
                  fontWeight:
                  n.isRead ? FontWeight.w500 : FontWeight.bold,
                  color: darkBlue,
                ),
              ),

              subtitle: Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text(
                  n.body,
                  style: TextStyle(
                    color: Colors.grey.shade600,
                    fontSize: 13,
                  ),
                ),
              ),

              trailing: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    formatTime(n.time),
                    style: const TextStyle(
                      fontSize: 11,
                      color: Colors.grey,
                    ),
                  ),

                  const SizedBox(height: 6),

                  if (!n.isRead)
                    Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: accent,
                        shape: BoxShape.circle,
                      ),
                    ),
                ],
              ),

              onTap: () {
                setState(() => n.isRead = true);
              },
            ),
          );
        },
      ),
    );
  }

  // ================= EMPTY STATE =================
  Widget _emptyState() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.notifications_off, size: 70, color: Colors.grey),
          SizedBox(height: 10),
          Text(
            'No notifications yet',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}