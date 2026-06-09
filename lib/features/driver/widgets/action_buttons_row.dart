import 'package:flutter/material.dart';

/// A row of standard action buttons (Call, Message, Report) used across different
/// job tracking screens to allow communication or reporting.
class ActionButtonsRow extends StatelessWidget {
  /// Callback triggered when the 'Call' button is tapped.
  final VoidCallback? onCall;
  /// Callback triggered when the 'Message' button is tapped.
  final VoidCallback? onMessage;
  /// Callback triggered when the 'Report' button is tapped.
  final VoidCallback? onReport;
  /// Optional custom label for the 'Call' button.
  final String callLabel;
  /// Optional custom label for the 'Message' button.
  final String messageLabel;
  /// Optional custom label for the 'Report' button.
  final String reportLabel;

  /// Creates an [ActionButtonsRow] with three equally spaced action buttons.
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
