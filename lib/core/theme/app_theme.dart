import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Fix: User gave hex codes, I'll use standard ARGB
  static const Color brandNavy = Color(0xFF0F1F91);
  static const Color brandSkyBlue = Color(0xFF1265B3);
  static const Color brandOrange = Color(0xFFF79529);
  static const Color brandError = Color(0xFFD32F2F);
  static const Color brandSuccess = Color(0xFF2E7D32);
  static const Color nearBlack = Color(0xFF1A1A2E);

  static ThemeData get light => _build(Brightness.light);
  static ThemeData get dark => _build(Brightness.dark);

  static ThemeData _build(Brightness brightness) {
    final base = brightness == Brightness.light 
        ? ThemeData.light() 
        : ThemeData.dark();

    return base.copyWith(
      colorScheme: ColorScheme.fromSeed(
        seedColor: brandSkyBlue,
        primary: brandSkyBlue,
        secondary: brandOrange,
        surface: brightness == Brightness.light ? Colors.white : nearBlack,
        error: brandError,
        brightness: brightness,
      ),
      scaffoldBackgroundColor: brightness == Brightness.light ? Colors.white : nearBlack,
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
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: brandSkyBlue,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 56),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.cairo(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: brightness == Brightness.light ? Colors.grey[100] : Colors.grey[900],
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: brandSkyBlue, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: brandError, width: 2),
        ),
        prefixIconColor: brandNavy,
        labelStyle: GoogleFonts.cairo(color: Colors.grey[600]),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: brandNavy,
        selectedItemColor: brandSkyBlue,
        unselectedItemColor: Colors.white54,
        type: BottomNavigationBarType.fixed,
      ),
    );
  }
}
