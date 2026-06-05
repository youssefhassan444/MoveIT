import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/widgets/moveit_app_bar.dart';

class DriverShell extends ConsumerWidget {
  final Widget child;

  const DriverShell({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final location = GoRouterState.of(context).uri.path;

    int getCurrentIndex() {
      if (location.startsWith('/driver/active')) return 1;
      if (location.startsWith('/driver/history')) return 2;
      if (location.startsWith('/driver/profile')) return 3;
      return 0;
    }

    String getTitle() {
      if (location.startsWith('/driver/active')) {
        return 'Active Delivery';
      }

      if (location.startsWith('/driver/history')) {
        return 'Trip History';
      }

      if (location.startsWith('/driver/profile')) {
        return 'Account Profile';
      }

      return '';
    }

    final title = getTitle();

    const darkNav = Color(0xFF0F1F91);

    return Scaffold(
      appBar: MoveItAppBar(
        title: title.isEmpty ? null : Text(title),
      ),

      body: child,

      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: darkNav,
          boxShadow: [
            BoxShadow(
              color: Colors.black26,
              blurRadius: 10,
              offset: Offset(0, -2),
            ),
          ],
        ),

        child: BottomNavigationBar(
          type: BottomNavigationBarType.fixed,
          backgroundColor: darkNav,
          currentIndex: getCurrentIndex(),

          selectedItemColor: Colors.white,
          unselectedItemColor: Colors.white70,

          selectedFontSize: 12,
          unselectedFontSize: 11,

          showUnselectedLabels: true,
          elevation: 0,

          onTap: (index) {
            switch (index) {
              case 0:
                context.go('/driver');
                break;

              case 1:
                context.go('/driver/active');
                break;

              case 2:
                context.go('/driver/history');
                break;

              case 3:
                context.go('/driver/profile');
                break;
            }
          },

          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_outlined, color: Colors.white),
              activeIcon: Icon(Icons.dashboard, color: Colors.orange),
              label: 'Board',
            ),

            BottomNavigationBarItem(
              icon: Icon(Icons.local_shipping_outlined, color: Colors.white),
              activeIcon: Icon(Icons.local_shipping, color: Colors.orange),
              label: 'Active',
            ),

            BottomNavigationBarItem(
              icon: Icon(Icons.history_outlined, color: Colors.white),
              activeIcon: Icon(Icons.history, color: Colors.orange),
              label: 'History',
            ),

            BottomNavigationBarItem(
              icon: Icon(Icons.person_outline, color: Colors.white),
              activeIcon: Icon(Icons.person, color: Colors.orange),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}