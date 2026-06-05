import 'package:cloud_firestore/cloud_firestore.dart';

/// Data model representing a User in the system.
/// 
/// Maps directly to the 'users' collection in Firestore.
/// Supports two main roles: 'customer' and 'driver'.
class UserModel {
  final String uid;
  final String role; // 'customer' | 'driver'
  final String displayName;
  final String email;
  final String? photoUrl;
  final DateTime createdAt;
  
  // Driver-specific fields
  final String? vehicleType; // e.g., 'motorcycle', 'car', 'van'
  final int totalEarningsPiastres; // Default 0
  final bool isVerified; // KYC verification status
  final int walletBalancePiastres; // Current wallet balance
  
  // Messaging/Notification fields
  final String? fcmToken;

  // Tracking fields
  final GeoPoint? lastKnownLocation;
  final DateTime? lastSeen;

  const UserModel({
    required this.uid,
    required this.role,
    required this.displayName,
    required this.email,
    this.photoUrl,
    required this.createdAt,
    this.vehicleType,
    this.totalEarningsPiastres = 0,
    this.isVerified = false,
    this.walletBalancePiastres = 0,
    this.fcmToken,
    this.lastKnownLocation,
    this.lastSeen,
  });

  /// Helper getters to check roles easily throughout the app.
  bool get isDriver => role == 'driver';
  bool get isCustomer => role == 'customer';

  /// Creates a [UserModel] from a Firestore [DocumentSnapshot].
  factory UserModel.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    return UserModel(
      uid: doc.id,
      role: d['role'] as String? ?? 'customer',
      displayName: d['displayName'] as String? ?? '',
      email: d['email'] as String? ?? '',
      photoUrl: d['photoUrl'] as String?,
      createdAt: (d['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      vehicleType: d['vehicleType'] as String?,
      totalEarningsPiastres: d['totalEarningsPiastres'] as int? ?? 0,
      isVerified: d['isVerified'] as bool? ?? false,
      walletBalancePiastres: d['walletBalancePiastres'] as int? ?? 0,
      fcmToken: d['fcmToken'] as String?,
      lastKnownLocation: d['lastKnownLocation'] as GeoPoint?,
      lastSeen: (d['lastSeen'] as Timestamp?)?.toDate(),
    );
  }

  /// Converts the model to a Map for saving to Firestore.
  Map<String, dynamic> toFirestore() => {
        'role': role,
        'displayName': displayName,
        'email': email,
        if (photoUrl != null) 'photoUrl': photoUrl,
        'createdAt': FieldValue.serverTimestamp(),
        if (vehicleType != null) 'vehicleType': vehicleType,
        'totalEarningsPiastres': totalEarningsPiastres,
        'isVerified': isVerified,
        'walletBalancePiastres': walletBalancePiastres,
        if (fcmToken != null) 'fcmToken': fcmToken,
        if (lastKnownLocation != null) 'lastKnownLocation': lastKnownLocation,
        if (lastSeen != null) 'lastSeen': Timestamp.fromDate(lastSeen!),
      };

  /// Creates a modified copy of the current [UserModel].
  UserModel copyWith({
    String? photoUrl,
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
        photoUrl: photoUrl ?? this.photoUrl,
        createdAt: createdAt,
        vehicleType: vehicleType,
        totalEarningsPiastres:
            totalEarningsPiastres ?? this.totalEarningsPiastres,
        isVerified: isVerified ?? this.isVerified,
        walletBalancePiastres: walletBalancePiastres ?? this.walletBalancePiastres,
        fcmToken: fcmToken ?? this.fcmToken,
        lastKnownLocation: lastKnownLocation ?? this.lastKnownLocation,
        lastSeen: lastSeen ?? this.lastSeen,
      );
}
