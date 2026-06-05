import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../theme/app_theme.dart';

class MoveItAppBar extends ConsumerWidget implements PreferredSizeWidget {
  final bool showMenu;
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
