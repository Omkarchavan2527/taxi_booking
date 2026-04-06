import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRideStore } from '../../store/useRideStore';

// Fix for default Leaflet marker icons not showing in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// --- INTERNAL HELPERS ---

// 1. This component centers the map when pickup/dropoff changes
const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { duration: 1.5 });
  }, [center, map]);
  return null;
};

// 2. This component handles clicking on the map to set location
const MapEvents = () => {
  const { setPickup, pickup } = useRideStore();
  
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      // Reverse Geocoding: Convert Lat/Lng to a readable address
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        const address = data.display_name || "Selected Location";
        
        // If no pickup is set, set pickup. If pickup exists, maybe set dropoff?
        // For now, let's just update pickup to test connectivity.
        setPickup({ address, lat, lng });
      } catch (err) {
        console.error("Reverse geocoding failed", err);
      }
    },
  });
  return null;
};

// --- MAIN COMPONENT ---

export const MapComponent: React.FC = () => {
  const { pickup, dropoff } = useRideStore();

  // Default center (Pune/Mumbai area or your preferred default)
  const defaultCenter: [number, number] = [18.5204, 73.8567];
  const activeCenter = pickup ? [pickup.lat, pickup.lng] : defaultCenter;

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-inner border border-gray-100">
      <MapContainer 
        center={defaultCenter as any} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Logic Components */}
        <ChangeView center={activeCenter as any} />
        <MapEvents />

        {/* Pickup Marker */}
        {pickup && (
          <Marker position={[pickup.lat, pickup.lng]}>
            <Popup>Pickup: {pickup.address}</Popup>
          </Marker>
        )}

        {/* Dropoff Marker */}
        {dropoff && (
          <Marker position={[dropoff.lat, dropoff.lng]}>
            <Popup>Dropoff: {dropoff.address}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};