import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../services/location_service.dart';
import '../../services/auth_service.dart';

class LocationWarningBanner extends ConsumerWidget {
  const LocationWarningBanner({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDenied = ref.watch(locationPermissionDeniedProvider);
    final isLoggedIn = ref.watch(authStateChangesProvider).value != null;

    if (!isDenied || !isLoggedIn) return const SizedBox.shrink();

    return Material(
      color: const Color(0xFF8B6B21), // Unified gold extending into status bar
      child: SafeArea(
        bottom: false,
        child: InkWell(
          onTap: () => ref.read(locationServiceProvider).openSettings(),
          child: const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: [
                Icon(Icons.location_off, color: Colors.white, size: 20),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Location sharing disabled. Tap here to enable',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                Icon(Icons.chevron_right, color: Colors.white, size: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
