// ignore_for_file: unawaited_futures
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:flutter/foundation.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_theme.dart';
import '../../core/widgets/custom_snackbar.dart';
import '../../core/errors/app_error.dart';
import '../../services/auth_service.dart';

/// A screen that allows existing users to log into the application.
///
/// This screen uses [HookConsumerWidget] to manage local form state (like 
/// email, password, and loading status) while also interacting with Riverpod
/// providers for authentication.
class LoginScreen extends HookConsumerWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Controllers for email and password text fields.
    final emailCtrl = useTextEditingController();
    final passCtrl = useTextEditingController();
    
    // State to manage the loading indicator during the login process.
    final loading = useState(false);
    
    // Key to validate the form fields.
    final formKey = useMemoized(() => GlobalKey<FormState>());

    /// Handles the login process by validating the form and calling the
    /// authentication service.
    Future<void> login() async {
      // Validate form fields before proceeding.
      if (!formKey.currentState!.validate()) {
        HapticFeedback.mediumImpact();
        return;
      }
      
      loading.value = true;
      final auth = ref.read(firebaseAuthProvider);
      final result = await ref.read(authServiceProvider).signIn(
            email: emailCtrl.text.trim(),
            password: passCtrl.text.trim(),
          );
      loading.value = false;

      if (!context.mounted) return;
      
      // On success, ensure the user state is updated before navigating.
      if (result.isSuccess) {
        if (auth.currentUser == null) {
          // Wait for the auth state change to reflect the logged-in user.
          await auth.authStateChanges().firstWhere((user) => user != null);
        }
        if (!context.mounted) return;
        
        // Navigate to the auth wrapper to handle routing based on user role.
        context.go('/auth');
        return;
      }

      // Handle authentication failures.
      result.when(
        success: (_) => null,
        failure: (error) {
          HapticFeedback.heavyImpact();
          CustomSnackBar.show(
            context,
            message: AppError.mapMessage(error),
            type: SnackBarType.error,
          );
        },
      );
    }

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Form(
              key: formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(height: 20),
                  Image.asset(
                    'assets/moveit_master/moveit.png',
                    height: 120,
                  ),
                  const SizedBox(height: 30),
                  const Text(
                    'You already have an account',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Enter your email to login for this app',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: Colors.black54,
                    ),
                  ),
                  const SizedBox(height: 40),
                  TextFormField(
                    controller: emailCtrl,
                    keyboardType: TextInputType.emailAddress,
                    decoration: InputDecoration(
                      hintText: 'email@domain.com',
                      prefixIcon: const Icon(Icons.email),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      filled: true,
                      fillColor: Colors.grey[50],
                    ),
                    validator: (v) => (v == null || !v.contains('@'))
                        ? 'Enter a valid email'
                        : null,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: passCtrl,
                    keyboardType: TextInputType.visiblePassword,
                    obscureText: true,
                    decoration: InputDecoration(
                      labelText: 'password',
                      hintText: 'Enter your password',
                      prefixIcon: const Icon(Icons.lock),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      filled: true,
                      fillColor: Colors.grey[50],
                    ),
                    validator: (v) => (v == null || v.length < 6)
                        ? 'Password must be 6+ characters'
                        : null,
                  ),
                  const SizedBox(height: 24),
                  // LOGIN Button
                  SizedBox(
                    height: 56,
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: loading.value ? null : login,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.brandOrange,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                        elevation: 2,
                      ),
                      child: loading.value
                          ? const SizedBox(
                              height: 24,
                              width: 24,
                              child: CircularProgressIndicator(
                                  color: Colors.white, strokeWidth: 2,),)
                          : const Text(
                              'LOGIN',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                    ),
                  ),
                  if (!kIsWeb) ...[
                    const SizedBox(height: 20),
                    const Text(
                      'or',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.black45,
                      ),
                    ),
                    const SizedBox(height: 20),
                    // SIGN UP Button
                    SizedBox(
                      height: 56,
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () => context.push('/signup'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.brandNavy,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          elevation: 2,
                        ),
                        child: const Text(
                          'SIGN UP',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                  const SizedBox(height: 30),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20),
                    child: Text(
                      'By clicking continue, you agree to our terms of service and privacy policy',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: Colors.black45,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
