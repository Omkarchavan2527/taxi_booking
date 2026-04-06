import React from 'react';
import { Star, ArrowRight, Calendar, Zap } from 'lucide-react';
import { DriverSidebar } from '../../components/driver/DriverSidebar';

export const EarningsPage: React.FC = () => {
  // Mock data for the 7-day bar chart
  const chartData = [40, 65, 45, 80, 55, 90, 70]; 
  
  // Mock data for recent rides
  const recentRides = [
    { id: 'TRP-8492', date: 'Today, 2:45 PM', tier: 'LUXE', pickup: '100 Market St', dropoff: 'SFO Airport', fare: '$42.50', status: 'COMPLETED' },
    { id: 'TRP-8491', date: 'Today, 1:15 PM', tier: 'ELECTRIC', pickup: 'Ferry Building', dropoff: 'Golden Gate Park', fare: '$28.90', status: 'COMPLETED' },
    { id: 'TRP-8490', date: 'Yesterday, 6:30 PM', tier: 'LUXE', pickup: 'Union Square', dropoff: 'Mission District', fare: '$31.00', status: 'COMPLETED' },
  ];

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      
      {/* Fixed Sidebar */}
      <DriverSidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12">
        
        {/* Top Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Executive Performance</p>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Earnings Insight.</h1>
          </div>
          
          {/* Driver/Rider Toggle (Visual only for dashboard context) */}
          <div className="hidden sm:flex bg-gray-100 p-1 rounded-xl">
            <button className="px-6 py-2 rounded-lg text-sm font-semibold bg-white text-gray-900 shadow-sm">Driver</button>
            <button className="px-6 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:text-gray-900">Rider</button>
          </div>
        </div>

        {/* Top Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Main Earnings Card (Takes up 2 cols on lg screens) */}
          <div className="lg:col-span-2 bg-primary rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[280px]">
            {/* Background glowing blur */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-2">Total Earnings This Week</p>
              <h2 className="text-5xl font-bold text-white tracking-tight">$2,845.50</h2>
            </div>

            {/* Simple CSS Bar Chart */}
            <div className="relative z-10 mt-8">
              <div className="flex items-end gap-2 h-24 mb-4">
                {chartData.map((height, i) => (
                  <div key={i} className="flex-1 bg-white/20 rounded-t-md hover:bg-white/40 transition-colors" style={{ height: `${height}%` }}></div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-white/20 pt-4">
                <div className="flex items-center">
                  <span className="bg-white text-primary text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider mr-3">
                    +12%
                  </span>
                  <p className="text-sm font-semibold text-white/90">You completed 42 trips this week.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Card */}
          <div className="bg-white rounded-3xl p-8 shadow-float border border-gray-100 flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                  <Star size={24} fill="currentColor" />
                </div>
                <span className="text-[10px] font-bold text-driver bg-driver/10 px-2 py-1 rounded-lg uppercase tracking-wider">
                  +0.05 ↑
                </span>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Driver Rating</p>
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">4.95</h2>
            </div>
            
            <div>
              <div className="w-full bg-gray-100 h-2 rounded-full mb-3 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '95%' }}></div>
              </div>
              <p className="text-xs font-semibold text-gray-500">Top 2% of partners in your city.</p>
            </div>
          </div>

        </div>

        {/* Activity Section */}
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
          <button className="text-primary text-xs font-bold uppercase tracking-wider hover:underline">
            View All History
          </button>
        </div>

        {/* Scheduled Ride Card */}
        <div className="mb-6 p-5 rounded-2xl border-2 border-dashed border-primary/30 bg-blue-50/30 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary mr-4">
              <Calendar size={18} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Scheduled: Tomorrow 6:00 AM</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Reserved Ride</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
            DETAILS
          </button>
        </div>

        {/* Ride History Rows */}
        <div className="space-y-3">
          {recentRides.map((ride) => (
            <div key={ride.id} className="flex items-center p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
              
              {/* Thumbnail / Tier */}
              <div className="w-16 h-12 bg-gray-100 rounded-xl mr-4 flex items-center justify-center flex-col border border-gray-200">
                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{ride.tier}</p>
                {ride.tier === 'ELECTRIC' && <Zap size={12} className="text-primary mt-0.5" />}
              </div>

              {/* Date & ID */}
              <div className="w-40 hidden md:block">
                <p className="text-sm font-bold text-gray-900">{ride.date}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{ride.id}</p>
              </div>

              {/* Locations */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Pickup</p>
                  <p className="text-sm font-semibold text-gray-900 truncate pr-4">{ride.pickup}</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Drop-off</p>
                  <p className="text-sm font-semibold text-gray-900 truncate pr-4">{ride.dropoff}</p>
                </div>
              </div>

              {/* Fare & Status */}
              <div className="text-right">
                <p className="font-bold text-gray-900 text-lg">{ride.fare}</p>
                <p className="text-[9px] font-bold text-driver bg-driver/10 px-2 py-1 rounded-md uppercase tracking-widest inline-block mt-1">
                  {ride.status}
                </p>
              </div>

              {/* Arrow */}
              <div className="ml-6 text-gray-300">
                <ArrowRight size={18} />
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};