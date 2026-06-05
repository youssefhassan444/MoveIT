import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../../core/theme/app_theme.dart';

/// SCAFFOLDING: Admin Business Operations Dashboard
/// 
/// PURPOSE:
/// A centralized hub for company administrators to monitor fleet performance
/// and track platform earnings.
///
/// KEY FEATURES TO IMPLEMENT:
/// 1. FLEET MAP: Use the `lastKnownLocation` from all active users to show 
///    distribution across the city.
/// 2. EARNINGS TRACKER: Query the `jobs` collection (status: delivered) 
///    and sum up `commissionPiastres` for Daily/Monthly/Yearly reports.
/// 3. USER AUDITING: View a list of all users sorted by `lastSeen` to 
///    identify churn or platform activity.
///
/// DATA SOURCE:
/// - Firestore: `users` collection (for location and last-seen)
/// - Firestore: `jobs` collection (for earnings aggregation)
class AdminDashboardScreen extends ConsumerWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Operations'),
        backgroundColor: AppTheme.brandNavy,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildStatCard('Fleet Activity', 'Monitor real-time driver density', Icons.hub_outlined),
            const SizedBox(height: 16),
            _buildStatCard('Platform Earnings', 'Track daily/monthly/yearly commission', Icons.account_balance_wallet_outlined),
            const SizedBox(height: 16),
            _buildStatCard('User Audit', 'Last-seen activity for all users', Icons.people_outline),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String subtitle, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey[200]!),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10)],
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: AppTheme.brandSkyBlue.withValues(alpha: 0.1),
            child: Icon(icon, color: AppTheme.brandSkyBlue),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                Text(subtitle, style: TextStyle(color: Colors.grey[600], fontSize: 13)),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: Colors.grey),
        ],
      ),
    );
  }
}
