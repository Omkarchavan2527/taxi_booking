import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { DarkMapView } from '../../components/map/DarkMapView';
import { ActiveRideCard } from '../../components/booking/ActiveRideCard';
import { useRideStore } from '../../store/useRideStore';

// 1. Initialize Socket Connection
const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');

export const ActiveRidePage: React.FC = () => {
  const navigate = useNavigate();
  const { rideId } = useParams(); // Grabs the ID from the URL (e.g. /rider/active/123)
  const { currentRide } = useRideStore();
  
  // 2. Local state to store the driver info once they accept
  const [driverData, setDriverData] = useState<any>(null);
  const [rideConfirmed, setRideConfirmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showNotifyMessage, setShowNotifyMessage] = useState(false);

  useEffect(() => {
    // Use either the URL param or the store ID
    const targetId = rideId || currentRide?._id;
    if (!targetId) return;

    console.log("Listening for driver acceptance on ride:", targetId);

    // 3. Listen for the specific 'ride:accepted' event for THIS ride
    const eventName = `ride:accepted:${targetId}`;
    
    socket.on(eventName, (data) => {
      console.log("MATCH FOUND! Driver Details:", data.driver);
      setRideConfirmed(true); // Show confirmation first
      setTimeout(() => {
        setDriverData(data.driver); // Then show driver details after a brief delay
      }, 800);
    });

    return () => {
      socket.off(eventName);
    };
  }, [rideId, currentRide?._id]);

  useEffect(() => {
    if (driverData || rideConfirmed) {
      setShowNotifyMessage(false);
      setTimeLeft(0);
      return;
    }

    setTimeLeft(60);
    setShowNotifyMessage(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowNotifyMessage(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [driverData, rideConfirmed]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-gray-900">
      
      {/* Dark Map Layer */}
      <DarkMapView />

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none p-4 md:p-6">
        
        {/* Top Header Layer */}
        <div className="flex justify-between items-start pointer-events-none">
          <div className="bg-white rounded-xl px-4 py-3 shadow-md pointer-events-auto flex items-center border border-gray-100">
            <div className={`w-2 h-2 rounded-full ${driverData ? 'bg-green-500' : rideConfirmed ? 'bg-yellow-500' : 'bg-primary animate-pulse'} mr-3`}></div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Status</p>
              <p className="text-sm font-bold text-gray-900 leading-none">
                {driverData ? 'Driver Arriving' : rideConfirmed ? 'Booking Confirmed! 🎉' : 'Finding Driver'}
              </p>
              {!driverData && !rideConfirmed && (
                <p className="text-[10px] text-gray-500 mt-1">Searching for a match... {timeLeft}s</p>
              )}
              {rideConfirmed && !driverData && (
                <p className="text-[10px] text-yellow-600 mt-1">Driver details loading...</p>
              )}
            </div>
          </div>

          <button 
            onClick={() => navigate('/rider/home')}
            className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-900 shadow-md hover:bg-gray-50 transition-colors pointer-events-auto"
          >
            <X size={24} />
          </button>
        </div>

        {/* 4. PASS THE REAL DRIVER DATA TO THE CARD */}
        {/* We pass driverData as a prop to your ActiveRideCard */}
        {showNotifyMessage && !driverData && (
          <div className="mb-4 rounded-3xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-900 shadow-sm pointer-events-auto">
            <p className="font-semibold">Still searching for a driver...</p>
            <p className="text-sm text-yellow-900/90 mt-1">
              We haven't matched your ride yet. If a driver accepts, we’ll notify you immediately.
            </p>
          </div>
        )}
        <div className="pointer-events-auto">
           <ActiveRideCard driver={driverData} isConfirmed={rideConfirmed} />
        </div>

      </div>
    </div>
  );
};