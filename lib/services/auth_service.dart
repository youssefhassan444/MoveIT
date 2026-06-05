import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../models/user_model.dart';
import '../core/errors/app_error.dart';

/// Service for managing user authentication and profile data.
/// 
/// This file provides:
/// 1. Primitive providers for Firebase Auth and Firestore.
/// 2. Stream providers to watch the current user's session and document.
/// 3. The [AuthService] class for sign-in, sign-up, and sign-out logic.

// ── Providers ────────────────────────────────────────────────────────────────

/// Access to the underlying FirebaseAuth instance.
final firebaseAuthProvider =
    Provider<FirebaseAuth>((ref) => FirebaseAuth.instance);

/// Access to the underlying FirebaseFirestore instance.
final firestoreProvider =
    Provider<FirebaseFirestore>((ref) => FirebaseFirestore.instance);

/// Stream that emits the current Firebase [User] whenever the auth state changes.
final authStateChangesProvider = StreamProvider<User?>((ref) {
  return ref.watch(firebaseAuthProvider).authStateChanges();
});

/// Stream that watches the current user's custom [UserModel] from Firestore.
/// 
/// This is used throughout the app to determine if the user is a 'driver' or 'customer'.
final currentUserDocProvider = StreamProvider<UserModel?>((ref) {
  final authState = ref.watch(authStateChangesProvider);
  return authState.when(
    data: (user) {
      if (user == null) return Stream.value(null);
      return FirebaseFirestore.instance
          .collection('users')
          .doc(user.uid)
          .snapshots()
          .map((snap) => snap.exists ? UserModel.fromFirestore(snap) : null);
    },
    loading: () => Stream.value(null),
    error: (_, __) => Stream.value(null),
  );
});

/// Stream of any user's profile data by their unique ID.
final userByIdProvider = StreamProvider.family<UserModel?, String>((ref, uid) {
  final doc = FirebaseFirestore.instance.collection('users').doc(uid);
  return doc
      .snapshots()
      .map((snap) => snap.exists ? UserModel.fromFirestore(snap) : null);
});

// ── AuthService Class ────────────────────────────────────────────────────────

class AuthService {
  final FirebaseAuth _auth;
  final FirebaseFirestore _db;

  AuthService(this._auth, this._db);

  User? get currentUser => _auth.currentUser;

  /// Logs in a user with email and password.
  Future<Result<UserCredential, AppError>> signIn({
    required String email,
    required String password,
  }) async {
    try {
      final cred = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      return Result.success(cred);
    } on FirebaseAuthException catch (e) {
      return Result.failure(AppError.auth(_mapAuthError(e.code)));
    } catch (e) {
      return Result.failure(AppError.unknown(e.toString()));
    }
  }

  /// Registers a new user and creates their profile document in Firestore.
  Future<Result<UserCredential, AppError>> signUp({
    required String email,
    required String password,
    required String displayName,
    required String role, // 'customer' or 'driver'
    String? vehicleType,  // Only required for drivers
  }) async {
    try {
      final cred = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      // Create the internal user model
      final user = UserModel(
        uid: cred.user!.uid,
        role: role,
        displayName: displayName,
        email: email,
        createdAt: DateTime.now(),
        vehicleType: vehicleType,
      );

      // Save the profile to the 'users' collection
      await _db.collection('users').doc(cred.user!.uid).set(user.toFirestore());
      return Result.success(cred);
    } on FirebaseAuthException catch (e) {
      return Result.failure(AppError.auth(_mapAuthError(e.code)));
    } catch (e) {
      return Result.failure(AppError.unknown(e.toString()));
    }
  }

  /// Sends a password reset email.
  Future<Result<void, AppError>> resetPassword(String email) async {
    try {
      await _auth.sendPasswordResetEmail(email: email);
      return const Result.success(null);
    } on FirebaseAuthException catch (e) {
      return Result.failure(AppError.auth(_mapAuthError(e.code)));
    } catch (e) {
      return Result.failure(AppError.unknown(e.toString()));
    }
  }

  /// Logs out the current user.
  Future<void> signOut() => _auth.signOut();

  /// Maps technical Firebase error codes to human-readable messages.
  static String _mapAuthError(String code) => switch (code) {
        'wrong-password' => 'Incorrect password. Please try again.',
        'user-not-found' => 'No account found with this email.',
        'email-already-in-use' => 'An account with this email already exists.',
        'weak-password' => 'Password must be at least 6 characters.',
        'invalid-email' => 'Please enter a valid email address.',
        'network-request-failed' =>
          'No internet connection. Please check your network.',
        'too-many-requests' =>
          'Too many attempts. Please wait a moment and try again.',
        _ => 'Authentication failed. Please try again.',
      };
}

/// Global provider for the AuthService instance.
final authServiceProvider = Provider<AuthService>((ref) => AuthService(
      ref.watch(firebaseAuthProvider),
      ref.watch(firestoreProvider),
    ),);
