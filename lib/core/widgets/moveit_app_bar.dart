import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../theme/app_theme.dart';

/// The standard app bar used across the MoveIt application.
/// Provides a consistent branded title and styling.
class MoveItAppBar extends ConsumerWidget implements PreferredSizeWidget {
  /// Whether to show the default menu/actions.
  final bool showMenu;
  
  /// An optional custom title widget to override the default "MoveIt" text.
  final Widget? title;
  
  const MoveItAppBar({super.key, this.showMenu = true, this.title});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AppBar(
      backgroundColor: AppTheme.brandNavy,
      elevation: 4,
      title: title ?? RichText(
        text: const TextSpan(
          children: [
            TextSpan(
              text: 'Move',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            TextSpan(
              text: 'It',
              style: TextStyle(
                color: Color(0xFFFF8C42),
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
      actions: const [
        SizedBox(width: 16),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
