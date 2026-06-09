// ignore_for_file: unused_element
import 'package:flutter/material.dart';

import '../../features/auth/login_screen.dart';

/// The settings screen for managing app preferences and account options.
class SettingsPage extends StatefulWidget {
  static const String routeName = 'settings';

  const SettingsPage({super.key});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  String name = 'Seif Ahmed';
  String address = 'Cairo, Egypt';
  String selectedLanguage = 'English';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),

      appBar: AppBar(
        backgroundColor: const Color(0xFF0F1F91),
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.white),
        title: const Text(
          'Settings',
          style: TextStyle(color: Colors.white),
        ),
      ),

      body: ListView(
        padding: const EdgeInsets.all(12),
        children: [



          /// PAYMENT




          /// LANGUAGE
          _tile(Icons.language, 'Language', () {
            _showLanguageDialog(context);
          }, trailing: Text(selectedLanguage),),

          _tile(Icons.privacy_tip_outlined, 'Privacy Policy', () {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Coming soon')));
          }),

          /// 🆕 SAFETY
          _tile(Icons.shield_outlined, 'Safety', () {
            _showSafetyInfo(context);
          }),

          /// 🆕 HELP
          _tile(Icons.help_outline, 'Help & Support', () {
            _showHelpInfo(context);
          }),

          _tile(Icons.info_outline, 'App Version', () {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Coming soon')));
          },
              trailing: const Text('1.0.0'),),

          const SizedBox(height: 10),

          /// LOGOUT


          /// DELETE
          _tile(
            Icons.delete_forever,
            'Delete My Account',
                () => _showDeleteDialog(context),
            color: Colors.red,
          ),
        ],
      ),
    );
  }

  /// ================= CARD =================
  Widget _card({required Widget child}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha((0.05 * 255).round()),
            blurRadius: 10,
          ),
        ],
      ),
      child: child,
    );
  }

  /// ================= TILE =================
  Widget _tile(
      IconData icon,
      String title,
      VoidCallback onTap, {
        Widget? trailing,
        Color? color,
      }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
      ),
      child: ListTile(
        leading: Icon(icon, color: color ?? const Color(0xFF0F1F91)),
        title: Text(
          title,
          style: TextStyle(
            fontWeight: FontWeight.w600,
            color: color ?? Colors.black87,
          ),
        ),
        trailing: trailing ??
            const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
  }

  /// ================= LANGUAGE =================
  void _showLanguageDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Choose Language'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              title: const Text('English'),
              onTap: () {
                setState(() => selectedLanguage = 'English');
                Navigator.pop(dialogContext);
              },
            ),
            ListTile(
              title: const Text('العربية'),
              onTap: () {
                setState(() => selectedLanguage = 'العربية');
                Navigator.pop(dialogContext);
              },
            ),
          ],
        ),
      ),
    );
  }

  /// ================= SAFETY =================
  void _showSafetyInfo(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Safety'),
        content: const Text(
          'Your safety is important. Always verify driver details before pickup and never share sensitive information.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  /// ================= HELP =================
  void _showHelpInfo(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Help & Support'),
        content: const Text(
          'Need help? Contact our support team at support@moveit.com or use in-app chat.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }



  /// ================= DELETE ACCOUNT =================
  void _showDeleteDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Delete Account'),
        content: const Text(
            'Are you sure you want to delete your account? This action cannot be undone.',),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(dialogContext);
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(
                  builder: (_) => const LoginScreen(),
                ),
                    (route) => false,
              );
            },
            child: const Text(
              'Delete',
              style: TextStyle(color: Colors.red),
            ),
          ),
        ],
      ),
    );
  }
}