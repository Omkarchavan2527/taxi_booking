import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, DollarSign, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../store/useThemeStore';

interface Ride {
  id: string;
  passenger: string;
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  fare: number;
  rating: number;
  duration: string;
}

export const RideHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [rides] = useState<Ride[]>([
    {
      id: '1',
      passenger: 'Sarah Johnson',
      pickup: '100 Market St',
      dropoff: 'SFO International Airport',
      date: '2026-04-05',
      time: '14:30',
      fare: 42.50,
      rating: 5,
      duration: '45 mins'
    },
    {
      id: '2',
      passenger: 'Michael Chen',
      pickup: '500 Park Ave',
      dropoff: '1000 Mission St',
      date: '2026-04-04',
      time: '10:15',
      fare: 28.75,
      rating: 4.8,
      duration: '25 mins'
    },
    {
      id: '3',
      passenger: 'Emma Davis',
      pickup: '200 Valencia St',
      dropoff: 'Ferry Building',
      date: '2026-04-04',
      time: '18:45',
      fare: 35.00,
      rating: 5,
      duration: '30 mins'
    }
  ]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10`}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/driver/dashboard')}
            className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-xl transition-colors`}
          >
            <ArrowLeft size={24} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Ride History</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your completed rides</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {rides.length === 0 ? (
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-12 text-center`}>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No rides yet</p>
            </div>
          ) : (
            rides.map((ride) => (
              <div
                key={ride.id}
                className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{ride.passenger}</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ride.date} • {ride.time}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${ride.fare.toFixed(2)}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{ride.rating}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-semibold mb-0.5`}>Pickup</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{ride.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                    <div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-semibold mb-0.5`}>Dropoff</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{ride.dropoff}</p>
                    </div>
                  </div>
                </div>

                <div className={`flex items-center gap-4 pt-4 border-t ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-600'}`}>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span className="text-sm">{ride.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} />
                    <span className="text-sm">Completed</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
