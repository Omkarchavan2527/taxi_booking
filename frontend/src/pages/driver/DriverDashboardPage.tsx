import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { DriverSidebar } from '../../components/driver/DriverSidebar';
import { DriverRadarMap } from '../../components/map/DriverRadarMap';
import { RideRequestModal } from '../../components/driver/RideRequestModal';
import { Button } from '../../components/common/Button';
import { useRideStore } from '../../store/useRideStore';
import api from '../../services/api';

export const DriverDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { acceptRide } = useRideStore();
  const [incomingRide, setIncomingRide] = useState<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize socket connection once per component mount
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
    }

    const socket = socketRef.current;
    
    // Listen for REAL requests from the backend
    socket.on('ride:new-request', (data) => {
      console.log("SOCKET: New request received", data);
      setIncomingRide(data);
    });

    return () => {
      socket.off('ride:new-request');
    };
  }, []);

  const handleAccept = async () => {
    if (!incomingRide) return;
    
    setIsLoading(true);
    try {
      await acceptRide(incomingRide.rideId);
      
      console.log("Success: Ride claimed.");
      setIncomingRide(null);
      navigate('/driver/navigation');
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to accept ride';
      console.error('Accept ride error:', error);
      alert(`Error: ${msg}`);
      setIncomingRide(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = () => {
    setIncomingRide(null);
  };

  const handleSimulateRequest = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/rides/pending');
      const pendingRides = response.data;

      if (!Array.isArray(pendingRides) || pendingRides.length === 0) {
        alert('No pending ride requests found in the database.');
        return;
      }

      const ride = pendingRides[0];
      setIncomingRide({
        rideId: ride._id,
        pickup: ride.pickup,
        dropoff: ride.dropoff,
        estimatedFare: ride.estimatedFare,
        vehicleType: ride.vehicleType,
        user: ride.user || { name: 'Passenger' }
      });
    } catch (error: any) {
      console.error('Failed to load pending ride:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load pending ride';
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#0F1117]">
      <DriverSidebar />

      <main className="flex-1 relative">
        <DriverRadarMap />

        {/* Bottom Floating Stats Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full max-w-3xl px-6">
          <div className="bg-[#1A1D27]/90 backdrop-blur-xl border border-[#2A2D3A] rounded-2xl p-4 pointer-events-auto shadow-2xl flex items-center justify-between">
            
            <div className="flex items-center divide-x divide-[#2A2D3A]">
              <div className="px-6 text-center">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Today's Trips</p>
                <p className="text-lg font-bold text-white">8</p>
              </div>
              <div className="px-6 text-center">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Earnings</p>
                <p className="text-lg font-bold text-driver">$142.50</p>
              </div>
            </div>

            {/* FIXED SIMULATION BUTTON */}
            <Button 
              variant="driver" 
              className="ml-4 rounded-xl px-6"
              onClick={handleSimulateRequest}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Simulate Request'}
            </Button>

          </div>
        </div>

        {incomingRide && (
          <RideRequestModal 
            onAccept={handleAccept} 
            onDecline={handleDecline} 
            rideData={incomingRide}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
};