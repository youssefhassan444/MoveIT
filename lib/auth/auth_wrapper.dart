import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../services/auth_service.dart';
import '../../core/widgets/error_state_widget.dart';
import '../../core/theme/app_theme.dart';

class AuthWrapper extends ConsumerWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateChangesProvider);
    final userDoc = ref.watch(currentUserDocProvider);

    return authState.when(
      data: (user) {
        if (user == null) {
          return const _Redirector(target: '/login');
        }

        return userDoc.when(
          data: (model) {
            if (model == null) {
              return ErrorStateWidget(
                message: "We couldn't load your profile. Please check your connection.",
                onRetry: () => ref.invalidate(currentUserDocProvider),
              );
            }

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
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) context.go(widget.target);
    });
  }

  @override
  Widget build(BuildContext context) => const _LoadingScreen();
}
