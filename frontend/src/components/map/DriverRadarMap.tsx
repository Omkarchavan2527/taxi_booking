import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import gsap from 'gsap';

// Custom Driver Marker (Green Dot + Radar Ring)
const driverIcon = L.divIcon({
  className: 'custom-driver-marker',
  html: `
    <div class="relative flex items-center justify-center w-6 h-6">
      <div class="absolute inset-0 bg-driver rounded-full radar-ring"></div>
      <div class="w-4 h-4 bg-driver rounded-full shadow-[0_0_10px_#22C55E] z-10 border-2 border-white"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Custom Rider/User Marker (Amber/Yellow)
const userIcon = L.divIcon({
  className: 'custom-user-marker',
  html: `
    <div class="w-5 h-5 bg-yellow-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
      <div class="w-2 h-2 bg-white rounded-full"></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

export const DriverRadarMap: React.FC = () => {
  const driverPosition: [number, number] = [40.7128, -74.0060];
  
  // Dummy users scattered around the driver
  const nearbyUsers: [number, number][] = [
    [40.7140, -74.0080],
    [40.7110, -74.0040],
    [40.7135, -74.0020],
  ];

  useEffect(() => {
    // GSAP: Continuous pulsing radar ring for the driver marker
    gsap.to('.radar-ring', {
      scale: 2.5,
      opacity: 0,
      duration: 2,
      repeat: -1,
      ease: 'power2.out'
    });
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-gray-100">
      <MapContainer 
        center={driverPosition} 
        zoom={15} 
        zoomControl={false} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        
        {/* Driver Location */}
        <Marker position={driverPosition} icon={driverIcon} />

        {/* Nearby Users */}
        {nearbyUsers.map((pos, idx) => (
          <Marker key={idx} position={pos} icon={userIcon} />
        ))}
      </MapContainer>
    </div>
  );
};
