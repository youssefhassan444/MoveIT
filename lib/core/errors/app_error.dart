/// Sealed error hierarchy for MoveIt.
/// Every service method returns `Result<T, AppError>` — never throws to the UI.
sealed class AppError {
  const AppError();

  const factory AppError.network([String? message]) = NetworkError;
  const factory AppError.auth([String? message]) = AuthError;
  const factory AppError.firestore([String? message]) = FirestoreError;
  const factory AppError.storage([String? message]) = StorageError;
  const factory AppError.location([String? message]) = LocationError;
  const factory AppError.geocoding([String? message]) = GeocodingError;
  const factory AppError.validation([String? message]) = ValidationError;
  const factory AppError.unknown([String? message]) = UnknownError;

  /// Returns a user-friendly message for any AppError subtype.
  static String mapMessage(AppError error) {
    return switch (error) {
      NetworkError(:final message) =>
        message ?? 'No internet connection. Please check your network.',
      AuthError(:final message) =>
        message ?? 'Authentication failed. Please try again.',
      FirestoreError(:final message) =>
        message ?? 'Service temporarily unavailable. Please try again.',
      StorageError(:final message) =>
        message ?? 'File upload failed. Please check your connection.',
      LocationError(:final message) =>
        message ?? 'Location services are required for MoveIt.',
      GeocodingError(:final message) =>
        message ?? "Couldn't find the address. Please try again.",
      ValidationError(:final message) =>
        message ?? 'Please fix the errors in the form.',
      UnknownError(:final message) =>
        message ?? 'Something went wrong. Please try again.',
    };
  }
}

final class NetworkError extends AppError {
  final String? message;
  const NetworkError([this.message]);
}

final class AuthError extends AppError {
  final String? message;
  const AuthError([this.message]);
}

final class FirestoreError extends AppError {
  final String? message;
  const FirestoreError([this.message]);
}

final class StorageError extends AppError {
  final String? message;
  const StorageError([this.message]);
}

final class LocationError extends AppError {
  final String? message;
  const LocationError([this.message]);
}

final class GeocodingError extends AppError {
  final String? message;
  const GeocodingError([this.message]);
}

final class ValidationError extends AppError {
  final String? message;
  const ValidationError([this.message]);
}

final class UnknownError extends AppError {
  final String? message;
  const UnknownError([this.message]);
}

// ---------------------------------------------------------------------------
// Result<T, E> — a simple discriminated union. No code generation required.
// ---------------------------------------------------------------------------
sealed class Result<T, E> {
  const Result();

  const factory Result.success(T data) = Success;
  const factory Result.failure(E error) = Failure;

  /// Pattern-match on success/failure.
  R when<R>({
    required R Function(T data) success,
    required R Function(E error) failure,
  }) =>
      switch (this) {
        Success(:final data) => success(data),
        Failure(:final error) => failure(error),
      };

  bool get isSuccess => this is Success<T, E>;
  bool get isFailure => this is Failure<T, E>;
}

final class Success<T, E> extends Result<T, E> {
  final T data;
  const Success(this.data);
}

final class Failure<T, E> extends Result<T, E> {
  final E error;
  const Failure(this.error);
}
