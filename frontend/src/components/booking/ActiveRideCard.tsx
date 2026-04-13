import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Timer, MessageSquare, Phone, Zap, Wind, Star } from 'lucide-react';
import { Button } from '../common/Button';

// 1. Define the Props interface to accept the real driver data
interface ActiveRideCardProps {
  driver?: any;
  isConfirmed?: boolean;
  otp?: string;
}

export const ActiveRideCard: React.FC<ActiveRideCardProps> = ({ driver, isConfirmed = false, otp }) => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // GSAP: Cards slide up from bottom with stagger
    // We re-run this when the driver data arrives to give it a fresh "pop"
    gsap.fromTo(cardsRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, ease: 'power3.out', duration: 0.6, delay: 0.2 }
    );
  }, [driver]); // Re-animate when driver is assigned

  // 2. CONFIRMATION STATE: Booking confirmed but driver details loading
  if (isConfirmed && !driver) {
    return (
      <div className="w-full max-w-md mx-auto pointer-events-auto space-y-3 pb-6 md:pb-8">
        <div className="bg-white rounded-3xl p-8 shadow-float text-center border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-bold text-2xl text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-sm text-gray-500">A driver is on the way to pick you up.</p>
          <p className="text-xs text-gray-400 mt-4 animate-pulse">Loading driver details...</p>
        </div>

        {otp && (
          <div className="status-card bg-gray-900 rounded-3xl p-5 shadow-float flex items-center justify-between border border-gray-800">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Ride PIN</p>
              <p className="text-xs text-gray-400">Share this with driver to start</p>
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-xl">
              <h2 className="font-bold text-2xl text-white tracking-widest">{otp}</h2>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. LOADING STATE: If no driver is assigned yet and not confirmed
  if (!driver) {
    return (
      <div className="w-full max-w-md mx-auto pointer-events-auto space-y-3 pb-6 md:pb-8">
        <div className="bg-white rounded-3xl p-8 shadow-float text-center border border-gray-100">
          <div className="w-12 h-12 border-4 border-gray-100 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="font-bold text-xl text-gray-900">Finding your driver...</h2>
          <p className="text-sm text-gray-500 mt-2">Connecting you to the nearest Kinetic partner.</p>
        </div>

        {otp && (
          <div className="status-card bg-gray-900 rounded-3xl p-5 shadow-float flex items-center justify-between border border-gray-800">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Ride PIN</p>
              <p className="text-xs text-gray-400">Share this with driver to start</p>
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-xl">
              <h2 className="font-bold text-2xl text-white tracking-widest">{otp}</h2>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. ACTIVE STATE: Real Data Extraction
  const driverName = driver.name || "Alex Driver";
  const carModel = driver.vehicle?.model || "Tesla Model 3";
  const plate = driver.vehicle?.licensePlate || "XYZ-1234";
  const rating = driver.rating || "4.9";
  const trips = driver.totalRides || "2,450";

  return (
    <div className="w-full max-w-md mx-auto pointer-events-auto space-y-3 pb-6 md:pb-8">
      
      {/* 1. Status Banner Card */}
      <div 
        ref={el => cardsRef.current[0] = el}
        className="status-card bg-white rounded-3xl p-5 shadow-float flex items-center justify-between border border-gray-50"
      >
        <div>
          <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-1">Driver Assigned</p>
          <h2 className="font-bold text-2xl text-gray-900 tracking-tight">Arriving in 3 mins</h2>
        </div>
        <button className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 shadow-sm">
          <Timer size={24} />
        </button>
      </div>

      {/* 2. Driver & Vehicle Info Card */}
      <div 
        ref={el => cardsRef.current[1] = el}
        className="status-card bg-white rounded-3xl p-5 shadow-float border border-gray-50"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm mr-4">
              <img 
                src={`https://ui-avatars.com/api/?name=${driverName}&background=random`} 
                alt={driverName} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900">{driverName}</h3>
              <p className="text-xs font-semibold text-gray-500 flex items-center">
                <Star size={12} className="text-yellow-400 fill-yellow-400 mr-1" /> {rating} · {trips} trips
              </p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="font-bold text-xl text-gray-900 tracking-wider">{plate}</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{carModel}</p>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex gap-2 mb-5">
          <span className="flex items-center text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-primary px-3 py-1.5 rounded-full">
            <Zap size={12} className="mr-1.5" /> Electric
          </span>
          <span className="flex items-center text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full border border-gray-100">
            <Wind size={12} className="mr-1.5" /> Climate Control
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="social" className="flex-1 py-3.5 rounded-2xl bg-gray-50 border-none hover:bg-gray-100">
            <MessageSquare size={18} className="text-gray-700" />
            <span className="ml-2 text-gray-700 font-bold">Message</span>
          </Button>
          <Button className="flex-1 py-3.5 rounded-2xl shadow-md">
            <Phone size={18} className="text-white" />
            <span className="ml-2 text-white font-bold">Call Driver</span>
          </Button>
        </div>
      </div>

      {/* 3. Trip Details Row Card */}
      <div 
        ref={el => cardsRef.current[2] = el}
        className="status-card bg-white rounded-3xl p-5 shadow-float grid grid-cols-3 divide-x divide-gray-100 border border-gray-50"
      >
        <div className="text-center px-2">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ride Type</p>
          <p className="text-sm font-bold text-gray-900">Kinetic Luxe</p>
        </div>
        <div className="text-center px-2">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Fare</p>
          <p className="text-sm font-bold text-gray-900">$24.50</p>
        </div>
        <div className="text-center px-2">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment</p>
          <p className="text-sm font-bold text-gray-900">💳 Card</p>
        </div>
      </div>

      {/* 4. OTP Row */}
      {otp && (
        <div 
          ref={el => cardsRef.current[3] = el}
          className="status-card bg-gray-900 rounded-3xl p-5 shadow-float flex items-center justify-between border border-gray-800"
        >
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Ride PIN</p>
            <p className="text-xs text-gray-400">Share this with driver to start</p>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-xl">
            <h2 className="font-bold text-2xl text-white tracking-widest">{otp}</h2>
          </div>
        </div>
      )}

    </div>
  );
};
