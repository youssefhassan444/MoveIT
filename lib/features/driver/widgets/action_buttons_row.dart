import 'package:flutter/material.dart';

class ActionButtonsRow extends StatelessWidget {
  final VoidCallback? onCall;
  final VoidCallback? onMessage;
  final VoidCallback? onReport;
  final String callLabel;
  final String messageLabel;
  final String reportLabel;

  const ActionButtonsRow({
    super.key,
    this.onCall,
    this.onMessage,
    this.onReport,
    this.callLabel = 'Call Driver',
    this.messageLabel = 'Message',
    this.reportLabel = 'Report',
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: ElevatedButton.icon(
              onPressed: onCall,
              icon: const Icon(Icons.call),
              label: Text(callLabel),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green[100],
                foregroundColor: Colors.green[900],
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: ElevatedButton.icon(
              onPressed: onMessage,
              icon: const Icon(Icons.message),
              label: Text(messageLabel),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue[100],
                foregroundColor: Colors.blue[900],
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: ElevatedButton.icon(
              onPressed: onReport,
              icon: const Icon(Icons.report),
              label: Text(reportLabel),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange[100],
                foregroundColor: Colors.orange[900],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
