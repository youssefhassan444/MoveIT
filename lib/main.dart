import 'dart:async';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:flutter/foundation.dart';
import 'package:geolocator/geolocator.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'firebase_options.dart';
import 'services/auth_service.dart';
import 'services/location_service.dart';
import 'core/errors/app_error.dart';
import 'core/widgets/location_permission_dialog.dart';

void main() async {
  runZonedGuarded<Future<void>>(() async {
    WidgetsFlutterBinding.ensureInitialized();

    // Initialize Firebase
    try {
      if (Firebase.apps.isEmpty) {
        await Firebase.initializeApp(
          options: DefaultFirebaseOptions.currentPlatform,
        );
      }
    } catch (e) {
      debugPrint('Firebase initialization warning: $e');
    }

    // Configure Crashlytics
    FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;
    PlatformDispatcher.instance.onError = (error, stack) {
      FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
      return true;
    };

    runApp(
      const ProviderScope(
        child: MoveItApp(),
      ),
    );
  }, (error, stack) {
    FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
  });
}

class MoveItApp extends HookConsumerWidget {
  const MoveItApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'MoveIt',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.system,
      routerConfig: router,
      builder: (context, child) {
        return _LocationPermissionWrapper(child: child!);
      },
    );
  }
}

class _LocationPermissionWrapper extends HookConsumerWidget {
  final Widget child;
  const _LocationPermissionWrapper({required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDialogShowing = useRef(false);

    useEffect(() {
      void checkAndPrompt() async {
        if (isDialogShowing.value) return;

        debugPrint('📍 [MoveIt] Starting checkAndPrompt...');
        final loc = ref.read(locationServiceProvider);
        
        try {
          final isGpsEnabled = await Geolocator.isLocationServiceEnabled();
          final status = await Geolocator.checkPermission();
          debugPrint('📍 [MoveIt] GPS: $isGpsEnabled, Permission: $status');

          final statusNotifier = ref.read(locationStatusProvider.notifier);
          if (statusNotifier.isManuallyDisabled) {
            debugPrint('📍 [MoveIt] Aborting checkAndPrompt: Manual OFF override is active.');
            return;
          }

          if (isGpsEnabled && (status == LocationPermission.whileInUse || status == LocationPermission.always)) {
            ref.read(locationPermissionDeniedProvider.notifier).setDenied(false);
            ref.read(locationStatusProvider.notifier).setStatus(LocationStatus.enabled);
            final authUser = ref.read(authStateChangesProvider).value;
            if (authUser != null) loc.trackUser(authUser.uid);
            return;
          }

          // If the user is logged in, or if it is NOT the first time opening the app, do NOT show the popup dialog!
          final prefs = await SharedPreferences.getInstance();
          final isFirstTime = prefs.getBool('is_first_time_opening') ?? true;
          final isLoggedIn = ref.read(authStateChangesProvider).value != null;

          if (isLoggedIn || !isFirstTime) {
            debugPrint('📍 [MoveIt] Skipping permission popup: isLoggedIn=$isLoggedIn, isFirstTime=$isFirstTime');
            ref.read(locationPermissionDeniedProvider.notifier).setDenied(true);
            ref.read(locationStatusProvider.notifier).setStatus(LocationStatus.disabled);
            return;
          }

          // Save that the user has opened the app at least once and seen the popup
          await prefs.setBool('is_first_time_opening', false);

          WidgetsBinding.instance.addPostFrameCallback((_) {
            final navContext = rootNavigatorKey.currentContext;
            if (navContext != null && navContext.mounted) {
              isDialogShowing.value = true;
              showDialog(
                context: navContext,
                barrierDismissible: false,
                builder: (ctx) => LocationPermissionDialog(
                  onYes: () async {
                    Navigator.pop(ctx);
                    final result = await loc.requestPermission();
                    result.when(
                      success: (_) {
                        ref.read(locationPermissionDeniedProvider.notifier).setDenied(false);
                        ref.read(locationStatusProvider.notifier).setStatus(LocationStatus.enabled);
                        final authUser = ref.read(authStateChangesProvider).value;
                        if (authUser != null) loc.trackUser(authUser.uid);
                        fetchAndResolveCurrentAddress(ref);
                      },
                      failure: (error) {
                        ref.read(locationPermissionDeniedProvider.notifier).setDenied(true);
                        ref.read(locationStatusProvider.notifier).setStatus(LocationStatus.disabled);
                        if (AppError.mapMessage(error) == 'GPS_DISABLED') {
                          loc.openSettings();
                        }
                      },
                    );
                  },
                  onNo: () {
                    Navigator.pop(ctx);
                    ref.read(locationPermissionDeniedProvider.notifier).setDenied(true);
                    ref.read(locationStatusProvider.notifier).setStatus(LocationStatus.disabled);
                  },
                ),
              ).then((_) => isDialogShowing.value = false);
            } else {
              ref.read(locationPermissionDeniedProvider.notifier).setDenied(true);
              ref.read(locationStatusProvider.notifier).setStatus(LocationStatus.disabled);
            }
          });
        } catch (e) {
          debugPrint('📍 [MoveIt] Error: $e');
          ref.read(locationStatusProvider.notifier).setStatus(LocationStatus.disabled);
        }
      }

      final observer = _LifecycleObserver(onResume: checkAndPrompt);
      WidgetsBinding.instance.addObserver(observer);
      
      checkAndPrompt();
      return () => WidgetsBinding.instance.removeObserver(observer);
    }, [],);

    ref.listen(authStateChangesProvider, (previous, next) {
      final user = next.value;
      if (user != null) {
        ref.read(locationServiceProvider).trackUser(user.uid);
      } else {
        ref.read(locationServiceProvider).stopTrackingUser();
        ref.read(currentAddressProvider.notifier).setAddress(null);
      }
    });

    return child;
  }
}

class _LifecycleObserver extends WidgetsBindingObserver {
  final VoidCallback onResume;
  _LifecycleObserver({required this.onResume});

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      onResume();
    }
  }
}
