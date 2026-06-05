import 'package:flutter/material.dart';
import '../../../models/job_model.dart';
import '../../../core/theme/app_theme.dart';

/// ETA / summary card shown in Active view. Includes dynamic Turn-by-Turn directions.
class EtaCard extends StatelessWidget {
  final JobModel job;
  final String etaLabel;
  final String distanceLabel;
  final String? activeInstruction;
  final IconData? maneuverIcon;
  final String? distanceToManeuver;

  const EtaCard({
    super.key,
    required this.job,
    required this.etaLabel,
    required this.distanceLabel,
    this.activeInstruction,
    this.maneuverIcon,
    this.distanceToManeuver,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Estimated Arrival', style: TextStyle(color: Colors.grey)),
                  const SizedBox(height: 8),
                  
                  // Turn-by-Turn Instruction Banner
                  if (activeInstruction != null && activeInstruction!.isNotEmpty) ...[
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        if (maneuverIcon != null) ...[
                          Icon(maneuverIcon, color: AppTheme.brandSkyBlue, size: 22),
                          const SizedBox(width: 8),
                        ],
                        Expanded(
                          child: Text(
                            activeInstruction!,
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.brandSkyBlue,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                  ],

                  Text(etaLabel, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
                  Text(
                    job.status == 'accepted'
                        ? job.pickupAddress
                        : job.dropoffAddress,
                    style: const TextStyle(color: Colors.grey),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (distanceToManeuver != null && distanceToManeuver!.isNotEmpty) ...[
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppTheme.brandSkyBlue.withAlpha((0.1 * 255).round()),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      distanceToManeuver!,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                ],
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppTheme.brandSkyBlue.withAlpha((0.1 * 255).round()),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    distanceLabel,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
