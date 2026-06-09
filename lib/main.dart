import 'dart:async';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'core/utils/logger.dart';
import 'firebase_options.dart';
import 'services/auth_service.dart';
import 'services/location_service.dart';

void main() async {
  await runZonedGuarded<Future<void>>(() async {
    WidgetsFlutterBinding.ensureInitialized();

    // Initialize Firebase
    try {
      if (Firebase.apps.isEmpty) {
        await Firebase.initializeApp(
          options: DefaultFirebaseOptions.currentPlatform,
        );
      }
    } catch (e) {
      appLogger.w('Firebase initialization warning: $e');
    }

    // Configure Crashlytics
    if (!kIsWeb) {
      FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;
      PlatformDispatcher.instance.onError = (error, stack) {
        FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
        return true;
      };
    }

    runApp(
      const ProviderScope(
        child: MoveItApp(),
      ),
    );
  }, (error, stack) {
    if (!kIsWeb) {
      FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
    } else {
      appLogger.e('Uncaught error', error: error, stackTrace: stack);
    }
  });
}

class MoveItApp extends ConsumerWidget {
  const MoveItApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.listen(authStateChangesProvider, (previous, next) {
      final user = next.value;
      if (user != null) {
        ref.read(locationServiceProvider).trackUser(user.uid);
      } else {
        ref.read(locationServiceProvider).stopTrackingUser();
      }
    });

    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'MoveIt',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.system,
      routerConfig: router,
    );
  }
}
