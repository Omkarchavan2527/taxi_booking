import React, { useState } from 'react';
import { ArrowLeft, User, Car, Upload, Edit2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../store/useThemeStore';

export const ProfileVehiclePage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Michael Rodriguez',
    email: 'michael@example.com',
    phone: '+1 (555) 123-4567',
    licenseNumber: 'DL-1234567',
    licenseExpiry: '2028-06-15'
  });

  const [vehicleData, setVehicleData] = useState({
    licensePlate: 'KR-7392',
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    color: 'White Pearl',
    vin: '5YJ3E1EA9L8C12345',
    registrationExpiry: '2026-12-31'
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicleData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10`}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/driver/dashboard')}
              className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-xl transition-colors`}
            >
              <ArrowLeft size={24} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
            </button>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Profile & Vehicle</h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage your information</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Edit2 size={16} />
            {isEditing ? 'Done' : 'Edit'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Profile Section */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-8 mb-6 border`}>
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-20 h-20 ${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'} rounded-full flex items-center justify-center`}>
              <User size={40} className="text-primary" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{profileData.name}</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Driver since 2023</p>
              <div className="flex items-center gap-2 mt-2">
                <CheckCircle size={16} className="text-green-500 fill-green-500" />
                <span className={`text-sm font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>Verified</span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Full Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' : 'bg-white border-gray-300 disabled:bg-gray-100 disabled:text-gray-600'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' : 'bg-white border-gray-300 disabled:bg-gray-100 disabled:text-gray-600'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Phone</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' : 'bg-white border-gray-300 disabled:bg-gray-100 disabled:text-gray-600'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>License Number</label>
              <input
                type="text"
                name="licenseNumber"
                value={profileData.licenseNumber}
                onChange={handleProfileChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' : 'bg-white border-gray-300 disabled:bg-gray-100 disabled:text-gray-600'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>License Expiry</label>
              <input
                type="date"
                name="licenseExpiry"
                value={profileData.licenseExpiry}
                onChange={handleProfileChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' : 'bg-white border-gray-300 disabled:bg-gray-100 disabled:text-gray-600'}`}
              />
            </div>
          </div>
        </div>

        {/* Vehicle Section */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-8 border`}>
          <div className="flex items-center gap-4 mb-8">
            <div className={isDarkMode ? 'w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center' : 'w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center'}>
              <Car size={32} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{vehicleData.make} {vehicleData.model}</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{vehicleData.year} • {vehicleData.licensePlate}</p>
            </div>
          </div>

          {/* Vehicle Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>License Plate</label>
              <input
                type="text"
                name="licensePlate"
                value={vehicleData.licensePlate}
                onChange={handleVehicleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' : 'bg-white border-gray-300 disabled:bg-gray-100 disabled:text-gray-600'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Make</label>
              <input
                type="text"
                name="make"
                value={vehicleData.make}
                onChange={handleVehicleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' : 'bg-white border-gray-300 disabled:bg-gray-100 disabled:text-gray-600'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Model</label>
              <input
                type="text"
                name="model"
                value={vehicleData.model}
                onChange={handleVehicleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' : 'bg-white border-gray-300 disabled:bg-gray-100 disabled:text-gray-600'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Year</label>
              <input
                type="number"
                name="year"
                value={vehicleData.year}
                onChange={handleVehicleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' : 'bg-white border-gray-300 disabled:bg-gray-100 disabled:text-gray-600'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Color</label>
              <input
                type="text"
                name="color"
                value={vehicleData.color}
                onChange={handleVehicleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' : 'bg-white border-gray-300 disabled:bg-gray-100 disabled:text-gray-600'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>VIN</label>
              <input
                type="text"
                name="vin"
                value={vehicleData.vin}
                onChange={handleVehicleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' : 'bg-white border-gray-300 disabled:bg-gray-100 disabled:text-gray-600'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Registration Expiry</label>
              <input
                type="date"
                name="registrationExpiry"
                value={vehicleData.registrationExpiry}
                onChange={handleVehicleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' : 'bg-white border-gray-300 disabled:bg-gray-100 disabled:text-gray-600'}`}
              />
            </div>
          </div>

          {/* Document Upload Section */}
          {isEditing && (
            <div className={`mt-8 pt-8 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Upload Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`border-2 border-dashed ${isDarkMode ? 'border-gray-600 hover:border-primary' : 'border-gray-300 hover:border-primary'} rounded-lg p-6 text-center cursor-pointer transition-colors`}>
                  <Upload size={24} className={`mx-auto ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-2`} />
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>License Front</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>PDF, PNG, or JPG</p>
                </div>
                <div className={`border-2 border-dashed ${isDarkMode ? 'border-gray-600 hover:border-primary' : 'border-gray-300 hover:border-primary'} rounded-lg p-6 text-center cursor-pointer transition-colors`}>
                  <Upload size={24} className={`mx-auto ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-2`} />
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>License Back</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>PDF, PNG, or JPG</p>
                </div>
                <div className={`border-2 border-dashed ${isDarkMode ? 'border-gray-600 hover:border-primary' : 'border-gray-300 hover:border-primary'} rounded-lg p-6 text-center cursor-pointer transition-colors`}>
                  <Upload size={24} className={`mx-auto ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-2`} />
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Registration</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>PDF, PNG, or JPG</p>
                </div>
                <div className={`border-2 border-dashed ${isDarkMode ? 'border-gray-600 hover:border-primary' : 'border-gray-300 hover:border-primary'} rounded-lg p-6 text-center cursor-pointer transition-colors`}>
                  <Upload size={24} className={`mx-auto ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-2`} />
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Insurance</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>PDF, PNG, or JPG</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
