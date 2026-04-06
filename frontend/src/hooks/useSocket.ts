import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { socketService } from '../services/socket';
import { useAuthStore } from '../store/authStore';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Only connect to sockets if the user is logged in
    if (isAuthenticated && user) {
      const socketInstance = socketService.connect();
      setSocket(socketInstance);

      // Optional: Emit an event to register the user/driver session on the backend
      socketInstance.emit('user:join', { userId: user._id, role: user.role });
    }

    // Cleanup on unmount or logout
    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated, user]);

  return socket;
};