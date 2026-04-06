import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';

export const DarkMapView: React.FC = () => {
  const defaultPosition: [number, number] = [40.7128, -74.0060];

  return (
    <div className="absolute inset-0 z-0 bg-[#0F1117]">
      <MapContainer 
        center={defaultPosition} 
        zoom={14} 
        zoomControl={false} 
        className="w-full h-full"
      >
        {/* CartoDB Dark Matter Tiles */}
        <TileLayer
          attribution='&copy; OpenStreetMap &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />
        
        {/* Glowing Neon Route Simulation (SVG Overlay) */}
        <div className="absolute inset-0 z-[400] pointer-events-none flex items-center justify-center overflow-hidden">
          <svg width="100%" height="100%" className="opacity-80 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
            <path 
              d="M 200 800 C 300 600, 100 400, 400 300 S 600 200, 800 100" 
              fill="transparent" 
              stroke="#06b6d4" /* Cyan-500 */
              strokeWidth="6" 
              strokeLinecap="round"
              className="animate-[dash_3s_linear_infinite]"
              style={{ strokeDasharray: '20, 20' }}
            />
          </svg>
        </div>
      </MapContainer>
    </div>
  );
};