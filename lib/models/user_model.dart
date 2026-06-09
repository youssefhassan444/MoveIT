import 'package:cloud_firestore/cloud_firestore.dart';

/// Data model representing a User in the system.
/// 
/// Maps directly to the 'users' collection in Firestore.
/// Supports two main roles: 'customer' and 'driver'.
class UserModel {
  /// The Firebase Auth user ID.
  final String uid;
  
  /// The role of the user, typically 'customer' or 'driver'.
  final String role;
  
  /// The display name of the user.
  final String displayName;
  
  /// The email address of the user.
  final String email;
  
  /// Optional URL pointing to the user's profile picture.
  final String? photoUrl;
  
  /// The timestamp when the user account was created.
  final DateTime createdAt;
  
  // --- Driver-specific fields ---
  
  /// The type of vehicle the driver operates (e.g., 'motorcycle', 'mini_truck', 'van').
  final String? vehicleType;
  
  /// The license plate number of the driver's vehicle.
  final String? licensePlate;
  
  /// Total earnings accumulated by the driver, represented in Piastres.
  final int totalEarningsPiastres;
  
  /// Indicates whether the driver's KYC verification is complete.
  final bool isVerified;
  
  /// The current available balance in the driver's wallet, in Piastres.
  final int walletBalancePiastres;
  
  // --- Messaging/Notification fields ---
  
  /// Firebase Cloud Messaging token for sending push notifications.
  final String? fcmToken;

  // --- Tracking fields ---
  
  /// The last recorded geographical location of the user/driver.
  final GeoPoint? lastKnownLocation;
  
  /// The timestamp when the user was last active or seen.
  final DateTime? lastSeen;

  /// Creates a new [UserModel] instance.
  const UserModel({
    required this.uid,
    required this.role,
    required this.displayName,
    required this.email,
    this.photoUrl,
    required this.createdAt,
    this.vehicleType,
    this.licensePlate,
    this.totalEarningsPiastres = 0,
    this.isVerified = false,
    this.walletBalancePiastres = 0,
    this.fcmToken,
    this.lastKnownLocation,
    this.lastSeen,
  });

  /// Helper getter to check if the user is a driver.
  bool get isDriver => role == 'driver';
  
  /// Helper getter to check if the user is a customer.
  bool get isCustomer => role == 'customer';

  /// Creates a [UserModel] from a Firestore [DocumentSnapshot].
  /// 
  /// Extracts data and handles null values gracefully.
  factory UserModel.fromFirestore(DocumentSnapshot doc) {
    // Extract the raw data map
    final d = doc.data() as Map<String, dynamic>;
    
    return UserModel(
      uid: doc.id,
      role: d['role'] as String? ?? 'customer',
      displayName: d['displayName'] as String? ?? '',
      email: d['email'] as String? ?? '',
      photoUrl: d['photoUrl'] as String?,
      // Safely parse timestamps
      createdAt: (d['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      vehicleType: d['vehicleType'] as String?,
      licensePlate: d['licensePlate'] as String?,
      totalEarningsPiastres: d['totalEarningsPiastres'] as int? ?? 0,
      isVerified: d['isVerified'] as bool? ?? false,
      walletBalancePiastres: d['walletBalancePiastres'] as int? ?? 0,
      fcmToken: d['fcmToken'] as String?,
      lastKnownLocation: d['lastKnownLocation'] as GeoPoint?,
      lastSeen: (d['lastSeen'] as Timestamp?)?.toDate(),
    );
  }

  /// Converts this [UserModel] to a Map for saving to Firestore.
  /// 
  /// Automatically uses [FieldValue.serverTimestamp()] for the creation date.
  Map<String, dynamic> toFirestore() => {
        'role': role,
        'displayName': displayName,
        'email': email,
        if (photoUrl != null) 'photoUrl': photoUrl,
        'createdAt': FieldValue.serverTimestamp(),
        // Conditionally include driver fields
        if (vehicleType != null) 'vehicleType': vehicleType,
        if (licensePlate != null) 'licensePlate': licensePlate,
        'totalEarningsPiastres': totalEarningsPiastres,
        'isVerified': isVerified,
        'walletBalancePiastres': walletBalancePiastres,
        if (fcmToken != null) 'fcmToken': fcmToken,
        if (lastKnownLocation != null) 'lastKnownLocation': lastKnownLocation,
        if (lastSeen != null) 'lastSeen': Timestamp.fromDate(lastSeen!),
      };

  /// Creates a modified copy of the current [UserModel] with updated fields.
  UserModel copyWith({
    String? photoUrl,
    String? licensePlate,
    String? fcmToken,
    int? totalEarningsPiastres,
    bool? isVerified,
    int? walletBalancePiastres,
    GeoPoint? lastKnownLocation,
    DateTime? lastSeen,
  }) =>
      UserModel(
        uid: uid,
        role: role,
        displayName: displayName,
        email: email,
        // Replace field if a new value is provided, otherwise keep existing
        photoUrl: photoUrl ?? this.photoUrl,
        createdAt: createdAt,
        vehicleType: vehicleType,
        licensePlate: licensePlate ?? this.licensePlate,
        totalEarningsPiastres:
            totalEarningsPiastres ?? this.totalEarningsPiastres,
        isVerified: isVerified ?? this.isVerified,
        walletBalancePiastres: walletBalancePiastres ?? this.walletBalancePiastres,
        fcmToken: fcmToken ?? this.fcmToken,
        lastKnownLocation: lastKnownLocation ?? this.lastKnownLocation,
        lastSeen: lastSeen ?? this.lastSeen,
      );
}
