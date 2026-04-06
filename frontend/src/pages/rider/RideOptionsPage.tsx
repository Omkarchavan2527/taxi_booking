import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, Zap, Star, Clock, Users } from 'lucide-react';
import { MapComponent } from '../../components/ride/MapComponent';
import { useRideStore, type VehicleType } from '../../store/useRideStore';

// --- HELPER: Calculate Distance (Haversine Formula) ---
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; // Distance in km
};

export const RideOptionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    pickup, 
    dropoff, 
    selectedVehicle, 
    setSelectedVehicle, 
    setEstimatedFare, 
    requestRide, 
    isLoading 
  } = useRideStore();

  // Safety Check: If someone refreshes the page and loses location data, send them back
  useEffect(() => {
    if (!pickup || !dropoff) {
      navigate('/rider/home');
    }
  }, [pickup, dropoff, navigate]);

  // Calculate Distance
  const distance = useMemo(() => {
    if (!pickup || !dropoff) return 0;
    return calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
  }, [pickup, dropoff]);

  // Vehicle Options & Pricing Logic
  const vehicles = useMemo(() => [
    {
      id: 'STANDARD' as VehicleType,
      name: 'Swift Standard',
      desc: 'Affordable, everyday rides',
      icon: <Car size={28} />,
      multiplier: 1,
      time: '3 min',
      capacity: 4
    },
    {
      id: 'ELECTRIC' as VehicleType,
      name: 'Swift Eco',
      desc: 'Zero emissions, quiet ride',
      icon: <Zap size={28} />,
      multiplier: 1.15, // 15% more expensive
      time: '5 min',
      capacity: 4
    },
    {
      id: 'PREMIUM XL' as VehicleType,
      name: 'Swift Premium XL',
      desc: 'Luxury rides for groups',
      icon: <Star size={28} />,
      multiplier: 1.8, // 80% more expensive
      time: '8 min',
      capacity: 6
    }
  ], []);

  // Base fare: $5.00 + $1.20 per km
  const baseFare = 5.00 + (distance * 1.20);

  // Update the global store's estimated fare whenever they click a different car
  useEffect(() => {
    const activeVehicle = vehicles.find(v => v.id === selectedVehicle);
    if (activeVehicle) {
      setEstimatedFare(parseFloat((baseFare * activeVehicle.multiplier).toFixed(2)));
    }
  }, [selectedVehicle, baseFare, vehicles, setEstimatedFare]);

  // --- THE CONFIRM ACTION ---
 const handleConfirmRide = async () => {
    alert("1. Button Clicked! Starting request..."); // Test if click works
    
    try {
      const ride = await requestRide(); 
      alert("2. Backend Success! Redirecting..."); 
    navigate(`/rider/active/${ride._id}`); 
    } catch (error: any) {
      // 3. THIS WILL TELL US THE EXACT PROBLEM
      const errorMessage = error.response?.data?.message || error.message || "Unknown Error";
      alert(`🚨 CRITICAL ERROR:\n\n${errorMessage}`);
      console.error("Full Error Object:", error);
    }
  };
  if (!pickup || !dropoff) return null;

  return (
    <div className="relative h-screen w-full bg-gray-100 flex flex-col overflow-hidden">
      
      {/* Top Header / Back Button */}
      <div className="absolute top-0 inset-x-0 p-4 z-20 flex justify-between items-center pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="bg-white p-3 rounded-full shadow-md pointer-events-auto hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-800" />
        </button>
      </div>

      {/* Top Half: The Map */}
      <div className="flex-1 relative z-0">
        <MapComponent />
      </div>

      {/* Bottom Half: Ride Options Sheet */}
      <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-10 flex flex-col max-h-[60vh]">
        
        {/* Drag Handle (Visual only) */}
        <div className="w-full flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
        </div>

        <div className="px-6 pb-2">
          <h2 className="text-xl font-bold text-gray-900">Choose a ride</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Distance: {distance.toFixed(1)} km
          </p>
        </div>

        {/* Vehicle List (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
          {vehicles.map((v) => {
            const isSelected = selectedVehicle === v.id;
            const price = (baseFare * v.multiplier).toFixed(2);

            return (
              <div 
                key={v.id}
                onClick={() => setSelectedVehicle(v.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                  isSelected 
                  ? 'border-gray-900 bg-gray-50' 
                  : 'border-transparent hover:bg-gray-50'
                }`}
              >
                {/* Icon Circle */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {v.icon}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">{v.name}</h3>
                    <span className="flex items-center text-xs text-gray-500 font-medium">
                      <Users size={12} className="mr-1"/> {v.capacity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{v.time} away • {v.desc}</p>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">${price}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirm Button Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <button
            onClick={handleConfirmRide}
            disabled={isLoading}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-black transition-colors disabled:bg-gray-400 flex items-center justify-center"
          >
            {isLoading ? (
              <span className="animate-pulse">Requesting...</span>
            ) : (
              `Confirm ${vehicles.find(v => v.id === selectedVehicle)?.name}`
            )}
          </button>
        </div>

      </div>
    </div>
  );
};