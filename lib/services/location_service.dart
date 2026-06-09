import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:geolocator/geolocator.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:geocoding/geocoding.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../core/errors/app_error.dart';
import '../core/utils/logger.dart';

/// Service responsible for managing all device location operations.
/// 
/// Handles permissions, acquiring GPS coordinates, reverse geocoding,
/// and maintaining active real-time tracking streams for drivers and users.
class LocationService {
  final Ref _ref;
  
  /// Creates a new [LocationService].
  LocationService(this._ref);
  StreamSubscription<Position>? _userTrackingSubscription;
  StreamSubscription<Position>? _jobTrackingSubscription;

  /// Requests location permissions. Returns true if granted.
  Future<Result<bool, AppError>> requestPermission() async {
    appLogger.d('📍 [LocationService:requestPermission] Check starting...');
    
    // 1. Check current system permission status first
    var permission = await Geolocator.checkPermission();
    appLogger.d('📍 [LocationService:requestPermission] Current Permission State: $permission');
    
    if (permission == LocationPermission.denied) {
      appLogger.d('📍 [LocationService:requestPermission] Status denied. Presenting system permission dialog...');
      permission = await Geolocator.requestPermission();
      appLogger.d('📍 [LocationService:requestPermission] System dialog response: $permission');
    }

    if (permission == LocationPermission.denied) {
      appLogger.d('📍 [LocationService:requestPermission] Failure: Location permission denied by user.');
      return const Result.failure(LocationError('Location permission denied.'));
    }

    if (permission == LocationPermission.deniedForever) {
      appLogger.d('📍 [LocationService:requestPermission] Failure: Location permissions permanently denied.');
      return const Result.failure(LocationError('Location permissions are permanently denied. Please enable them in settings.'));
    }

    // 2. Check if the system-wide location service (GPS) is enabled
    bool isServiceEnabled = await Geolocator.isLocationServiceEnabled();
    appLogger.d('📍 [LocationService:requestPermission] GPS Hardware Enabled: $isServiceEnabled');
    if (!isServiceEnabled) {
      appLogger.d('📍 [LocationService:requestPermission] Failure: GPS_DISABLED');
      return const Result.failure(LocationError('GPS_DISABLED'));
    }

    appLogger.d('📍 [LocationService:requestPermission] Success: Permission granted and GPS enabled.');
    return const Result.success(true);
  }


  /// Helper to open device location settings
  Future<void> openSettings() async {
    appLogger.d('📍 [LocationService:openSettings] Launching native Android location settings...');
    if (kIsWeb) {
      appLogger.d('📍 [LocationService:openSettings] Not supported on Web.');
      return;
    }
    await Geolocator.openLocationSettings();
  }

  /// Gets the current position of the user.
  Future<Position?> getCurrentLocation() async {
    appLogger.d('📍 [LocationService:getCurrentLocation] Invoked. Checking permissions first...');
    final status = await Geolocator.checkPermission();
    appLogger.d('📍 [LocationService:getCurrentLocation] Permission status: $status');
    
    if (status != LocationPermission.whileInUse && status != LocationPermission.always) {
      appLogger.d('📍 [LocationService:getCurrentLocation] Access Denied: Returning null.');
      return null;
    }

    if (!kIsWeb) {
      try {
        appLogger.d('📍 [LocationService:getCurrentLocation] Attempt 1: Fetching last known position...');
        final lastKnown = await Geolocator.getLastKnownPosition();
        if (lastKnown != null) {
          appLogger.d('📍 [LocationService:getCurrentLocation] Attempt 1 Success! Found cached coordinate: (${lastKnown.latitude}, ${lastKnown.longitude})');
          return lastKnown;
        }
        appLogger.d('📍 [LocationService:getCurrentLocation] Attempt 1 result: Cached position was null. Proceeding to Attempt 2...');
      } catch (e) {
        appLogger.d('📍 [LocationService:getCurrentLocation] Attempt 1 Exception: $e');
      }
    } else {
      appLogger.d('📍 [LocationService:getCurrentLocation] Attempt 1 Skipped: getLastKnownPosition is not supported on Web.');
    }

    try {
      appLogger.d('📍 [LocationService:getCurrentLocation] Attempt 2: Requesting current position (Low Accuracy, 4s Timeout)...');
      final pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.low,
          timeLimit: Duration(seconds: 4),
        ),
      );
      appLogger.d('📍 [LocationService:getCurrentLocation] Attempt 2 Success! Coord: (${pos.latitude}, ${pos.longitude})');
      return pos;
    } catch (e) {
      appLogger.d('📍 [LocationService:getCurrentLocation] Attempt 2 Exception (Timeout/Error): $e. Proceeding to Attempt 3...');
      
      try {
        appLogger.d('📍 [LocationService:getCurrentLocation] Attempt 3: Requesting current position (Medium Accuracy, 4s Timeout)...');
        final pos = await Geolocator.getCurrentPosition(
          locationSettings: const LocationSettings(
            accuracy: LocationAccuracy.medium,
            timeLimit: Duration(seconds: 4),
          ),
        );
        appLogger.d('📍 [LocationService:getCurrentLocation] Attempt 3 Success! Coord: (${pos.latitude}, ${pos.longitude})');
        return pos;
      } catch (err) {
        appLogger.d('📍 [LocationService:getCurrentLocation] Attempt 3 Exception (Final Failure): $err. Returning null.');
        return null;
      }
    }
  }

  /// Converts coordinates into a human-readable address.
  Future<String> reverseGeocode(double lat, double lng) async {
    appLogger.d('📍 [LocationService:reverseGeocode] Invoked for coordinates: ($lat, $lng)');
    try {
      final placemarks = await placemarkFromCoordinates(lat, lng);
      appLogger.d('📍 [LocationService:reverseGeocode] Geocoding returned ${placemarks.length} results.');
      if (placemarks.isNotEmpty) {
        final p = placemarks.first;
        final formattedAddress = '${p.street}, ${p.subLocality}, ${p.locality}';
        appLogger.d('📍 [LocationService:reverseGeocode] Success! Address: "$formattedAddress"');
        return formattedAddress;
      }
      appLogger.d('📍 [LocationService:reverseGeocode] Empty results returned from placemark library.');
      return 'Unknown Location';
    } catch (e) {
      appLogger.d('📍 [LocationService:reverseGeocode] Exception during reverse geocoding: $e');
      return 'Unknown Location';
    }
  }

  /// Starts writing the driver's live location to tracking/{jobId}.
  void startTracking(String jobId) {
    appLogger.d('📍 [LocationService:startTracking] Starting location tracking stream for Job ID: $jobId');
    stopTrackingJob(); // Cancel any existing job tracking
    
    Position? lastPos;
    
    _jobTrackingSubscription = Geolocator.getPositionStream(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 5, // Tier-safe high-precision filter for moving vehicles
      ),
    ).listen(
      (pos) {
        double heading = pos.heading;
        final speed = pos.speed; // Speed in meters per second
        
        if (speed > 1.5) {
          // Moving: Use native course bearing if valid, otherwise compute path-delta bearing
          if ((heading == 0.0 || heading.isNaN) && lastPos != null) {
            final calculatedBearing = Geolocator.bearingBetween(
              lastPos!.latitude,
              lastPos!.longitude,
              pos.latitude,
              pos.longitude,
            );
            
            final distanceMoved = Geolocator.distanceBetween(
              lastPos!.latitude,
              lastPos!.longitude,
              pos.latitude,
              pos.longitude,
            );
            
            if (distanceMoved > 1.0) {
              heading = calculatedBearing;
            } else {
              heading = lastPos!.heading;
            }
          }
        } else if (lastPos != null) {
          // Stopped/Slow (e.g. traffic light): Freeze heading to prevent erratic map/pin spinning!
          heading = lastPos!.heading;
        }
        
        lastPos = pos;
        
        appLogger.d('📍 [LocationService:startTracking] Stream coordinate update for Job $jobId: (${pos.latitude}, ${pos.longitude}), Heading: $heading');
        FirebaseFirestore.instance.collection('tracking').doc(jobId).set({
          'driverLatLng': GeoPoint(pos.latitude, pos.longitude),
          'updatedAt': FieldValue.serverTimestamp(),
          'heading': heading,
        }).then((_) {
          appLogger.d('📍 [LocationService:startTracking] Successfully updated tracking document in Firestore.');
        }).catchError((e) {
          appLogger.d('📍 [LocationService:startTracking] Firestore write error: $e');
        });
      },
      onError: (e) => appLogger.d('📍 [LocationService:startTracking] Stream encountered error: $e'),
    );
  }

  void stopTrackingJob() {
    if (_jobTrackingSubscription != null) {
      appLogger.d('📍 [LocationService:stopTrackingJob] Terminating active job tracking stream.');
      _jobTrackingSubscription?.cancel();
      _jobTrackingSubscription = null;
    }
  }

  /// Starts writing any user's location (Driver or Customer) to their user profile.
  Future<void> trackUser(String uid) async {
    appLogger.d('📍 [LocationService:trackUser] Starting user tracking stream for UID: $uid');
    stopTrackingUser(); // Cancel any existing user tracking

    final status = await Geolocator.checkPermission();
    appLogger.d('📍 [LocationService:trackUser] Check permissions: $status');
    if (status != LocationPermission.whileInUse && status != LocationPermission.always) {
      appLogger.d('📍 [LocationService:trackUser] Skipped: Permission not granted ($status)');
      return;
    }

    bool isServiceEnabled = await Geolocator.isLocationServiceEnabled();
    appLogger.d('📍 [LocationService:trackUser] Check GPS state: $isServiceEnabled');
    if (!isServiceEnabled) {
      appLogger.d('📍 [LocationService:trackUser] Skipped: GPS is disabled');
      return;
    }

    _userTrackingSubscription = Geolocator.getPositionStream(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.medium,
        distanceFilter: 50,
      ),
    ).listen(
      (pos) {
        appLogger.d('📍 [LocationService:trackUser] Stream coordinate update for User $uid: (${pos.latitude}, ${pos.longitude})');
        FirebaseFirestore.instance.collection('users').doc(uid).update({
          'lastKnownLocation': GeoPoint(pos.latitude, pos.longitude),
          'lastSeen': FieldValue.serverTimestamp(),
        }).then((_) {
          appLogger.d('📍 [LocationService:trackUser] Successfully updated user profile in Firestore.');
        }).catchError((e) {
          appLogger.d('📍 [LocationService:trackUser] Firestore update error: $e');
          stopTrackingUser();
        });

        // Dynamic address reverse-geocoding resolution for the banner
        reverseGeocode(pos.latitude, pos.longitude).then((address) {
          _ref.read(currentAddressProvider.notifier).setAddress(address);
        }).catchError((e) {
          appLogger.d('📍 [LocationService:trackUser] Address resolution error: $e');
        });
      },
      onError: (e) => appLogger.d('📍 [LocationService:trackUser] Stream encountered error: $e'),
    );
  }

  void stopTrackingUser() {
    if (_userTrackingSubscription != null) {
      appLogger.d('📍 [LocationService:stopTrackingUser] Terminating active user profile stream.');
      _userTrackingSubscription?.cancel();
      _userTrackingSubscription = null;
    }
  }
}

final locationServiceProvider = Provider((ref) => LocationService(ref));

/// Notifier to track whether the user has permanently denied location permissions.
class LocationPermissionDeniedNotifier extends Notifier<bool> {
  @override
  bool build() => false;

  void setDenied(bool value) {
    appLogger.d('📍 [LocationPermissionDeniedNotifier] State change: $value');
    state = value;
  }
}

final locationPermissionDeniedProvider = NotifierProvider<LocationPermissionDeniedNotifier, bool>(
  () => LocationPermissionDeniedNotifier(),
);

enum LocationStatus { loading, enabled, disabled }

/// Notifier that tracks the global state of the device's location services.
/// 
/// Handles manual overrides and system-level GPS toggle states.
class LocationStatusNotifier extends Notifier<LocationStatus> {
  bool _manuallyDisabled = false;

  bool get isManuallyDisabled => _manuallyDisabled;

  @override
  LocationStatus build() {
    appLogger.d('📍 [LocationStatusNotifier] Building notifier state...');
    _checkStatus();
    return LocationStatus.loading;
  }

  Future<void> _checkStatus() async {
    if (_manuallyDisabled) {
      state = LocationStatus.disabled;
      return;
    }
    try {
      final isServiceEnabled = await Geolocator.isLocationServiceEnabled();
      final permission = await Geolocator.checkPermission();
      appLogger.d('📍 [LocationStatusNotifier:_checkStatus] GPS Enabled: $isServiceEnabled, Permission: $permission');
      if (isServiceEnabled &&
          (permission == LocationPermission.whileInUse ||
              permission == LocationPermission.always)) {
        state = LocationStatus.enabled;
      } else {
        state = LocationStatus.disabled;
      }
    } catch (e) {
      appLogger.d('📍 [LocationStatusNotifier:_checkStatus] Exception encountered: $e. Defaulting status to disabled.');
      state = LocationStatus.disabled;
    }
    appLogger.d('📍 [LocationStatusNotifier:_checkStatus] Final determined state: $state');
  }

  void toggleManualOff() {
    appLogger.d('📍 [LocationStatusNotifier] Toggled manual OFF override.');
    _manuallyDisabled = true;
    state = LocationStatus.disabled;
    ref.read(locationServiceProvider).stopTrackingUser();
  }

  void toggleManualOn() {
    appLogger.d('📍 [LocationStatusNotifier] Toggled manual ON override.');
    _manuallyDisabled = false;
    _checkStatus();
  }

  void setStatus(LocationStatus status) {
    appLogger.d('📍 [LocationStatusNotifier:setStatus] State change requested: $status');
    state = status;
  }
}

final locationStatusProvider = NotifierProvider<LocationStatusNotifier, LocationStatus>(
  () => LocationStatusNotifier(),
);

/// Notifier that stores the currently resolved human-readable address.
/// 
/// Persists the last known address to SharedPreferences to show it immediately
/// on app startup before a new GPS fix is obtained.
class CurrentAddressNotifier extends Notifier<String?> {
  @override
  String? build() {
    _init();
    return null;
  }

  Future<void> _init() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final lastKnown = prefs.getString('last_known_address');
      if (lastKnown != null && state == null) {
        state = lastKnown;
        appLogger.d('📍 [CurrentAddressNotifier] Loaded cached address: "$lastKnown"');
      }
    } catch (e) {
      appLogger.d('📍 [CurrentAddressNotifier] Error loading cached address: $e');
    }
  }

  void setAddress(String? address) {
    state = address;
    if (address != null && address.isNotEmpty) {
      SharedPreferences.getInstance().then((prefs) {
        prefs.setString('last_known_address', address);
      }).catchError((e) {
        appLogger.d('📍 [CurrentAddressNotifier] Error saving address to cache: $e');
      });
    }
  }
}

final currentAddressProvider = NotifierProvider<CurrentAddressNotifier, String?>(
  () => CurrentAddressNotifier(),
);

Future<void> fetchAndResolveCurrentAddress(WidgetRef ref) async {
  appLogger.d('📍 [AddressResolver] Fetching current coordinates for banner...');
  final loc = ref.read(locationServiceProvider);
  final pos = await loc.getCurrentLocation();
  if (pos != null) {
    appLogger.d('📍 [AddressResolver] Coordinate retrieved: (${pos.latitude}, ${pos.longitude})');
    final address = await loc.reverseGeocode(pos.latitude, pos.longitude);
    appLogger.d('📍 [AddressResolver] Resolved address for banner: "$address"');
    ref.read(currentAddressProvider.notifier).setAddress(address);
  } else {
    appLogger.d('📍 [AddressResolver] Could not retrieve coordinates for banner.');
  }
}
