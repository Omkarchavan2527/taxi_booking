import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Navigation, Search, Clock, Briefcase, Map as MapIcon } from 'lucide-react';
import { Button } from '../common/Button';

export const BookingPanel: React.FC = () => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP: Slide in from left on mount
    if (panelRef.current) {
      gsap.fromTo(panelRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <div 
      ref={panelRef}
      className="w-full md:w-[400px] bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-float border border-white/20 pointer-events-auto"
    >
      <p className="uppercase text-primary text-xs tracking-wider font-bold mb-1">
        Book your trip
      </p>
      <h2 className="font-bold text-2xl text-gray-900 mb-6">Where to?</h2>

      <div className="relative mb-6">
        {/* Vertical connecting line */}
        <div className="absolute left-[11px] top-[24px] bottom-[24px] w-0.5 bg-gray-200"></div>

        {/* Pickup Row */}
        <div className="flex items-center mb-4 relative z-10">
          <div className="w-6 flex justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
          </div>
          <div className="flex-1 ml-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center px-4 py-3">
            <div className="flex-1">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Pickup Location</p>
              <input type="text" defaultValue="Current Location" className="w-full bg-transparent outline-none text-sm font-medium text-gray-900" />
            </div>
            <button className="text-primary p-1 hover:bg-blue-50 rounded-full transition-colors">
              <Navigation size={18} />
            </button>
          </div>
        </div>

        {/* Destination Row */}
        <div className="flex items-center relative z-10">
          <div className="w-6 flex justify-center">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-400 bg-white"></div>
          </div>
          <div className="flex-1 ml-3 bg-white border border-gray-200 shadow-sm rounded-xl flex items-center px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <div className="flex-1">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Destination</p>
              <input type="text" placeholder="Search for a place" className="w-full bg-transparent outline-none text-sm font-medium text-gray-900" />
            </div>
            <Search size={18} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Recent / Saved Places */}
      <div className="space-y-4 mb-6">
        <button className="w-full flex items-center text-left hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
            <Clock size={18} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">San Francisco Airport (SFO)</p>
            <p className="text-xs text-gray-500">San Francisco, CA</p>
          </div>
        </button>

        <button className="w-full flex items-center text-left hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
            <Briefcase size={18} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Office</p>
            <p className="text-xs text-gray-500">100 Market St, San Francisco</p>
          </div>
        </button>

        <button className="w-full flex items-center text-left hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary mr-3">
            <MapIcon size={18} />
          </div>
          <div>
            <p className="font-bold text-primary text-sm">Set location on map</p>
            <p className="text-xs text-gray-500">Drag the pin to select destination</p>
          </div>
        </button>
      </div>

      <Button fullWidth className="py-4">
        Review Ride Options
      </Button>
    </div>
  );
};