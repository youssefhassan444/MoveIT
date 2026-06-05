import 'package:latlong2/latlong.dart';
/// App-wide constants for MoveIt.
class AppConstants {
  AppConstants._();

  // ── Cairo, Egypt default map center ──
  static const double cairoLat = 30.0444;
  static const double cairoLng = 31.2357;
  static const LatLng cairoCenter = LatLng(cairoLat, cairoLng);
  static const double defaultMapZoom = 13.0;

  // ── Currency ──
  /// 1 EGP = 100 piastres. All monetary values stored as int piastres.
  static String formatPiastres(int piastres) {
    final egp = piastres / 100;
    return '${egp.toStringAsFixed(2)} EGP';
  }

  /// Parse EGP string input to piastres int.
  static int egpToPiastres(double egp) => (egp * 100).round();

  // ── Vehicle types ──
  static const List<String> vehicleTypes = [
    'motorcycle',
    'sedan',
    'pickup_truck',
    'van',
    'large_truck',
  ];

  static String vehicleLabel(String type) {
    switch (type) {
      case 'motorcycle':
        return 'Motorcycle';
      case 'sedan':
        return 'Sedan Car';
      case 'pickup_truck':
        return 'Pickup Truck';
      case 'van':
        return 'Van';
      case 'large_truck':
        return 'Large Truck';
      default:
        return type;
    }
  }

  static String vehicleIcon(String type) {
    switch (type) {
      case 'motorcycle':
        return 'two_wheeler';
      case 'sedan':
        return 'directions_car';
      case 'pickup_truck':
        return 'local_shipping';
      case 'van':
        return 'airport_shuttle';
      case 'large_truck':
        return 'fire_truck';
      default:
        return 'local_shipping';
    }
  }

  // ── Job statuses ──
  static const String statusPending = 'pending';
  static const String statusAccepted = 'accepted';
  static const String statusInTransit = 'in_transit';
  static const String statusDelivered = 'delivered';
  static const String statusCancelled = 'cancelled';

  // ── Cairo district lookup (bounding boxes for reverse geocoding) ──
  static String getDistrict(double lat, double lng) {
    for (final d in _cairoDistricts) {
      if (lat >= d['minLat']! && lat <= d['maxLat']! &&
          lng >= d['minLng']! && lng <= d['maxLng']!) {
        return d['name'] as String;
      }
    }
    return 'Cairo';
  }

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
