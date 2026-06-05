export class MapWidget {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.map = null;
    this.markers = {};
    this.polyline = null;
    this.defaultCenter = options.center || [30.0444, 31.2357]; // Cairo default
    this.defaultZoom = options.zoom || 13;
    this.isInteractive = options.interactive !== false;
    this.onClick = options.onClick || null;
  }

  async init() {
    // Wait for Leaflet to load if it hasn't
    if (!window.L) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    this.map = L.map(this.containerId, {
      zoomControl: this.isInteractive,
      dragging: this.isInteractive,
      scrollWheelZoom: this.isInteractive,
      doubleClickZoom: this.isInteractive,
    }).setView(this.defaultCenter, this.defaultZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    if (this.onClick) {
      this.map.on('click', (e) => this.onClick(e.latlng.lat, e.latlng.lng));
    }

    // Custom icons matching app theme
    this.icons = {
      pickup: L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:#2E7D32;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      }),
      dropoff: L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:#D32F2F;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      }),
      driver: L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:#F79529;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
    };
  }

  setMarker(id, lat, lng, type = 'pickup', popupText = null) {
    if (!this.map) return;
    
    if (this.markers[id]) {
      this.markers[id].setLatLng([lat, lng]);
      if (popupText) this.markers[id].setPopupContent(popupText);
    } else {
      const marker = L.marker([lat, lng], { icon: this.icons[type] || this.icons.pickup }).addTo(this.map);
      if (popupText) marker.bindPopup(popupText);
      this.markers[id] = marker;
    }
  }

  removeMarker(id) {
    if (this.markers[id]) {
      this.map.removeLayer(this.markers[id]);
      delete this.markers[id];
    }
  }

  drawRoute(coordinates) {
    if (!this.map) return;
    
    if (this.polyline) {
      this.map.removeLayer(this.polyline);
    }

    this.polyline = L.polyline(coordinates, {
      color: '#F79529',
      weight: 4,
      opacity: 0.8,
      dashArray: '8, 8'
    }).addTo(this.map);
  }

  fitBoundsToRoute() {
    if (this.polyline && this.map) {
      this.map.fitBounds(this.polyline.getBounds(), { padding: [50, 50] });
    }
  }

  fitBoundsToMarkers() {
    if (!this.map) return;
    const group = new L.featureGroup(Object.values(this.markers));
    if (group.getLayers().length > 0) {
      this.map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 16 });
    }
  }

  centerOn(lat, lng, zoom = 15) {
    if (this.map) {
      this.map.setView([lat, lng], zoom);
    }
  }

  destroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
