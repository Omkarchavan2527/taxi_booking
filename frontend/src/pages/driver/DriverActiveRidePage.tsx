import React, { useState, useEffect } from 'react';
import { CornerUpRight, LocateFixed, Layers, MessageSquare, Phone, CheckCircle, CreditCard, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { DarkMapView } from '../../components/map/DarkMapView';
import { SwipeButton } from '../../components/common/SwipeButton';
import { useRideStore } from '../../store/useRideStore';
import { useGeolocation } from '../../hooks/useGeolocation';
import { calculateDistance } from '../../utils/geocoding';

// Initialize Socket Connection
const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');

export const DriverActiveRidePage: React.FC = () => {
  const navigate = useNavigate();
  const [rideCompleted, setRideCompleted] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const { currentRide, clearRide, completeRide } = useRideStore();
  const { location, startTracking, stopTracking } = useGeolocation();
  const [isAtDestination, setIsAtDestination] = useState(false);

  const passengerName = currentRide?.user?.name || 'Julian Vane';
  const passengerRating = currentRide?.user?.rating || '4.98';
  const pickupAddress = currentRide?.pickup?.address || '100 Market St';
  const dropoffAddress = currentRide?.dropoff?.address || 'SFO International Airport';
  const passengerAvatar = currentRide?.user?.avatar || 'https://i.pravatar.cc/150?img=68';

  useEffect(() => {
    startTracking();
    return () => stopTracking();
  }, [startTracking, stopTracking]);

  useEffect(() => {
    if (location && currentRide?.dropoff?.lat) {
      const dist = calculateDistance(
        location.lat,
        location.lng,
        currentRide.dropoff.lat,
        currentRide.dropoff.lng
      );
      // Assume less than 100 meters (0.1 km) is "at destination"
      if (dist < 0.1) {
        setIsAtDestination(true);
      } else {
        setIsAtDestination(false);
      }
    }
  }, [location, currentRide]);

  const handleSwipeComplete = async () => {
    console.log("Ride Completed!");
    
    try {
      if (currentRide?._id) {
        await completeRide(currentRide._id);
      }
      setRideCompleted(true);
      setShowCompletionPopup(true);
    } catch (error) {
      console.error("Failed to complete ride:", error);
      alert("Error completing ride. Please try again.");
    }
  };

  const handleFinish = (method: 'online' | 'cash') => {
    console.log(`Payment confirmed via: ${method}`);
    clearRide();
    navigate('/driver/dashboard');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-[#0F1117]">
      
      {/* Map Layer showing route from Pickup to Dropoff */}
      <DarkMapView 
        pickup={currentRide?.pickup?.lat ? [currentRide.pickup.lat, currentRide.pickup.lng] : undefined}
        dropoff={currentRide?.dropoff?.lat ? [currentRide.dropoff.lat, currentRide.dropoff.lng] : undefined}
      />

      {/* Completion Popup Overlay */}
      {showCompletionPopup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ride Completed!</h2>
            <p className="text-gray-500 mb-6">You've successfully dropped off {passengerName} at their destination.</p>
            
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Earnings</p>
              <p className="text-3xl font-bold text-driver">${currentRide?.estimatedFare || '24.50'}</p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => handleFinish('online')}
                className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors hover:bg-blue-700"
              >
                <CreditCard size={20} />
                Online Payment
              </button>
              <button 
                onClick={() => handleFinish('cash')}
                className="w-full bg-white text-gray-900 border border-gray-200 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors hover:bg-gray-50"
              >
                <Banknote size={20} className="text-green-600" />
                Collect Cash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none p-4 md:p-6 flex flex-col justify-between">
        
        {/* Top Section */}
        <div className="flex justify-between items-start pointer-events-none">
          
          {/* Top-Left: Turn-by-Turn Navigation Card */}
          <div className="bg-white rounded-2xl p-4 shadow-xl pointer-events-auto flex items-center max-w-xs border border-gray-100">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
              <CornerUpRight size={28} className="text-primary stroke-[2.5]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Dropoff in</p>
              <p className="text-xl font-bold text-gray-900 leading-none">12 min</p>
              <p className="text-sm font-semibold text-gray-500 mt-1">{dropoffAddress.split(',')[0]}</p>
            </div>
          </div>

          {/* Top-Right: Map Controls */}
          <div className="flex flex-col gap-3 pointer-events-auto">
            <button className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-600 shadow-md hover:bg-gray-50 transition-colors">
              <LocateFixed size={20} />
            </button>
            <button className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-600 shadow-md hover:bg-gray-50 transition-colors">
              <Layers size={20} />
            </button>
          </div>
        </div>

        {/* Bottom Section: Passenger Floating Card */}
        <div className="w-full max-w-md mx-auto pointer-events-auto mb-4">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-white/20">
            
            {/* Passenger Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden mr-4 border border-gray-100">
                   <img src={passengerAvatar} alt={passengerName} />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-gray-900">{passengerName}</h2>
                  <p className="text-[10px] font-bold text-green-500 uppercase tracking-wider mt-1">
                    🟢 EN ROUTE
                  </p>
                </div>
              </div>
              
              {/* Action Icons */}
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary transition-colors hover:bg-blue-100">
                  <MessageSquare size={16} />
                </button>
                <button className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary transition-colors hover:bg-blue-100">
                  <Phone size={16} />
                </button>
              </div>
            </div>

            {/* Route Details */}
            <div className="relative mb-6 pl-2">
              <div className="absolute left-[13px] top-[14px] bottom-[14px] w-0.5 bg-gray-200"></div>
              
              <div className="flex items-start mb-4 relative z-10 opacity-50">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400 mt-1 shadow-[0_0_0_4px_white]"></div>
                <div className="ml-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Picked Up</p>
                  <p className="text-sm font-semibold text-gray-900">{pickupAddress}</p>
                </div>
              </div>

              <div className="flex items-start relative z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1 shadow-[0_0_0_4px_white]"></div>
                <div className="ml-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Destination</p>
                  <p className="text-sm font-semibold text-gray-900">{dropoffAddress}</p>
                </div>
              </div>
            </div>

            {/* Swipe Action Row */}
            {!showCompletionPopup && (
              <div className="flex flex-col gap-4 items-center">
                {isAtDestination ? (
                  <SwipeButton 
                    text={rideCompleted ? "Completed!" : "Swipe to Complete Ride"}
                    onComplete={handleSwipeComplete} 
                  />
                ) : (
                  <div className="w-full bg-gray-100 rounded-2xl py-4 text-center border border-gray-200">
                    <p className="text-gray-500 font-bold text-sm">Drive to destination to complete</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
