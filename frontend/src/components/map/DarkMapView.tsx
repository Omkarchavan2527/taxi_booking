import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { RoutePolyline } from './RoutePolyline';

interface DarkMapViewProps {
  pickup?: [number, number];
  dropoff?: [number, number];
}

export const DarkMapView: React.FC<DarkMapViewProps> = ({ pickup, dropoff }) => {
  const defaultPosition: [number, number] = pickup || [40.7128, -74.0060];

  return (
    <div className="absolute inset-0 z-0 bg-gray-100">
      <MapContainer 
        center={defaultPosition} 
        zoom={14} 
        zoomControl={false} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        
        {pickup && dropoff ? (
          <RoutePolyline pickup={pickup} dropoff={dropoff} />
        ) : (
          /* Route Simulation (SVG Overlay) when no coords provided */
          <div className="absolute inset-0 z-[400] pointer-events-none flex items-center justify-center overflow-hidden">
            <svg width="100%" height="100%" className="opacity-70 drop-shadow-[0_2px_4px_rgba(37,99,235,0.4)]">
              <path 
                d="M 200 800 C 300 600, 100 400, 400 300 S 600 200, 800 100" 
                fill="transparent" 
                stroke="#2563eb" /* Blue-600 */
                strokeWidth="6" 
                strokeLinecap="round"
                className="animate-[dash_3s_linear_infinite]"
                style={{ strokeDasharray: '20, 20' }}
              />
            </svg>
          </div>
        )}
      </MapContainer>
    </div>
  );
};
