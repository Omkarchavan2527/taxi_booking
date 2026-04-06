import React from 'react';
import { MapContainer, TileLayer, ZoomControl, Marker } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export const MapView: React.FC = () => {
  // Default to a central location (e.g., New York, or user's geolocated position)
  const defaultPosition: [number, number] = [40.7128, -74.0060];

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer 
        center={defaultPosition} 
        zoom={14} 
        zoomControl={false} // We will use custom placement
        className="w-full h-full"
      >
        {/* CartoDB Positron (Light) Tiles - Free, No API Key */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />
        
        {/* Default Zoom Control positioned at bottom right */}
        <ZoomControl position="bottomright" />
        
        {/* Example Driver Marker (We will make this dynamic later via Socket.io) */}
        <Marker position={[40.7150, -74.0100]} />
      </MapContainer>
    </div>
  );
};