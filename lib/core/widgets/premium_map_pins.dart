import 'package:flutter/material.dart';

class PremiumMapPin extends StatelessWidget {
  final IconData icon;
  final Color color;
  final Color iconColor;
  final double size;

  const PremiumMapPin({
    super.key,
    required this.icon,
    required this.color,
    this.iconColor = Colors.white,
    this.size = 42,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 3),
        boxShadow: [
          BoxShadow(
            color: color.withValues(alpha: 0.4),
            blurRadius: 10,
            spreadRadius: 2,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Center(
        child: Icon(
          icon,
          color: iconColor,
          size: size * 0.48,
        ),
      ),
    );
  }
}

class PremiumDriverPin extends StatelessWidget {
  final double size;

  const PremiumDriverPin({
    super.key,
    this.size = 46,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: const Color(0xFF0F1F91), // AppTheme.brandNavy
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 3),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F1F91).withValues(alpha: 0.4),
            blurRadius: 12,
            spreadRadius: 3,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: const Center(
        child: Icon(
          Icons.navigation, // arrow head pointing up by default
          color: Colors.white,
          size: 22,
        ),
      ),
    );
  }
}
