import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Provides the standard theming for the MoveIt application.
/// 
/// Contains predefined brand colors and methods to generate the light
/// and dark [ThemeData] configurations.
class AppTheme {
  // Fix: User gave hex codes, I'll use standard ARGB
  
  /// The primary brand navy color.
  static const Color brandNavy = Color(0xFF0F1F91);
  /// The primary brand sky blue color.
  static const Color brandSkyBlue = Color(0xFF1265B3);
  /// The secondary brand orange color.
  static const Color brandOrange = Color(0xFFF79529);
  /// The standard error color.
  static const Color brandError = Color(0xFFD32F2F);
  /// The standard success color.
  static const Color brandSuccess = Color(0xFF2E7D32);
  /// A near-black color used for dark mode surfaces.
  static const Color nearBlack = Color(0xFF1A1A2E);

  /// Returns the light theme configuration.
  static ThemeData get light => _build(Brightness.light);
  
  /// Returns the dark theme configuration.
  static ThemeData get dark => _build(Brightness.dark);

  /// Builds and returns a [ThemeData] based on the specified [brightness].
  static ThemeData _build(Brightness brightness) {
    // Start with the base theme for the requested brightness.
    final base = brightness == Brightness.light 
        ? ThemeData.light() 
        : ThemeData.dark();

    return base.copyWith(
      // Configure the primary color palette.
      colorScheme: ColorScheme.fromSeed(
        seedColor: brandSkyBlue,
        primary: brandSkyBlue,
        secondary: brandOrange,
        surface: brightness == Brightness.light ? Colors.white : nearBlack,
        error: brandError,
        brightness: brightness,
      ),
      // Set the default background color.
      scaffoldBackgroundColor: brightness == Brightness.light ? Colors.white : nearBlack,
      // Configure typography using the Cairo font.
      textTheme: GoogleFonts.cairoTextTheme(base.textTheme).copyWith(
        displayLarge: GoogleFonts.cairo(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: brandNavy,
        ),
        headlineMedium: GoogleFonts.cairo(
          fontSize: 22,
          fontWeight: FontWeight.bold,
          color: brandNavy,
        ),
        bodyLarge: GoogleFonts.cairo(
          fontSize: 16,
          fontWeight: FontWeight.normal,
          color: nearBlack,
        ),
        labelLarge: GoogleFonts.cairo(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: brandSkyBlue,
          letterSpacing: 1.2,
        ),
      ),
      // Standardize elevated button appearance.
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: brandSkyBlue,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 56), // Full width by default.
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12), // Rounded corners.
          ),
          textStyle: GoogleFonts.cairo(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      // Standardize text field inputs.
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: brightness == Brightness.light ? Colors.grey[100] : Colors.grey[900],
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: brandSkyBlue, width: 2), // Highlight on focus.
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: brandError, width: 2), // Red border on error.
        ),
        prefixIconColor: brandNavy,
        labelStyle: GoogleFonts.cairo(color: Colors.grey[600]),
      ),
      // Styling for the main bottom navigation bar.
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: brandNavy,
        selectedItemColor: brandSkyBlue,
        unselectedItemColor: Colors.white54,
        type: BottomNavigationBarType.fixed,
      ),
    );
  }
}
