import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:latlong2/latlong.dart';

/// Service for calculating road-based routes and travel estimates.
/// 
/// Uses the [OpenRouteService] Directions API.
const _openRouteServiceApiKey =
    'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6Ijc0YTFhZWQ5ZjVhYjQyMzU5NGNlY2NlYmVhMGY1OWQ4IiwiaCI6Im11cm11cjY0In0=';

/// Container for a single navigation step maneuver.
class NavigationStep {
  final String instruction;
  final double distanceMeters;
  final double durationSeconds;
  final int type; // Maneuver type code
  final int wayPointIndex; // Coordinate index where this step ends/maneuver happens

  const NavigationStep({
    required this.instruction,
    required this.distanceMeters,
    required this.durationSeconds,
    required this.type,
    required this.wayPointIndex,
  });
}

/// Container for route geometry and summary data.
class RouteInfo {
  /// The collection of coordinates that form the road path.
  final List<LatLng> points;
  final double distanceMeters;
  final double durationSeconds;
  final List<NavigationStep> steps;

  const RouteInfo({
    required this.points,
    required this.distanceMeters,
    required this.durationSeconds,
    required this.steps,
  });

  /// Returns the distance formatted for display (e.g. "5.2 km").
  String get distanceLabel =>
      '${(distanceMeters / 1000).toStringAsFixed(1)} km';

  /// Returns the estimated travel time formatted for display (e.g. "12 min").
  String get durationLabel {
    final duration = Duration(seconds: durationSeconds.round());
    if (duration.inHours > 0) {
      final hours = duration.inHours;
      final minutes = duration.inMinutes % 60;
      return '${hours}h ${minutes}m';
    }
    return '${duration.inMinutes} min';
  }
}

/// Fetches road geometry and summary data between two points.
/// 
/// NOTE: OpenRouteService expects coordinates in [Longitude, Latitude] format.
Future<RouteInfo> fetchRouteInfo(LatLng from, LatLng to) async {
  final uri = Uri.parse(
      'https://api.openrouteservice.org/v2/directions/driving-car/geojson',);
      
  final response = await http.post(
    uri,
    headers: {
      'Authorization': _openRouteServiceApiKey,
      'Content-Type': 'application/json',
    },
    body: json.encode({
      'coordinates': [
        // Convert LatLng to [Lon, Lat] for the API
        [from.longitude, from.latitude],
        [to.longitude, to.latitude],
      ],
      'instructions': true, // Enable turn-by-turn instruction steps
      'elevation': false,
    }),
  );

  if (response.statusCode != 200) {
    throw Exception(
        'OpenRouteService returned ${response.statusCode}: ${response.body}',);
  }

  // Parse the GeoJSON response
  final body = json.decode(response.body) as Map<String, dynamic>;
  final features = body['features'] as List<dynamic>?;
  if (features == null || features.isEmpty) {
    throw Exception('OpenRouteService returned no route features.');
  }

  final feature = features.first as Map<String, dynamic>;
  final geometry = feature['geometry'] as Map<String, dynamic>?;
  final coords = geometry?['coordinates'] as List<dynamic>?;
  
  if (coords == null || coords.isEmpty) {
    throw Exception('OpenRouteService returned invalid geometry.');
  }

  // Convert API [Lon, Lat] back to LatLng objects
  final points = coords.map((item) {
    final point = item as List<dynamic>;
    return LatLng((point[1] as num).toDouble(), (point[0] as num).toDouble());
  }).toList();

  // Extract summary stats (distance and duration)
  final properties = feature['properties'] as Map<String, dynamic>?;
  final summary = properties?['summary'] as Map<String, dynamic>?;
  final distance = (summary?['distance'] as num?)?.toDouble() ?? 0.0;
  final duration = (summary?['duration'] as num?)?.toDouble() ?? 0.0;

  // Extract navigation steps
  final List<NavigationStep> steps = [];
  final segments = properties?['segments'] as List<dynamic>?;
  if (segments != null && segments.isNotEmpty) {
    final firstSegment = segments.first as Map<String, dynamic>;
    final apiSteps = firstSegment['steps'] as List<dynamic>?;
    if (apiSteps != null) {
      for (final step in apiSteps) {
        final stepMap = step as Map<String, dynamic>;
        final wayPoints = stepMap['way_points'] as List<dynamic>?;
        final wayPointIndex = (wayPoints != null && wayPoints.length > 1)
            ? (wayPoints[1] as num).toInt()
            : 0;
        steps.add(NavigationStep(
          instruction: stepMap['instruction'] as String? ?? 'Keep straight',
          distanceMeters: (stepMap['distance'] as num?)?.toDouble() ?? 0.0,
          durationSeconds: (stepMap['duration'] as num?)?.toDouble() ?? 0.0,
          type: (stepMap['type'] as num?)?.toInt() ?? 0,
          wayPointIndex: wayPointIndex,
        ),);
      }
    }
  }

  return RouteInfo(
    points: points,
    distanceMeters: distance,
    durationSeconds: duration,
    steps: steps,
  );
}

/// Calculates the job price based on distance and vehicle type.
/// Returns price in Piastres (EGP * 100).
int calculateJobPrice(double distanceMeters, String vehicleType) {
  // Base rates in EGP
  final baseRates = {
    'motorcycle': 20.0,
    'sedan': 40.0,
    'pickup': 60.0,
    'van': 80.0,
    'truck': 120.0,
  };

  // Per km rates in EGP
  final perKmRates = {
    'motorcycle': 5.0,
    'sedan': 10.0,
    'pickup': 15.0,
    'van': 20.0,
    'truck': 30.0,
  };

  final base = baseRates[vehicleType] ?? 40.0;
  final perKm = perKmRates[vehicleType] ?? 10.0;
  final distanceKm = distanceMeters / 1000;

  final totalEgp = base + (distanceKm * perKm);
  
  // Convert to Piastres
  return (totalEgp * 100).round();
}
