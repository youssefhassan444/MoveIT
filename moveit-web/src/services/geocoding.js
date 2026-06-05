export class GeocodingService {
  static async searchAddress(query) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
      );
      if (!response.ok) throw new Error('Geocoding request failed');
      const data = await response.json();
      return data.map(item => ({
        address: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
      }));
    } catch (error) {
      console.error('Search address error:', error);
      return [];
    }
  }

  static async reverseGeocode(lat, lng) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      if (!response.ok) throw new Error('Reverse geocoding request failed');
      const data = await response.json();
      return data.display_name || 'Unknown Location';
    } catch (error) {
      console.error('Reverse geocode error:', error);
      return 'Unknown Location';
    }
  }

  static async getRoute(startLat, startLng, endLat, endLng) {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
      );
      if (!response.ok) throw new Error('Routing request failed');
      const data = await response.json();
      
      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error('No route found');
      }

      const route = data.routes[0];
      return {
        distanceMeters: route.distance,
        durationSeconds: route.duration,
        geometry: route.geometry,
        coordinates: route.geometry.coordinates.map(coord => [coord[1], coord[0]]) // Map geojson [lng, lat] to Leaflet [lat, lng]
      };
    } catch (error) {
      console.error('Get route error:', error);
      throw error;
    }
  }
}
