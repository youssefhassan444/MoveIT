import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// A customized, branded snackbar component.
/// Provides a sleek, floating notification with left-border color accents.
class CustomSnackBar {
  /// Shows a customized floating snackbar of the given [type].
  static void show(
    BuildContext context, {
    required String message,
    required SnackBarType type,
  }) {
    // Determine dynamic properties based on the snackbar type.
    final color = _getColor(type);
    final icon = _getIcon(type);

    // Display the newly constructed custom snackbar.
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        backgroundColor: AppTheme.brandNavy,
        elevation: 6,
        margin: const EdgeInsets.all(16),
        padding: EdgeInsets.zero,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        content: Container(
          height: 60,
          decoration: BoxDecoration(
            border: Border(
              left: BorderSide(color: color, width: 6),
            ),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              Icon(icon, color: color),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  message,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Helper to get the associated brand color for a given [SnackBarType].
  static Color _getColor(SnackBarType type) {
    switch (type) {
      case SnackBarType.success:
        return AppTheme.brandSuccess;
      case SnackBarType.error:
        return AppTheme.brandError;
      case SnackBarType.info:
        return AppTheme.brandSkyBlue;
    }
  }

  /// Helper to get the appropriate icon for a given [SnackBarType].
  static IconData _getIcon(SnackBarType type) {
    switch (type) {
      case SnackBarType.success:
        return Icons.check_circle_outline;
      case SnackBarType.error:
        return Icons.warning_amber_rounded;
      case SnackBarType.info:
        return Icons.info_outline;
    }
  }
}

/// Defines the visual and semantic type of a custom snackbar.
enum SnackBarType { success, error, info }
