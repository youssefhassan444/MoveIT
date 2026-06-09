import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// A standard text input field used throughout the MoveIt application.
/// Wraps [TextFormField] with common styling and behavior.
class MoveItTextField extends StatelessWidget {
  final String label;
  final TextEditingController? controller;
  final IconData? prefixIcon;
  final TextInputType keyboardType;
  final bool obscureText;
  final String? Function(String?)? validator;

  const MoveItTextField({
    super.key,
    required this.label,
    this.controller,
    this.prefixIcon,
    this.keyboardType = TextInputType.text,
    this.obscureText = false,
    this.validator,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      obscureText: obscureText,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: prefixIcon != null ? Icon(prefixIcon, color: AppTheme.brandNavy) : null,
      ),
    );
  }
}
