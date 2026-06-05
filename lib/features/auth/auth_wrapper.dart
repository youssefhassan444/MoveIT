import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../services/auth_service.dart';
import '../../core/widgets/error_state_widget.dart';
import '../../core/theme/app_theme.dart';

/// The [AuthWrapper] is the landing widget for the root path ('/').
/// 
/// It acts as a traffic controller that:
/// 1. Watches [authStateChangesProvider] to see if a user is logged in.
/// 2. Watches [currentUserDocProvider] to determine the user's role (Driver vs Customer).
/// 3. Redirects the user to the appropriate shell or the login screen.
class AuthWrapper extends ConsumerWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 1. Listen to the basic Firebase Auth state
    final authState = ref.watch(authStateChangesProvider);
    
    // 2. Listen to our custom Firestore user profile
    final userDoc = ref.watch(currentUserDocProvider);

    return authState.when(
      data: (user) {
        // If not logged in, go to login screen
        if (user == null) {
          return const _Redirector(target: '/login');
        }

        // If logged in, wait for the Firestore profile to load
        return userDoc.when(
          data: (model) {
            if (model == null) {
              return ErrorStateWidget(
                message: "We couldn't load your profile. Please check your connection.",
                onRetry: () => ref.invalidate(currentUserDocProvider),
              );
            }

            // Redirect based on role
            if (model.role == 'customer') {
              return const _Redirector(target: '/customer');
            } else {
              return const _Redirector(target: '/driver');
            }
          },
          loading: () => const _LoadingScreen(),
          error: (e, st) => ErrorStateWidget(
            message: 'Something went wrong while loading your profile.',
            onRetry: () => ref.invalidate(currentUserDocProvider),
          ),
        );
      },
      loading: () => const _LoadingScreen(),
      error: (e, st) => ErrorStateWidget(
        message: 'Authentication error. Please try again.',
        onRetry: () => ref.invalidate(authStateChangesProvider),
      ),
    );
  }
}

/// A simple splash-style screen shown while checking auth state.
class _LoadingScreen extends StatelessWidget {
  const _LoadingScreen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppTheme.brandNavy,
      body: Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(AppTheme.brandSkyBlue),
        ),
      ),
    );
  }
}

/// A helper widget that performs a GoRouter redirect after the current frame is rendered.
class _Redirector extends StatefulWidget {
  final String target;
  const _Redirector({required this.target});

  @override
  State<_Redirector> createState() => _RedirectorState();
}

class _RedirectorState extends State<_Redirector> {
  @override
  void initState() {
    super.initState();
    // Redirection must happen after the build phase is complete
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) context.go(widget.target);
    });
  }

  @override
  Widget build(BuildContext context) => const _LoadingScreen();
}
