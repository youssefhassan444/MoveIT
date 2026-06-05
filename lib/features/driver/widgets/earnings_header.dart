import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

/// Small earnings summary used on the Board screen.
class EarningsHeader extends StatelessWidget {
  final int earningsPiastres;
  final String distanceText;
  final String onlineText;

  const EarningsHeader({
    super.key,
    required this.earningsPiastres,
    required this.distanceText,
    required this.onlineText,
  });

  @override
  Widget build(BuildContext context) {
    final earnings = (earningsPiastres / 100).toStringAsFixed(2);
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.brandNavy,
        borderRadius: BorderRadius.circular(14),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 8)],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Today\'s Earnings', style: TextStyle(color: Colors.white70)),
                const SizedBox(height: 8),
                Text('$earnings', // placeholder currency formatting
                    style: const TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.bold),),
                const SizedBox(height: 8),
                Row(children: [
                  Text(distanceText, style: const TextStyle(color: Colors.white70)),
                  const SizedBox(width: 12),
                  Text(onlineText, style: const TextStyle(color: Colors.white70)),
                ],),
              ],
            ),
          ),
          const Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text('4', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              SizedBox(height: 4),
              Text('Deliveries', style: TextStyle(color: Colors.white70, fontSize: 12)),
            ],
          ),
        ],
      ),
    );
  }
}
