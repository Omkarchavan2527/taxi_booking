import React, { useState } from 'react';
import { MapComponent } from '../../components/ride/MapComponent';
import { useRideStore } from '../../store/useRideStore';
import { Search, MapPin, Navigation, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RiderHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setPickup, setDropoff, pickup, dropoff } = useRideStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // --- THE WORKFLOW: SEARCH CITY ---
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const topResult = data[0];
        const newLoc = {
          address: topResult.display_name,
          lat: parseFloat(topResult.lat),
          lng: parseFloat(topResult.lon),
        };

        // If pickup isn't set, set it. Otherwise set dropoff.
        if (!pickup) {
          setPickup(newLoc);
        } else {
          setDropoff(newLoc);
        }
        setSearchQuery('');
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const proceedToOptions = () => {
    if (pickup && dropoff) {
      navigate('/rider/options');
    }
  };

  return (
    <div className="relative h-screen w-full bg-gray-100 overflow-hidden">
      {/* 1. THE MAP (Background Layer) */}
      <div className="absolute inset-0 z-0">
        <MapComponent />
      </div>

      {/* 2. FLOATING SEARCH BAR */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-10">
        <form 
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex items-center gap-2"
        >
          <div className="p-2 text-primary">
            <Search size={20} />
          </div>
          <input 
            type="text"
            placeholder={!pickup ? "Where from? (Pickup)" : "Where to? (Destination)"}
            className="flex-1 bg-transparent outline-none text-sm font-medium text-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit"
            disabled={isSearching}
            className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black transition-colors"
          >
            {isSearching ? '...' : 'Search'}
          </button>
        </form>
      </div>

      {/* 3. BOTTOM INFO CARD */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Plan your trip</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <MapPin className="text-blue-500" size={20} />
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Pickup</p>
                <p className="text-sm font-semibold text-gray-700 truncate">
                  {pickup?.address || 'Click map or search above'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <Navigation className="text-green-500" size={20} />
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Dropoff</p>
                <p className="text-sm font-semibold text-gray-700 truncate">
                  {dropoff?.address || 'Select destination'}
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={proceedToOptions}
            disabled={!pickup || !dropoff}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
              pickup && dropoff 
              ? 'bg-primary text-white shadow-lg shadow-primary/30' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Confirm Locations <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};