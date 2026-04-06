import React, { useState } from 'react';
import { Menu, Zap } from 'lucide-react';
import { DriverRadarMap } from '../../components/map/DriverRadarMap';
import { Button } from '../../components/common/Button';

export const DriverMobileHome: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-[#0F1117] md:hidden">
      
      {/* Driver Map Layer */}
      <DriverRadarMap />

      {/* Top Bar (Absolute, Floating over map) */}
      <div className="absolute top-0 inset-x-0 z-20 p-4 pointer-events-none flex justify-between items-start">
        
        {/* Left: Logo & Menu */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          <button className="w-10 h-10 bg-[#1A1D27] border border-[#2A2D3A] rounded-xl flex items-center justify-center text-white shadow-lg">
            <Menu size={20} />
          </button>
          
          <div className="bg-[#1A1D27]/90 backdrop-blur-md border border-[#2A2D3A] rounded-xl px-3 py-2 shadow-lg flex flex-col items-center">
            <h1 className="text-sm font-bold text-white tracking-tight">SwiftRide</h1>
            <span className="bg-driver/20 text-driver text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest mt-1">
              Driver
            </span>
          </div>
        </div>

        {/* Right: Online Toggle Pill */}
        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={`pointer-events-auto flex items-center px-4 py-2 rounded-full border shadow-lg backdrop-blur-md transition-all ${
            isOnline 
              ? 'bg-[#1A1D27]/90 border-driver/50 text-white' 
              : 'bg-gray-800/90 border-gray-600 text-gray-400'
          }`}
        >
          <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-driver shadow-[0_0_8px_#22C55E]' : 'bg-gray-500'}`}></div>
          <span className="text-xs font-bold uppercase tracking-wider">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </button>

      </div>

      {/* Bottom Stats Card (Dark Glass) */}
      <div className="absolute bottom-0 inset-x-0 z-20 pointer-events-none">
        <div className="bg-gray-900/90 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-6 pointer-events-auto shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
          
          {/* Stats Row */}
          <div className="flex justify-between items-center mb-6 divide-x divide-white/10">
            <div className="flex-1 text-center px-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Today's Trips</p>
              <p className="text-xl font-bold text-white">8</p>
            </div>
            <div className="flex-1 text-center px-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Earnings</p>
              <p className="text-xl font-bold text-driver">$142.50</p>
            </div>
            <div className="flex-1 text-center px-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Online</p>
              <p className="text-xl font-bold text-white">4h 22m</p>
            </div>
          </div>

          {/* Action Button */}
          <Button variant="driver" fullWidth className="py-4 text-lg">
            <Zap size={20} className="mr-2" />
            Simulate New Request
          </Button>

        </div>
      </div>

    </div>
  );
};