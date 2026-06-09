import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:latlong2/latlong.dart';

import '../core/errors/app_error.dart';

/// Service responsible for converting addresses to coordinates and vice versa.
/// 
/// Interacts with the OpenStreetMap Nominatim API for geocoding functionality.
class GeocodingService {
  /// Required User-Agent header for Nominatim API compliance.
  static const _userAgent = 'MoveItApp/1.0 (com.moveit.egypt)';

  /// Search addresses using Nominatim — constrained to Egypt.
  /// 
  /// NOTE: Nominatim is free, no API key required. Do not exceed 1 req/sec.
  Future<Result<List<Map<String, dynamic>>, AppError>> search(
      String query,) async {
    try {
      // Build the URL with the query component encoded safely
      final uri = Uri.parse(
        'https://nominatim.openstreetmap.org/search'
        '?q=${Uri.encodeQueryComponent(query)}'
        '&format=json&addressdetails=1&limit=5&countrycodes=eg',
      );
      
      // Perform the HTTP GET request with a timeout
      final response =
          await http.get(uri, headers: {'User-Agent': _userAgent}).timeout(
        const Duration(seconds: 8),
      );

      // Check if the response is successful
      if (response.statusCode == 200) {
        // Decode the JSON list and cast it properly
        final list = json.decode(response.body) as List;
        return Result.success(list.cast<Map<String, dynamic>>());
      }
      return const Result.failure(
          GeocodingError("Couldn't reach search service."),);
    } catch (e) {
      // Catch network or parsing errors
      return Result.failure(GeocodingError(e.toString()));
    }
  }

  /// Reverse geocode a coordinate to a human-readable address string.
  Future<Result<String, AppError>> reverse(LatLng point) async {
    try {
      // Construct the reverse geocoding URL
      final uri = Uri.parse(
        'https://nominatim.openstreetmap.org/reverse'
        '?lat=${point.latitude}&lon=${point.longitude}&format=json',
      );
      
      // Perform the HTTP GET request with a timeout
      final response =
          await http.get(uri, headers: {'User-Agent': _userAgent}).timeout(
        const Duration(seconds: 8),
      );

      // Extract the display name if the request was successful
      if (response.statusCode == 200) {
        final data = json.decode(response.body) as Map<String, dynamic>;
        final address = data['display_name'] as String?;
        // Fallback to coordinate string if address is empty — this is valid
        return Result.success(address ??
            '${point.latitude.toStringAsFixed(5)}, ${point.longitude.toStringAsFixed(5)}',);
      }
      // Non-critical: fall back to coordinates, do not block the flow
      return Result.success(
          '${point.latitude.toStringAsFixed(5)}, ${point.longitude.toStringAsFixed(5)}',);
    } catch (e) {
      // Non-critical — return coordinates as fallback instead of an error
      return Result.success(
          '${point.latitude.toStringAsFixed(5)}, ${point.longitude.toStringAsFixed(5)}',);
    }
  }
}

/// Provider for the [GeocodingService] instance.
final geocodingServiceProvider =
    Provider<GeocodingService>((ref) => GeocodingService());
