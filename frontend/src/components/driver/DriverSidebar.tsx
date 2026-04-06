import React, { useState } from 'react';
import { LayoutDashboard, Wallet, History, User, Settings, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const DriverSidebar: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const { user } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', path: '/driver/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Earnings', path: '/driver/earnings', icon: <Wallet size={18} /> },
    { name: 'Ride History', path: '/driver/history', icon: <History size={18} /> },
    { name: 'Profile & Vehicle', path: '/driver/profile', icon: <User size={18} /> },
    { name: 'Settings', path: '/driver/settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="hidden md:flex flex-col w-[240px] h-screen bg-[#0F1117] border-r border-[#2A2D3A] text-white select-none">
      
      {/* Logo & Online Toggle */}
      <div className="p-6 border-b border-[#2A2D3A]">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xl font-bold tracking-tight">SwiftRide</h1>
          <span className="bg-driver/20 text-driver text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Driver
          </span>
        </div>

        {/* Custom Online Toggle */}
        <div className="bg-[#1A1D27] rounded-xl p-1 flex relative cursor-pointer border border-[#2A2D3A]" onClick={() => setIsOnline(!isOnline)}>
          <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ${isOnline ? 'bg-driver/20 left-1' : 'bg-gray-700 left-[calc(50%+2px)]'}`}></div>
          
          <div className="flex-1 py-2 text-center relative z-10 flex items-center justify-center">
            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${isOnline ? 'bg-driver' : 'bg-transparent'}`}></div>
            <span className={`text-xs font-bold uppercase tracking-wider ${isOnline ? 'text-driver' : 'text-gray-500'}`}>Online</span>
          </div>
          <div className="flex-1 py-2 text-center relative z-10 flex items-center justify-center">
             <span className={`text-xs font-bold uppercase tracking-wider ${!isOnline ? 'text-gray-300' : 'text-gray-500'}`}>Offline</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm
              ${isActive 
                ? 'bg-driver/10 text-driver' 
                : 'text-gray-400 hover:bg-[#1A1D27] hover:text-white'
              }
            `}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Today Stats & Profile */}
      <div className="p-4 border-t border-[#2A2D3A] bg-[#1A1D27]/50">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Today</p>
        <div className="grid grid-cols-2 gap-2 mb-4 px-2">
          <div>
            <p className="text-xs text-gray-400">Trips</p>
            <p className="font-bold">8</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Earned</p>
            <p className="font-bold text-driver">$142.50</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#2A2D3A] px-2">
          <div className="flex items-center">
            <img src={user?.avatar || "https://i.pravatar.cc/150?img=33"} alt="Driver" className="w-8 h-8 rounded-full border border-gray-600 mr-3" />
            <div>
              <p className="text-xs font-bold text-white">{user?.name || 'Driver'}</p>
              <p className="text-[10px] text-gray-400">{user?.vehicle?.make ? `${user.vehicle.make} ${user.vehicle.model}` : 'Vehicle'}</p>
            </div>
          </div>
          <button className="text-gray-500 hover:text-white transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>

    </div>
  );
};