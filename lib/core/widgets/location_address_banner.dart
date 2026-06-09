import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../services/location_service.dart';
import '../theme/app_theme.dart';

/// A banner widget that displays the current location address and status.
/// Allows the user to toggle location services or refresh their address.
class LocationAddressBanner extends ConsumerWidget {
  const LocationAddressBanner({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watch location status and current resolved address.
    final status = ref.watch(locationStatusProvider);
    final currentAddress = ref.watch(currentAddressProvider);
    final isEnabled = status == LocationStatus.enabled;

    // Outer container styling matching the app's premium visual system
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [
            AppTheme.brandNavy,
            Color(0xFF0F2C6B),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha((0.2 * 255).round()),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: InkWell(
          // Only allow tap to change settings if location is not enabled.
          onTap: isEnabled
              ? null
              : () {
                  final notifier = ref.read(locationStatusProvider.notifier);
                  if (notifier.isManuallyDisabled) {
                    // Turn it back on manually.
                    notifier.toggleManualOn();
                  } else {
                    // Otherwise try to open device settings.
                    try {
                      ref.read(locationServiceProvider).openSettings();
                    } catch (e) {
                      debugPrint('📍 [LocationAddressBanner] Error opening settings: $e');
                    }
                  }
                },
          child: IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
              // Left Accent side-bar matching active state
              Container(
                width: 6,
                color: isEnabled
                    ? const Color(0xFF2ECC71) // Glowing green
                    : const Color(0xFFE74C3C), // Red accent
              ),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  child: Row(
                    children: [
                      // Location pin icon with status pulse
                      Stack(
                        alignment: Alignment.center,
                        children: [
                          if (isEnabled)
                            _PulsingRing(
                              color: const Color(0xFF2ECC71).withAlpha((0.4 * 255).round()),
                            ),
                          Icon(
                            Icons.location_on_rounded,
                            color: isEnabled
                                ? const Color(0xFF2ECC71)
                                : Colors.grey,
                            size: 26,
                          ),
                        ],
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              isEnabled
                                  ? 'CURRENT LOCATION'
                                  : (currentAddress != null ? 'LAST KNOWN LOCATION' : 'LOCATION SERVICE'),
                              style: TextStyle(
                                color: isEnabled
                                    ? Colors.lightBlueAccent
                                    : (currentAddress != null ? const Color(0xFFFF8C42) : const Color(0xFFE74C3C)),
                                fontSize: 10,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 1.2,
                              ),
                            ),
                            const SizedBox(height: 3),
                            if (!isEnabled)
                              currentAddress != null
                                  ? Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          currentAddress,
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 13,
                                            fontWeight: FontWeight.w600,
                                            height: 1.4,
                                          ),
                                          maxLines: 2,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                        const SizedBox(height: 5),
                                        Row(
                                          children: [
                                            Icon(
                                              Icons.touch_app_rounded,
                                              color: Colors.white.withAlpha((0.6 * 255).round()),
                                              size: 13,
                                            ),
                                            const SizedBox(width: 4),
                                            Expanded(
                                              child: Text(
                                                'Press here to enable location sharing.',
                                                style: TextStyle(
                                                  color: Colors.white.withAlpha((0.65 * 255).round()),
                                                  fontSize: 11,
                                                  fontWeight: FontWeight.w500,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    )
                                  : const Text(
                                      'Location sharing is disabled. Press here to enable location sharing.',
                                      style: TextStyle(
                                        color: Colors.white70,
                                        fontSize: 12,
                                        height: 1.3,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    )
                            else if (currentAddress == null)
                              Row(
                                children: [
                                  const SizedBox(
                                    width: 12,
                                    height: 12,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    'Resolving address...',
                                    style: TextStyle(
                                      color: Colors.white.withAlpha((0.9 * 255).round()),
                                      fontSize: 13,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              )
                            else
                              Text(
                                currentAddress,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  height: 1.4,
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                          ],
                        ),
                      ),
                      if (isEnabled)
                        IconButton(
                          icon: const Icon(Icons.refresh_rounded, color: Colors.white70, size: 22),
                          tooltip: 'Refresh Location',
                          onPressed: () {
                            ref.read(currentAddressProvider.notifier).setAddress(null);
                            fetchAndResolveCurrentAddress(ref);
                          },
                        ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    ),
  );
  }
}

/// A custom widget that renders a continuously pulsing circle animation.
class _PulsingRing extends StatefulWidget {
  /// The base color of the pulsing ring.
  final Color color;
  const _PulsingRing({required this.color});

  @override
  State<_PulsingRing> createState() => _PulsingRingState();
}

class _PulsingRingState extends State<_PulsingRing> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Container(
          width: 26 + (16 * _controller.value),
          height: 26 + (16 * _controller.value),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(
              color: widget.color.withValues(alpha: 1 - _controller.value),
              width: 2,
            ),
          ),
        );
      },
    );
  }
}
