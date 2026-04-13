import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // For cool toast notifications

// --- Layouts & Protection ---
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { RiderLayout } from './components/layout/RiderLayout';
import { DriverLayout } from './components/layout/DriverLayout';

// --- Auth Pages ---
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// --- Rider Pages ---
import { RiderHomePage } from './pages/rider/RiderHomePage';
import { RideOptionsPage } from './pages/rider/RideOptionsPage';
import { ActiveRidePage } from './pages/rider/ActiveRidePage';

// --- Driver Pages ---
import { DriverMobileHome } from './pages/driver/DriverMobileHome';
// import { DriverDashboardPage } from './pages/driver/DriverDashboardPage';
import { DriverDashboardPage } from './pages/driver/DriverDashboardPage';
import { DriverNavigationPage } from './pages/driver/DriverNavigationPage';
import { DriverActiveRidePage } from './pages/driver/DriverActiveRidePage';
import { EarningsPage } from './pages/driver/EarningsPage';
import { RideHistoryPage } from './pages/driver/RideHistoryPage';
import { ProfileVehiclePage } from './pages/driver/ProfileVehiclePage';
import { SettingsPage } from './pages/driver/SettingsPage';

export const App: React.FC = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected RIDER Routes */}
          <Route element={<ProtectedRoute allowedRole="user" />}>
            <Route element={<RiderLayout />}>
              <Route path="/rider/home" element={<RiderHomePage />} />
              <Route path="/rider/options" element={<RideOptionsPage />} />
              {/* <Route path="/rider/active" element={<ActiveRidePage />} /> */}
              <Route path="/rider/active/:rideId" element={<ActiveRidePage />} />
              {/* Future routes: /rider/history, /rider/profile */}
            </Route>
          </Route>

          {/* Protected DRIVER Routes */}
          <Route element={<ProtectedRoute allowedRole="driver" />}>
            <Route element={<DriverLayout />}>
              <Route path="/driver/mobile" element={<DriverMobileHome />} />
              <Route path="/driver/dashboard" element={<DriverDashboardPage />} />
              <Route path="/driver/navigation" element={<DriverNavigationPage />} />
              <Route path="/driver/active" element={<DriverActiveRidePage />} />
              <Route path="/driver/earnings" element={<EarningsPage />} />
              <Route path="/driver/history" element={<RideHistoryPage />} />
              <Route path="/driver/profile" element={<ProfileVehiclePage />} />
              <Route path="/driver/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Router>
    </>
  );
};

export default App;
