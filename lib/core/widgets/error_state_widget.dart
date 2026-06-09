import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import '../theme/app_theme.dart';

/// Reusable full-screen error state widget.
/// Shows a Lottie animation (drop the JSON in assets/lottie/error.json),
/// a styled error message, and a retry button.
class ErrorStateWidget extends StatelessWidget {
  final String title;
  final String message;
  final VoidCallback onRetry;
  final String? lottieAsset;

  final String buttonText;

  const ErrorStateWidget({
    super.key,
    this.title = 'Something went wrong',
    required this.message,
    required this.onRetry,
    this.lottieAsset, // e.g. 'assets/lottie/error.json'
    this.buttonText = 'Try Again',
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (lottieAsset != null)
              Lottie.asset(lottieAsset!, height: 200, repeat: true)
            else
              const Icon(Icons.error_outline_rounded,
                  size: 80, color: AppTheme.brandError,),
            const SizedBox(height: 24),
            Text(title,
                style: Theme.of(context).textTheme.headlineMedium,
                textAlign: TextAlign.center,),
            const SizedBox(height: 12),
            Text(message,
                style: Theme.of(context)
                    .textTheme
                    .bodyLarge
                    ?.copyWith(color: Colors.grey[600]),
                textAlign: TextAlign.center,),
            const SizedBox(height: 32),
            ElevatedButton(
                onPressed: onRetry, child: Text(buttonText),),
          ],
        ),
      ),
    );
  }
}
