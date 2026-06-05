import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../services/location_service.dart';

class LocationStatusIndicator extends ConsumerWidget {
  const LocationStatusIndicator({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final status = ref.watch(locationStatusProvider);
    final isEnabled = status == LocationStatus.enabled;

    final statusColor = isEnabled ? const Color(0xFF2ECC71) : Colors.grey.shade500;
    final text = isEnabled ? 'Location On' : 'Location Off';

    return GestureDetector(
      onTap: () {
        final notifier = ref.read(locationStatusProvider.notifier);
        if (isEnabled) {
          notifier.toggleManualOff();
        } else {
          if (notifier.isManuallyDisabled) {
            notifier.toggleManualOn();
          } else {
            try {
              ref.read(locationServiceProvider).openSettings();
            } catch (e) {
              debugPrint('📍 [LocationStatusIndicator] Error opening settings: $e');
            }
          }
        }
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: statusColor,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha((0.15 * 255).round()),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 6,
              height: 6,
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 5),
            Text(
              text,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 10,
                fontWeight: FontWeight.w800,
                letterSpacing: 0.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
