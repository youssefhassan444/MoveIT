// ignore_for_file: deprecated_member_use
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_theme.dart';
import '../../services/auth_service.dart';
import '../../services/report_service.dart';
import '../../models/user_model.dart';
import '../../core/widgets/custom_snackbar.dart';
import 'widgets/report_details_dialog.dart';

/// Provider that streams all users from the Firestore users collection.
final allUsersProvider = StreamProvider<List<UserModel>>((ref) {
  return FirebaseFirestore.instance.collection('users').snapshots().map(
      (snap) => snap.docs.map((d) => UserModel.fromFirestore(d)).toList(),);
});

/// The main dashboard screen for the admin portal.
///
/// It provides access to a list of reports and a live fleet map.
class AdminDashboardScreen extends ConsumerStatefulWidget {
  /// Creates an [AdminDashboardScreen].
  const AdminDashboardScreen({super.key});

  @override
  ConsumerState<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends ConsumerState<AdminDashboardScreen> {
  // 0 = Reports, 1 = Fleet Map
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    // Watch current user data to determine permissions (e.g., super_admin)
    final userDoc = ref.watch(currentUserDocProvider).value;
    final isSuperAdmin = userDoc?.role == 'super_admin';

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FE),
      appBar: AppBar(
        title: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('MoveIt', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppTheme.brandNavy, letterSpacing: -0.5)),
            SizedBox(width: 8),
            Text('Admin Portal', style: TextStyle(color: AppTheme.brandNavy, fontWeight: FontWeight.bold)),
          ],
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
        actions: [
          // Navigation tabs
          _NavTab(
            title: 'Reports',
            isSelected: _selectedIndex == 0,
            onTap: () => setState(() => _selectedIndex = 0),
          ),
          const SizedBox(width: 16),
          _NavTab(
            title: 'Fleet Map',
            isSelected: _selectedIndex == 1,
            onTap: () => setState(() => _selectedIndex = 1),
          ),
          // User info display for wide screens
          if (MediaQuery.of(context).size.width > 800) ...[
            const SizedBox(width: 32),
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Logged in as: ${userDoc?.email ?? ""} (${isSuperAdmin ? "Super Admin" : "Admin"})',
                  style: const TextStyle(color: Colors.black54, fontSize: 13, fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ],
          const SizedBox(width: 16),
          // Logout button
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
            child: ElevatedButton.icon(
              onPressed: () async {
                await ref.read(authServiceProvider).signOut();
                if (context.mounted) {
                  context.go('/login');
                }
              },
              icon: const Icon(Icons.logout, size: 16),
              label: const Text('Logout'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFFF0F0),
                foregroundColor: Colors.red[700],
                minimumSize: Size.zero,
                elevation: 0,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
            ),
          ),
        ],
      ),
      // Switch body content based on selected index
      body: _selectedIndex == 0 ? const _StyledReportsTable() : const _StyledFleetMap(),
    );
  }
}

/// A custom navigation tab widget used in the admin app bar.
class _NavTab extends StatelessWidget {
  /// The title of the tab.
  final String title;
  /// Whether this tab is currently selected.
  final bool isSelected;
  /// Callback for when the tab is tapped.
  final VoidCallback onTap;

  /// Creates a [_NavTab].
  const _NavTab({required this.title, required this.isSelected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(8),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: isSelected ? AppTheme.brandNavy.withValues(alpha: 0.05) : Colors.transparent,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              title,
              style: TextStyle(
                color: isSelected ? AppTheme.brandNavy : Colors.grey[600],
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

/// A data table view showing reports submitted by users.
class _StyledReportsTable extends ConsumerWidget {
  /// Creates a [_StyledReportsTable].
  const _StyledReportsTable();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watch reports and user roles
    final reportsAsync = ref.watch(adminReportsProvider);
    final isSuperAdmin = ref.watch(currentUserDocProvider.select((doc) => doc.value?.role == 'super_admin'));

    return reportsAsync.when(
      data: (reports) {
        return SingleChildScrollView(
          padding: const EdgeInsets.all(32),
          child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    isSuperAdmin ? 'Elevated Reports' : 'Pending Reports',
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.brandNavy),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    isSuperAdmin ? 'Issues elevated by regular admins.' : 'New issues requiring triage.',
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                  const SizedBox(height: 24),
                  LayoutBuilder(
                    builder: (context, constraints) {
                      return Container(
                        width: double.infinity,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [
                            BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 10, offset: const Offset(0, 4)),
                          ],
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            child: ConstrainedBox(
                              constraints: BoxConstraints(minWidth: constraints.maxWidth),
                              child: DataTable(
                                headingRowColor: WidgetStateProperty.all(const Color(0xFFF8FAFC)),
                    columns: const [
                      DataColumn(label: Text('DATE', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.brandNavy, fontSize: 13))),
                      DataColumn(label: Text('REPORTER', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.brandNavy, fontSize: 13))),
                      DataColumn(label: Text('SUBJECT', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.brandNavy, fontSize: 13))),
                      DataColumn(label: Text('PRIORITY', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.brandNavy, fontSize: 13))),
                      DataColumn(label: Text('ACTION', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.brandNavy, fontSize: 13))),
                    ],
                    rows: reports.map((r) => DataRow(
                      cells: [
                        DataCell(Text(DateFormat('MMM dd, yyyy HH:mm').format(r.createdAt), style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.black87))),
                        DataCell(Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(r.reporterName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.black87)),
                            Text(r.reporterRole.toUpperCase(), style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.grey[700])),
                          ],
                        ),),
                        DataCell(SizedBox(width: 250, child: Text(r.subject, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.black87)))),
                        DataCell(_PriorityBadge(priority: r.priority)),
                        DataCell(
                          Row(
                            children: [
                                TextButton(
                                  onPressed: () {
                                    showDialog(
                                      context: context,
                                      builder: (_) => ReportDetailsDialog(report: r),
                                    );
                                  },
                                  style: TextButton.styleFrom(foregroundColor: AppTheme.brandSkyBlue),
                                  child: const Text('Inspect'),
                                ),
                                const SizedBox(width: 8),
                                if (!isSuperAdmin) ...[
                                  TextButton(
                                    onPressed: () async {
                                      await ref.read(reportServiceProvider).updateReportStatus(r.id, 'dismissed');
                                      if (context.mounted) CustomSnackBar.show(context, message: 'Report dismissed', type: SnackBarType.success);
                                    },
                                    style: TextButton.styleFrom(foregroundColor: Colors.grey[600]),
                                    child: const Text('Dismiss'),
                                  ),
                                  const SizedBox(width: 8),
                                ElevatedButton(
                                  onPressed: () async {
                                    await ref.read(reportServiceProvider).updateReportStatus(r.id, 'elevated');
                                    if (context.mounted) CustomSnackBar.show(context, message: 'Report elevated', type: SnackBarType.success);
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppTheme.brandOrange, 
                                    foregroundColor: Colors.white, 
                                    minimumSize: Size.zero,
                                    elevation: 0,
                                  ),
                                  child: const Text('Elevate'),
                                ),
                                ] else ...[
                                  TextButton(
                                    onPressed: () async {
                                      await ref.read(reportServiceProvider).updateReportStatus(r.id, 'dismissed');
                                      if (context.mounted) CustomSnackBar.show(context, message: 'Report dismissed', type: SnackBarType.success);
                                    },
                                    style: TextButton.styleFrom(foregroundColor: Colors.grey[600]),
                                    child: const Text('Dismiss'),
                                  ),
                                  const SizedBox(width: 8),
                                ElevatedButton(
                                  onPressed: () async {
                                    await ref.read(reportServiceProvider).updateReportStatus(r.id, 'resolved');
                                    if (context.mounted) CustomSnackBar.show(context, message: 'Report resolved', type: SnackBarType.success);
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF2ECC71), 
                                    foregroundColor: Colors.white, 
                                    minimumSize: Size.zero,
                                    elevation: 0,
                                  ),
                                  child: const Text('Resolve'),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ],
                    ),).toList(),
                  ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, st) => Center(child: Text('Error: $e')),
    );
  }
}

/// A map view displaying live locations of all active drivers.
class _StyledFleetMap extends ConsumerWidget {
  /// Creates a [_StyledFleetMap].
  const _StyledFleetMap();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watch all registered users
    final usersAsync = ref.watch(allUsersProvider);

    return usersAsync.when(
      data: (users) {
        // Filter out non-driver users
        final drivers = users.where((u) => u.role == 'driver').toList();

        return Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Active Fleet Tracking', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.brandNavy)),
              const SizedBox(height: 8),
              Text('Live overview of all registered driver locations.', style: TextStyle(color: Colors.grey[600])),
              const SizedBox(height: 24),
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 15, offset: const Offset(0, 5))],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: FlutterMap(
                      options: const MapOptions(
                        initialCenter: LatLng(30.0444, 31.2357), // Default to Cairo
                        initialZoom: 12.0,
                      ),
                      children: [
                        TileLayer(
                          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                          userAgentPackageName: 'com.example.moveit',
                        ),
                        MarkerLayer(
                          markers: drivers.where((d) => d.lastKnownLocation != null).map((d) {
                            final loc = d.lastKnownLocation!;
                            return Marker(
                              point: LatLng(loc.latitude, loc.longitude),
                              width: 40,
                              height: 40,
                              child: Tooltip(
                                message: '${d.displayName} (${d.email})',
                                child: Container(
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    shape: BoxShape.circle,
                                    border: Border.all(color: AppTheme.brandNavy, width: 2),
                                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 4, offset: const Offset(0, 2))],
                                  ),
                                  child: const Icon(Icons.local_shipping, color: AppTheme.brandNavy, size: 20),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, st) => Center(child: Text('Error: $e')),
    );
  }
}

/// A visual badge to indicate the priority level of a report.
class _PriorityBadge extends StatelessWidget {
  /// The priority level (e.g., 'high', 'low').
  final String priority;

  /// Creates a [_PriorityBadge].
  const _PriorityBadge({required this.priority});

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;
    // Map priority string to specific background and foreground colors
    if (priority == 'high') {
      bg = const Color(0xFFFFEAEA);
      fg = const Color(0xFFE74C3C);
    } else if (priority == 'low') {
      bg = const Color(0xFFEAF5FF);
      fg = const Color(0xFF3498DB);
    } else {
      bg = const Color(0xFFFFF4EA);
      fg = const Color(0xFFF39C12);
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(20)),
      child: Text(priority.toUpperCase(), style: TextStyle(color: fg, fontWeight: FontWeight.bold, fontSize: 10)),
    );
  }
}

