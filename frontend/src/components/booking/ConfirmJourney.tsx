import React, { useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Pencil, Check, CreditCard } from 'lucide-react';
import { Button } from '../common/Button';
import { useRideStore,type VehicleType } from '../../store/useRideStore';

// --- HELPER: Calculate Distance in km (Haversine Formula) ---
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; 
};

// Base Vehicle Data (Prices will be calculated dynamically)
const VEHICLES_BASE = [
  { id: 'STANDARD' as VehicleType, name: 'Economy', desc: 'Kinetic Lite · 4 seats', eta: '3 min away', multiplier: 1, img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=150&h=100' },
  { id: 'ELECTRIC' as VehicleType, name: 'Premium', desc: 'Kinetic Luxe · 4 seats', eta: '5 min away', multiplier: 1.4, img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=150&h=100' },
  { id: 'PREMIUM XL' as VehicleType, name: 'SUV', desc: 'Kinetic Max · 6 seats', eta: '8 min away', multiplier: 2.1, img: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=150&h=100' }
];

export const ConfirmJourney: React.FC = () => {
  const navigate = useNavigate();
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // 1. Pull data and actions from your global store
  const { 
    pickup, 
    dropoff, 
    selectedVehicle, 
    setSelectedVehicle, 
    setEstimatedFare, 
    requestRide, 
    isLoading 
  } = useRideStore();

  // 2. Redirect back if user refreshes and loses location data
  useEffect(() => {
    if (!pickup || !dropoff) {
      navigate('/rider/home');
    }
  }, [pickup, dropoff, navigate]);

  // 3. Dynamic Price Calculation
  const distance = useMemo(() => {
    if (!pickup || !dropoff) return 0;
    return calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
  }, [pickup, dropoff]);

  const baseFare = 5.00 + (distance * 1.20); // $5 base + $1.20 per km

  // Sync the currently selected vehicle's price with the global store
  useEffect(() => {
    const activeVehicle = VEHICLES_BASE.find(v => v.id === selectedVehicle);
    if (activeVehicle) {
      setEstimatedFare(parseFloat((baseFare * activeVehicle.multiplier).toFixed(2)));
    }
  }, [selectedVehicle, baseFare, setEstimatedFare]);

  // 4. GSAP Animation
  useEffect(() => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(cardsRef.current, 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, ease: 'back.out(1.2)', duration: 0.5, delay: 0.2 }
      );
    }
  }, []);

 const handleConfirmRide = async () => {
    alert("1. Button Clicked! Starting request..."); // Test if click works
    
    try {
      const result = await requestRide(); 
      alert("2. Backend Success! Redirecting..."); 
      navigate('/rider/active'); 
    } catch (error: any) {
      // 3. THIS WILL TELL US THE EXACT PROBLEM
      const errorMessage = error.response?.data?.message || error.message || "Unknown Error";
      alert(`🚨 CRITICAL ERROR:\n\n${errorMessage}`);
      console.error("Full Error Object:", error);
    }
  };

  // Prevent render if locations are missing (prevents flashing before redirect)
  if (!pickup || !dropoff) return null;

  return (
    <div className="w-full md:w-[420px] bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-float border border-white/20 pointer-events-auto flex flex-col h-full max-h-[85vh]">
      
      {/* Header & Route Summary */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-2xl text-gray-900">Confirm Journey</h2>
        <button 
          onClick={() => navigate('/rider/home')} // Let them go back to edit
          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <Pencil size={14} />
        </button>
      </div>

      <div className="relative mb-6 pl-2">
        <div className="absolute left-[13px] top-[14px] bottom-[14px] w-0.5 bg-gray-200"></div>
        
        <div className="flex items-start mb-4 relative z-10">
          <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1 shadow-[0_0_0_4px_white]"></div>
          <div className="ml-4 flex-1 overflow-hidden">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pickup</p>
            {/* Dynamic Pickup Address */}
            <p className="text-sm font-semibold text-gray-900 truncate">{pickup.address}</p>
          </div>
        </div>

        <div className="flex items-start relative z-10">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-400 bg-white mt-1 shadow-[0_0_0_4px_white]"></div>
          <div className="ml-4 flex-1 overflow-hidden">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Drop-off</p>
            {/* Dynamic Dropoff Address */}
            <p className="text-sm font-semibold text-gray-900 truncate">{dropoff.address}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end mb-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Available Options</p>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{distance.toFixed(1)} km</p>
      </div>

      {/* Vehicle Selection List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {VEHICLES_BASE.map((vehicle, i) => {
          const isSelected = selectedVehicle === vehicle.id;
          const calculatedPrice = (baseFare * vehicle.multiplier).toFixed(2);

          return (
            <div 
              key={vehicle.id}
              ref={el => cardsRef.current[i] = el}
              onClick={() => setSelectedVehicle(vehicle.id)}
              className={`relative flex items-center p-3 rounded-2xl cursor-pointer transition-all border-2 ${
                isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-transparent hover:bg-gray-50'
              }`}
            >
              <div className="w-20 h-14 bg-gray-100 rounded-xl overflow-hidden mr-4 mix-blend-multiply">
                <img src={vehicle.img} alt={vehicle.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1">
                <p className="font-bold text-gray-900">{vehicle.name}</p>
                <p className="text-xs text-gray-500">{vehicle.desc}</p>
              </div>

              <div className="text-right">
                {/* Dynamic Price */}
                <p className="font-bold text-gray-900">${calculatedPrice}</p>
                <p className="text-[10px] font-semibold text-primary">{vehicle.eta}</p>
              </div>

              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                  <Check size={12} className="text-white font-bold" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Payment & Confirm */}
      <div className="pt-4 mt-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex items-center text-gray-900 font-semibold text-sm">
            <CreditCard size={18} className="mr-3 text-gray-500" />
            ···· 4242
          </div>
          <button className="text-primary text-xs font-bold tracking-wider uppercase hover:underline">
            Change
          </button>
        </div>

        {/* The Action Button */}
        <Button 
          onClick={handleConfirmRide}
          disabled={isLoading}
          fullWidth 
          className="py-4 rounded-2xl text-lg flex items-center justify-center"
        >
          {isLoading ? (
            <span className="animate-pulse">Requesting Ride...</span>
          ) : (
            `Confirm ${VEHICLES_BASE.find(v => v.id === selectedVehicle)?.name}`
          )}
        </Button>

        <div className="mt-4 flex justify-center gap-3 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
          <span>© 2026 SWIFTRIDE INC.</span>
          <span>·</span>
          <span className="cursor-pointer hover:text-gray-600">Privacy</span>
          <span>·</span>
          <span className="cursor-pointer hover:text-gray-600">Terms</span>
        </div>
      </div>

    </div>
  );
};