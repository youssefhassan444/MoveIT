import 'package:latlong2/latlong.dart';

/// App-wide constants for MoveIt.
/// This class holds static constant values used throughout the application,
/// such as default map coordinates, currency formatting, and vehicle types.
class AppConstants {
  // Private constructor to prevent instantiation.
  AppConstants._();

  // ── Cairo, Egypt default map center ──
  
  /// The default latitude for Cairo, Egypt.
  static const double cairoLat = 30.0444;
  
  /// The default longitude for Cairo, Egypt.
  static const double cairoLng = 31.2357;
  
  /// The default map center coordinate (Cairo).
  static const LatLng cairoCenter = LatLng(cairoLat, cairoLng);
  
  /// The default zoom level for maps.
  static const double defaultMapZoom = 13.0;

  // ── Currency ──
  
  /// Formats an integer amount of piastres into an EGP string.
  /// 1 EGP = 100 piastres. All monetary values are stored as int piastres.
  static String formatPiastres(int piastres) {
    // Convert piastres to Egyptian Pounds (EGP).
    final egp = piastres / 100;
    // Format to 2 decimal places.
    return '${egp.toStringAsFixed(2)} EGP';
  }

  /// Parses a double EGP string/value input to a piastres integer.
  static int egpToPiastres(double egp) => (egp * 100).round();

  // ── Vehicle types ──
  
  /// A list of supported vehicle types.
  static const List<String> vehicleTypes = [
    'motorcycle',
    'mini_truck',
    'truck',
    'heavy_truck',
    'refrigerated_truck',
  ];

  /// Returns a human-readable label for a given vehicle [type].
  static String vehicleLabel(String type) {
    // Map internal vehicle type keys to display labels.
    switch (type) {
      case 'motorcycle':
        return 'Motorcycle';
      case 'mini_truck':
        return 'Mini-Truck';
      case 'truck':
        return 'Truck';
      case 'heavy_truck':
        return 'Heavy Truck';
      case 'refrigerated_truck':
        return 'Refrigerated Truck';
      default:
        // Return the raw type if not found.
        return type;
    }
  }

  /// Returns a Material Icon name corresponding to a given vehicle [type].
  static String vehicleIcon(String type) {
    // Map internal vehicle type keys to icon identifiers.
    switch (type) {
      case 'motorcycle':
        return 'two_wheeler';
      case 'mini_truck':
        return 'airport_shuttle';
      case 'truck':
        return 'local_shipping';
      case 'heavy_truck':
        return 'fire_truck';
      case 'refrigerated_truck':
        return 'ac_unit';
      default:
        // Default to a shipping truck icon.
        return 'local_shipping';
    }
  }

  // ── Job statuses ──
  
  /// Status representing a newly created, unassigned job.
  static const String statusPending = 'pending';
  /// Status representing a job that has been accepted by a driver.
  static const String statusAccepted = 'accepted';
  /// Status representing a job currently in progress/transit.
  static const String statusInTransit = 'in_transit';
  /// Status representing a completed job.
  static const String statusDelivered = 'delivered';
  /// Status representing a canceled job.
  static const String statusCancelled = 'cancelled';

  // ── Cairo district lookup (bounding boxes for reverse geocoding) ──
  
  /// Returns the name of the Cairo district that encompasses the given [lat] and [lng].
  /// If the coordinates do not fall within any known district, 'Cairo' is returned.
  static String getDistrict(double lat, double lng) {
    // Iterate through predefined district bounding boxes.
    for (final d in _cairoDistricts) {
      if (lat >= d['minLat']! && lat <= d['maxLat']! &&
          lng >= d['minLng']! && lng <= d['maxLng']!) {
        return d['name'] as String;
      }
    }
    // Fallback if no district matches.
    return 'Cairo';
  }

  /// Predefined bounding boxes for districts in Cairo.
  static const List<Map<String, dynamic>> _cairoDistricts = [
    {'name': 'Maadi', 'minLat': 29.94, 'maxLat': 29.98, 'minLng': 31.24, 'maxLng': 31.30},
    {'name': 'Zamalek', 'minLat': 30.05, 'maxLat': 30.07, 'minLng': 31.21, 'maxLng': 31.23},
    {'name': 'Downtown', 'minLat': 30.04, 'maxLat': 30.06, 'minLng': 31.23, 'maxLng': 31.25},
    {'name': 'Heliopolis', 'minLat': 30.08, 'maxLat': 30.11, 'minLng': 31.31, 'maxLng': 31.36},
    {'name': 'Nasr City', 'minLat': 30.04, 'maxLat': 30.08, 'minLng': 31.33, 'maxLng': 31.38},
    {'name': 'New Cairo', 'minLat': 30.00, 'maxLat': 30.06, 'minLng': 31.40, 'maxLng': 31.50},
    {'name': 'Giza', 'minLat': 29.99, 'maxLat': 30.03, 'minLng': 31.19, 'maxLng': 31.22},
    {'name': 'Dokki', 'minLat': 30.03, 'maxLat': 30.05, 'minLng': 31.19, 'maxLng': 31.22},
    {'name': 'Mohandessin', 'minLat': 30.05, 'maxLat': 30.07, 'minLng': 31.19, 'maxLng': 31.21},
    {'name': '6th October', 'minLat': 29.93, 'maxLat': 30.00, 'minLng': 30.90, 'maxLng': 31.10},
  ];
}
