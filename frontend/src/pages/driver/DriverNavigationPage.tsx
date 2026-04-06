import React, { useState } from 'react';
import { CornerUpRight, LocateFixed, Layers, MessageSquare, Phone } from 'lucide-react';
import { DarkMapView } from '../../components/map/DarkMapView';
import { SwipeButton } from '../../components/common/SwipeButton';
import { useRideStore } from '../../store/useRideStore';

export const DriverNavigationPage: React.FC = () => {
  const [rideStarted, setRideStarted] = useState(false);
  const { currentRide } = useRideStore();

  const passengerName = currentRide?.user?.name || 'Julian Vane';
  const passengerRating = currentRide?.user?.rating || '4.98';
  const pickupAddress = currentRide?.pickup?.address || '100 Market St';
  const dropoffAddress = currentRide?.dropoff?.address || 'SFO International Airport';
  const passengerAvatar = currentRide?.user?.avatar || 'https://i.pravatar.cc/150?img=68';

  const handleSwipeComplete = () => {
    console.log("Ride Started!");
    setRideStarted(true);
    // You could trigger a socket event here: socket.emit('driver:start-ride', { rideId })
    // and route to the active driving view.
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-[#0F1117]">
      
      {/* Map Layer (Reusing DarkMapView, but imagine it passing a thick blue polyline) */}
      <DarkMapView />

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
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Next Turn</p>
              <p className="text-xl font-bold text-gray-900 leading-none">400m</p>
              <p className="text-sm font-semibold text-gray-500 mt-1">Market St</p>
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
                  <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mt-1">
                    ★ {passengerRating} Preferred Rider
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
              
              <div className="flex items-start mb-4 relative z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400 mt-1 shadow-[0_0_0_4px_white]"></div>
                <div className="ml-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Pickup</p>
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
            <div className="flex flex-col gap-4 items-center">
              <SwipeButton 
                text={rideStarted ? "Ride in Progress" : "Swipe to Start Ride"}
                onComplete={handleSwipeComplete} 
              />
              {!rideStarted && (
                <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">
                  Cancel Ride
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};