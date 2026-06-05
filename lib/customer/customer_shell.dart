import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class CustomerShell extends ConsumerWidget {
  final Widget child;

  const CustomerShell({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final location = GoRouterState.of(context).uri.path;

    int getCurrentIndex() {
      if (location.startsWith('/customer/jobs')) return 1;
      if (location.startsWith('/customer/history')) return 2;
      if (location.startsWith('/customer/profile')) return 3;
      return 0;
    }

    String getTitle() {
      if (location.startsWith('/customer/jobs')) {
        return 'My Deliveries';
      }

      if (location.startsWith('/customer/history')) {
        return 'Trip History';
      }

      if (location.startsWith('/customer/profile')) {
        return '';
      }

      return '';
    }

    final currentIndex = getCurrentIndex();
    final title = getTitle();

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),

      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(65),
        child: AppBar(
          backgroundColor: const Color(0xFF0F1F91),
          elevation: 0,
          centerTitle: false,
          titleSpacing: 20,

          title: title.isEmpty
              ? RichText(
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
          )
              : Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 20,
            ),
          ),
        ),
      ),

      body: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        color: const Color(0xFFF5F7FB),
        child: SafeArea(
          top: false,
          child: child,
        ),
      ),

      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha((0.08 * 255).round()),
              blurRadius: 18,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: currentIndex,
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.white,
          elevation: 0,
          selectedItemColor: const Color(0xFFFF8C42),
          unselectedItemColor: Colors.grey.shade500,

          selectedLabelStyle: const TextStyle(
            fontWeight: FontWeight.w700,
            fontSize: 12,
          ),

          unselectedLabelStyle: const TextStyle(
            fontWeight: FontWeight.w500,
            fontSize: 11,
          ),

          onTap: (index) {
            switch (index) {
              case 0:
                context.go('/customer');
                break;

              case 1:
                context.go('/customer/jobs');
                break;

              case 2:
                context.go('/customer/history');
                break;

              case 3:
                context.go('/customer/profile');
                break;
            }
          },

          items: [
            BottomNavigationBarItem(
              icon: Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: currentIndex == 0
                      ? const Color(0xFFFF8C42)
                      .withAlpha((0.15 * 255).round())
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  currentIndex == 0
                      ? Icons.home_rounded
                      : Icons.home_outlined,
                ),
              ),
              label: 'Home',
            ),

            BottomNavigationBarItem(
              icon: Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: currentIndex == 1
                      ? const Color(0xFFFF8C42)
                      .withAlpha((0.15 * 255).round())
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  currentIndex == 1
                      ? Icons.local_shipping_rounded
                      : Icons.local_shipping_outlined,
                ),
              ),
              label: 'Jobs',
            ),

            BottomNavigationBarItem(
              icon: Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: currentIndex == 2
                      ? const Color(0xFFFF8C42)
                      .withAlpha((0.15 * 255).round())
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  currentIndex == 2
                      ? Icons.history_rounded
                      : Icons.history_outlined,
                ),
              ),
              label: 'History',
            ),

            BottomNavigationBarItem(
              icon: Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: currentIndex == 3
                      ? const Color(0xFFFF8C42)
                      .withAlpha((0.15 * 255).round())
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  currentIndex == 3
                      ? Icons.person
                      : Icons.person_outline,
                ),
              ),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}