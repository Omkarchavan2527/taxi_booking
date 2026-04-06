import React, { useEffect, useState } from 'react';
import { Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

interface RoutePolylineProps {
  pickup: [number, number]; // [lat, lng]
  dropoff: [number, number];
}

export const RoutePolyline: React.FC<RoutePolylineProps> = ({ pickup, dropoff }) => {
  const [routePositions, setRoutePositions] = useState<[number, number][]>([]);
  const map = useMap();

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        // OSRM expects coordinates in [longitude, latitude] format
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickup[1]},${pickup[0]};${dropoff[1]},${dropoff[0]}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          // Convert GeoJSON [lng, lat] back to Leaflet [lat, lng]
          const coordinates = data.routes[0].geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
          );
          setRoutePositions(coordinates);

          // Fit map bounds to show the whole route
          const bounds = L.latLngBounds(coordinates);
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (error) {
        console.error('Failed to fetch route:', error);
      }
    };

    if (pickup && dropoff) {
      fetchRoute();
    }
  }, [pickup, dropoff, map]);

  if (routePositions.length === 0) return null;

  return (
    <Polyline 
      positions={routePositions} 
      pathOptions={{ 
        color: '#2563EB', // Primary Blue
        weight: 6, 
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round'
      }} 
    />
  );
};