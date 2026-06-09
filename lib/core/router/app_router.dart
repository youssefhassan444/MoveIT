import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/login_screen.dart';
import '../../features/auth/signup_screen.dart';
import '../../features/auth/auth_wrapper.dart';

import '../../features/customer/customer_shell.dart';
import '../../features/customer/customer_home_screen.dart';
import '../../features/customer/customer_jobs_screen.dart';
import '../../features/customer/customer_job_detail_screen.dart';
import '../../features/customer/customer_history_screen.dart';
import '../../features/customer/post_job_screen.dart';

import '../../features/shared/customer_profile_screen.dart';

import '../../features/admin/dashboard_screen.dart';

import '../../features/driver/driver_shell.dart';
import '../../features/driver/job_board_screen.dart';
import '../../features/driver/active_job_screen.dart';
import '../../features/driver/driver_history_screen.dart';
import '../../features/driver/driver_job_detail_screen.dart';

import '../../features/shared/driver_profile_screen.dart';
import '../../features/shared/chat_screen.dart';

/// Global navigator key to access the navigation state anywhere in the app.
final rootNavigatorKey = GlobalKey<NavigatorState>();

/// Riverpod provider for the GoRouter configuration.
/// 
/// This provider handles all application routing using [GoRouter].
final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    navigatorKey: rootNavigatorKey,
    initialLocation: '/auth',

    routes: [

      // ───────── AUTH ─────────
      GoRoute(
        path: '/auth',
        builder: (context, state) => const AuthWrapper(),
      ),

      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),

      GoRoute(
        path: '/signup',
        builder: (context, state) => const SignupScreen(),
      ),

      // ───────── ADMIN ─────────
      GoRoute(
        path: '/admin',
        builder: (context, state) => const AdminDashboardScreen(),
      ),

      // ───────── SHARED ─────────
      
      // Shared chat screen for jobs.
      GoRoute(
        path: '/chat/:id',
        builder: (context, state) => ChatScreen(
          jobId: state.pathParameters['id']!, // Extract the job ID from the path.
        ),
      ),

      // ───────── CUSTOMER ─────────
      
      // Uses a ShellRoute to wrap customer screens with a bottom navigation bar.
      ShellRoute(
        builder: (context, state, child) => CustomerShell(child: child),
        routes: [

          GoRoute(
            path: '/customer',
            builder: (context, state) => const CustomerHomeScreen(),
          ),

          GoRoute(
            path: '/customer/jobs',
            builder: (context, state) => const CustomerJobsScreen(),
            routes: [
              GoRoute(
                path: ':id',
                builder: (context, state) => CustomerJobDetailScreen(
                  jobId: state.pathParameters['id']!,
                ),
              ),
            ],
          ),

          GoRoute(
            path: '/customer/history',
            builder: (context, state) => const CustomerHistoryScreen(),
          ),

          GoRoute(
            path: '/customer/profile',
            builder: (context, state) => const CustomerProfileScreen(),
          ),
        ],
      ),

      // Route for customers to post a new job outside the shell route.
      GoRoute(
        path: '/customer/post-job',
        builder: (context, state) => PostJobScreen(
          initialVehicleType: state.extra as String?, // Pass optional extra parameter.
        ),
      ),

      // ───────── DRIVER ─────────
      
      // Uses a ShellRoute to wrap driver screens with a bottom navigation bar.
      ShellRoute(
        builder: (context, state, child) => DriverShell(child: child),
        routes: [

          GoRoute(
            path: '/driver',
            builder: (context, state) => const JobBoardScreen(),
          ),

          GoRoute(
            path: '/driver/active',
            builder: (context, state) => const ActiveJobScreen(),
          ),

          GoRoute(
            path: '/driver/history',
            builder: (context, state) => const DriverHistoryScreen(),
            routes: [
              GoRoute(
                path: ':id',
                builder: (context, state) => DriverJobDetailScreen(
                  jobId: state.pathParameters['id']!,
                ),
              ),
            ],
          ),

          GoRoute(
            path: '/driver/profile',
            builder: (context, state) => const DriverProfileScreen(),
          ),
        ],
      ),
    ],
  );
});