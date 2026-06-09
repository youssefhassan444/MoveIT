import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/widgets/moveit_app_bar.dart';

/// A wrapper widget that provides the common layout for driver-facing screens.
/// 
/// It includes the [MoveItAppBar] and a [BottomNavigationBar] that remains
/// persistent across the driver dashboard, active jobs, history, and profile.
class DriverShell extends ConsumerWidget {
  /// The main content to display within this shell.
  final Widget child;

  /// Creates a [DriverShell] to wrap driver screens.
  const DriverShell({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Determine the current route location from GoRouter
    final location = GoRouterState.of(context).uri.path;

    // Helper function to map the current path to the corresponding nav bar index
    int getCurrentIndex() {
      if (location.startsWith('/driver/active')) return 1;
      if (location.startsWith('/driver/history')) return 2;
      if (location.startsWith('/driver/profile')) return 3;
      return 0; // Default to the job board
    }

    // Helper function to determine the appropriate AppBar title based on path
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

      return ''; // Default empty title for the main board
    }

    final title = getTitle();

    // The primary dark color used for the navigation bar
    const darkNav = Color(0xFF0F1F91);

    return Scaffold(
      appBar: MoveItAppBar(
        title: title.isEmpty ? null : Text(title),
      ),

      // Inject the nested route child as the body
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

          // Handle navigation when a bottom bar item is tapped
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