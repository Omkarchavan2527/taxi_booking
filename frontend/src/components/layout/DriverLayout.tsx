import React from 'react';
import { Outlet } from 'react-router-dom';

export const DriverLayout: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#0F1117] text-white font-sans selection:bg-driver/30">
      <Outlet />
    </div>
  );
};