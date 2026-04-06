import React from 'react';
import { Outlet } from 'react-router-dom';

export const RiderLayout: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-primary/20">
      <Outlet />
    </div>
  );
};