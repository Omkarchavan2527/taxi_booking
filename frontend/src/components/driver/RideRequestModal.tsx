import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Clock, MessageSquare } from 'lucide-react';
import { Button } from '../common/Button';

// 1. Updated interface to include rideData and isLoading (fixes the TS error)
interface RideRequestModalProps {
  onAccept: () => void;
  onDecline: () => void;
  rideData?: any;
  isLoading?: boolean;
}

export const RideRequestModal: React.FC<RideRequestModalProps> = ({ 
  onAccept, 
  onDecline, 
  rideData,
  isLoading = false
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  
  // Dynamic Data Extraction (using fallbacks for safety)
  const fare = rideData?.estimatedFare ?? rideData?.fare ?? "42.50";
  const pickupAddr = rideData?.pickup?.address || rideData?.pickupLocation || "100 Market St";
  const dropoffAddr = rideData?.dropoff?.address || rideData?.dropLocation || "SFO International Airport";
  const vehicleType = rideData?.vehicleType || "Kinetic Luxe";
  // Assuming distance comes from backend, otherwise showing a default
  const distance = rideData?.distance || "14.2 mi"; 

  // SVG Circle math for the countdown timer
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 15) * circumference;

  useEffect(() => {
    // GSAP: Modal scales in with a springy ease
    if (modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }

    // 15-second countdown timer logic
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDecline(); // Auto-dismiss and decline if it hits 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onDecline]);

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-3xl shadow-2xl p-6 min-w-[400px] w-full max-w-md border border-gray-100"
      >
        {/* Header Row */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center mb-1">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></div>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Active Request</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">New Request</h2>
            <p className="text-sm font-semibold text-primary">{vehicleType}</p>
          </div>

          {/* SVG Circular Timer */}
          <div className="relative flex items-center justify-center w-12 h-12">
            <svg className="absolute inset-0 transform -rotate-90 w-12 h-12">
              <circle
                cx="24" cy="24" r={radius}
                stroke="#FFF7ED" strokeWidth="4" fill="none"
              />
              <circle
                cx="24" cy="24" r={radius}
                stroke="#F97316" strokeWidth="4" fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                  transition: 'stroke-dashoffset 1s linear'
                }}
              />
            </svg>
            <Clock size={16} className="text-orange-500 absolute" />
            <span className="absolute -bottom-5 text-[10px] font-bold text-orange-500">{timeLeft}s</span>
          </div>
        </div>

        {/* Route Details (Dynamic) */}
        <div className="relative mb-6 bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <div className="absolute left-[27px] top-[34px] bottom-[34px] w-0.5 bg-gray-200"></div>
          
          <div className="flex items-start mb-4 relative z-10">
            <div className="w-3 h-3 rounded-full bg-primary mt-0.5 shadow-[0_0_0_4px_#F9FAFB]"></div>
            <div className="ml-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Pickup</p>
              <p className="text-sm font-bold text-gray-900 truncate max-w-[280px]">{pickupAddr}</p>
            </div>
          </div>

          <div className="flex items-start relative z-10">
            <div className="w-3 h-3 rounded-full bg-gray-400 mt-0.5 shadow-[0_0_0_4px_#F9FAFB]"></div>
            <div className="ml-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Drop-off</p>
              <p className="text-sm font-bold text-gray-900 truncate max-w-[280px]">{dropoffAddr}</p>
            </div>
          </div>
        </div>

        {/* Stats Row (Dynamic) */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Distance</p>
            <p className="text-2xl font-bold text-primary">{distance}</p>
          </div>
          <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Est. Fare</p>
            <p className="text-2xl font-bold text-primary">${fare}</p>
          </div>
        </div>

        {/* Passenger Info */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                {/* You can pass a real image from rideData later */}
                <img src={`https://ui-avatars.com/api/?name=${rideData?.user?.name || 'User'}&background=random`} alt="Passenger" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">
                {rideData?.user?.name || "Sarah J."} 
                <span className="text-gray-500 font-normal ml-1">{rideData?.user?.rating || "4.9"} ⭐</span>
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Passenger</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
            <MessageSquare size={16} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button 
            onClick={onDecline} 
            variant="social" 
            className="w-1/3 rounded-xl bg-gray-100 border-none hover:bg-gray-200 font-bold text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? '...' : 'Decline'}
          </Button>
          <Button 
            onClick={onAccept} 
            className="w-2/3 rounded-xl font-bold text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={isLoading}
          >
            {isLoading ? 'Accepting...' : 'Accept Ride'}
          </Button>
        </div>

      </div>
    </div>
  );
};