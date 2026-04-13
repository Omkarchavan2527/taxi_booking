import React, { useEffect, useState } from 'react';
import { Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

interface RoutePolylineProps {
  pickup: [number, number]; // [lat, lng]
  dropoff: [number, number];
}

export const RoutePolyline: React.FC<RoutePolylineProps> = ({ pickup, dropoff }) => {
  const [routePositions, setRoutePositions] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [isError, setIsError] = useState(false);
  const map = useMap();

  useEffect(() => {
    let cancelled = false;
    const fetchRoute = async () => {
      try {
        setIsError(false);
        // OSRM expects coordinates in [longitude, latitude] format
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickup[1]},${pickup[0]};${dropoff[1]},${dropoff[0]}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (cancelled) return;

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          
          if (route.distance > 150000) {
            // Over 150 km — show dashed line
            setRoutePositions([]);
            setDistance(route.distance);
          } else {
            // Convert GeoJSON [lng, lat] back to Leaflet [lat, lng]
            const coordinates = route.geometry.coordinates.map(
              (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
            );
            setRoutePositions(coordinates);
            setDistance(route.distance);

            // Fit map bounds to show the whole route
            const bounds = L.latLngBounds(coordinates);
            map.fitBounds(bounds, { padding: [40, 40] });
          }
        } else {
            setIsError(true);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch route:', error);
          setIsError(true);
        }
      }
    };

    if (pickup && dropoff) {
      fetchRoute();
    }
    
    return () => {
      cancelled = true;
    };
  }, [pickup, dropoff, map]);

  // Use dashed fallback if route is too long or failed
  const showFallback = routePositions.length === 0 || distance === null || distance > 150000 || isError;

  useEffect(() => {
    // Only fit bounds for fallback if we decide to show it, and the component is mounted
    if (showFallback && pickup && dropoff && map) {
      map.fitBounds([pickup, dropoff], { padding: [50, 50] });
    }
  }, [showFallback, pickup, dropoff, map]);

  if (showFallback) {
    if (!pickup || !dropoff) return null;
    return (
      <Polyline 
        positions={[pickup, dropoff]}
        pathOptions={{ 
          color: "#F97316", 
          weight: 3, 
          dashArray: "8 6", 
          opacity: 0.8 
        }} 
      />
    );
  }

  return (
    <>
      {/* Casing line behind */}
      <Polyline 
        positions={routePositions} 
        pathOptions={{ 
          color: '#C2410C',
          weight: 7, 
          opacity: 0.4,
          lineJoin: 'round',
          lineCap: 'round'
        }} 
      />
      {/* Main line on top */}
      <Polyline 
        positions={routePositions} 
        pathOptions={{ 
          color: '#F97316',
          weight: 5, 
          opacity: 0.9,
          lineJoin: 'round',
          lineCap: 'round'
        }} 
      />
    </>
  );
};
