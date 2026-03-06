import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// This is a dynamic import wrapper to avoid SSR issues with Leaflet
export default function MapComponent({ 
  driverPos = [-15.6010, -56.0974], // Default to somewhere in Cuiabá
  customerPos = [-15.5960, -56.0966],
  restaurantPos = [-15.6030, -56.0980]
}: { 
  driverPos?: [number, number],
  customerPos?: [number, number],
  restaurantPos?: [number, number]
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Dynamic import to prevent SSR issues
    let L: any;
    let routingControl: any;
    
    const initMap = async () => {
      try {
        L = (await import("leaflet")).default;
        
        // Fix Leaflet marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        // Custom icons
        const driverIcon = L.divIcon({
          html: `<div style="background-color: #FFCC00; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;"><span style="color: black; font-size: 14px;">🛵</span></div>`,
          className: 'custom-div-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const restaurantIcon = L.divIcon({
          html: `<div style="background-color: #FF5555; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 14px;">🏪</span></div>`,
          className: 'custom-div-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const customerIcon = L.divIcon({
          html: `<div style="background-color: #5555FF; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 14px;">📍</span></div>`,
          className: 'custom-div-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        if (!mapRef.current) return;
        
        // Initialize map if it doesn't exist
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = L.map(mapRef.current, {
             zoomControl: false // Hide default zoom
          }).setView(driverPos, 14);

          // Dark theme map tiles
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
          }).addTo(mapInstanceRef.current);
        }

        const map = mapInstanceRef.current;

        // Clear existing markers
        map.eachLayer((layer: any) => {
          if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
          }
        });

        // Add markers
        const driverMarker = L.marker(driverPos, { icon: driverIcon }).addTo(map).bindPopup("Você está aqui");
        const restaurantMarker = L.marker(restaurantPos, { icon: restaurantIcon }).addTo(map).bindPopup("Restaurante");
        const customerMarker = L.marker(customerPos, { icon: customerIcon }).addTo(map).bindPopup("Cliente");

        // Simple straight line routing for mock purposes
        // In a real app, you would use a routing service like OSRM or Mapbox
        const latlngs = [driverPos, restaurantPos, customerPos];
        const polyline = L.polyline(latlngs, {
            color: '#FFCC00', 
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10' // dashed line
        }).addTo(map);

        // Fit bounds to show all markers
        const group = new L.featureGroup([driverMarker, restaurantMarker, customerMarker]);
        map.fitBounds(group.getBounds(), { padding: [30, 30] });

      } catch (error) {
        console.error("Error loading Leaflet:", error);
      }
    };

    initMap();

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [driverPos, customerPos, restaurantPos]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />;
}
