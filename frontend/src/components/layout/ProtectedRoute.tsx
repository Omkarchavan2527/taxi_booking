import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface Props {
  allowedRole: 'rider' | 'driver' | 'user';
}

export const ProtectedRoute: React.FC<Props> = ({ allowedRole }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Handle both 'user' and 'rider' as valid for the rider role
  const isRider = user?.role === 'rider' || user?.role === 'user';
  
  if (allowedRole === 'driver' && user?.role !== 'driver') {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole === 'user' && !isRider) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};