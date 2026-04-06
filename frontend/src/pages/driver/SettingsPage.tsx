import React, { useState } from 'react';
import { ArrowLeft, Bell, Lock, Eye, DollarSign, Shield, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Button } from '../../components/common/Button';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    autoAcceptRides: false
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDarkModeToggle = () => {
    toggleDarkMode();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const settingsGroups = [
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive ride offers and updates on your device' },
        { key: 'emailNotifications', label: 'Email Notifications', description: 'Get daily earnings and weekly reports' },
        { key: 'smsNotifications', label: 'SMS Notifications', description: 'Text message alerts for important updates' }
      ]
    },
    {
      title: 'Preferences',
      icon: Eye,
      settings: [
        { key: 'autoAcceptRides', label: 'Auto-Accept Rides', description: 'Automatically accept eligible ride requests' }
      ]
    }
  ];

  const accountActions = [
    { icon: Lock, label: 'Change Password', description: 'Update your password' },
    { icon: DollarSign, label: 'Payment Methods', description: 'Manage your bank accounts' },
    { icon: Shield, label: 'Privacy & Security', description: 'Review security settings' }
  ];

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
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage your preferences</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Settings Groups */}
        {settingsGroups.map((group, idx) => {
          const IconComponent = group.icon;
          return (
            <div key={idx} className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <IconComponent size={24} className="text-primary" />
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{group.title}</h2>
              </div>
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 divide-gray-700' : 'bg-white border-gray-200 divide-gray-100'} rounded-2xl border divide-y`}>
                {group.settings.map((setting) => (
                  <div
                    key={setting.key}
                    className={`px-6 py-4 flex items-center justify-between ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
                  >
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{setting.label}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>{setting.description}</p>
                    </div>
                    <button
                      onClick={() => handleToggle(setting.key as keyof typeof settings)}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        settings[setting.key as keyof typeof settings] ? 'bg-primary' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          settings[setting.key as keyof typeof settings] ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Dark Mode Toggle - Standalone */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Eye size={24} className="text-primary" />
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Display</h2>
          </div>
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border`}>
            <div
              className={`px-6 py-4 flex items-center justify-between ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
            >
              <div>
                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dark Mode</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>Switch to dark theme</p>
              </div>
              <button
                onClick={handleDarkModeToggle}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="mb-6">
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Account</h2>
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 divide-gray-700' : 'bg-white border-gray-200 divide-gray-100'} rounded-2xl border divide-y`}>
            {accountActions.map((action, idx) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={idx}
                  className={`w-full px-6 py-4 flex items-center justify-between ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors text-left`}
                >
                  <div className="flex items-center gap-4">
                    <IconComponent size={24} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{action.label}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>{action.description}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Help & Support */}
        <div className="mb-6">
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Help & Support</h2>
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 divide-gray-700' : 'bg-white border-gray-200 divide-gray-100'} rounded-2xl border divide-y`}>
            <button className={`w-full px-6 py-4 flex items-center justify-between ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors text-left`}>
              <div>
                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Help Center</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>FAQs and support articles</p>
              </div>
              <ChevronRight size={20} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
            </button>
            <button className={`w-full px-6 py-4 flex items-center justify-between ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors text-left`}>
              <div>
                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Contact Support</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>Reach out to our support team</p>
              </div>
              <ChevronRight size={20} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
            </button>
            <button className={`w-full px-6 py-4 flex items-center justify-between ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors text-left`}>
              <div>
                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Terms & Privacy</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>Review our terms and privacy policy</p>
              </div>
              <ChevronRight size={20} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
            </button>
          </div>
        </div>

        {/* App Version */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border p-6 mb-6 text-center`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>SwiftRide Driver v2.1.0</p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>Build 2026.04.05</p>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="w-full py-4 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2 rounded-xl font-bold"
        >
          <LogOut size={20} />
          Logout
        </Button>

        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} text-center mt-6`}>
          © 2026 SwiftRide. All rights reserved.
        </p>
      </div>
    </div>
  );
};
