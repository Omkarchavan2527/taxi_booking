import { useState, useEffect } from 'react';
import api from '../services/api';
import { useSocket } from './useSocket';

export const useRide = () => {
  const socket = useSocket();
  const [activeRequest, setActiveRequest] = useState<any>(null);

  // === RIDER: Book a Ride ===
  const bookRide = async (rideDetails: any) => {
    try {
      // 1. Hit the Express REST API we built
      const response = await api.post('/rides/book', rideDetails);
      const newRide = response.data;
      
      // 2. The backend controller handles emitting 'ride:new-request' to drivers via socket!
      return newRide;
    } catch (error) {
      console.error("Booking failed:", error);
      throw error;
    }
  };

  // === DRIVER: Listen for incoming rides ===
  useEffect(() => {
    if (!socket) return;

    // Listen for the event emitted by our backend rideController.js
    socket.on('ride:new-request', (data) => {
      console.log("New Ride Request Received!", data);
      setActiveRequest(data); // This triggers the RideRequestModal to pop up!
    });

    // Clean up listener
    return () => {
      socket.off('ride:new-request');
    };
  }, [socket]);

  // === DRIVER: Accept a Ride ===
  const acceptRide = (rideId: string) => {
    if (!socket) return;
    socket.emit('driver:accept-ride', { rideId });
    setActiveRequest(null);
  };

  // === DRIVER: Decline a Ride ===
  const declineRide = () => {
    setActiveRequest(null);
  };

  return {
    bookRide,
    activeRequest,
    acceptRide,
    declineRide
  };
};