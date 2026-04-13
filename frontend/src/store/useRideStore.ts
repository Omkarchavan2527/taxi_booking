import { create } from 'zustand';
import api from '../api/axios';

export type VehicleType = 'Standard' | 'Eco' | 'Premium' | null;

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface RideState {
  pickup: Location | null;
  dropoff: Location | null;
  selectedVehicle: VehicleType;
  estimatedFare: number;
  currentRide: any; 
  isLoading: boolean;
  error: string | null;

  setPickup: (loc: Location) => void;
  setDropoff: (loc: Location) => void;
  setSelectedVehicle: (vehicle: VehicleType) => void;
  setEstimatedFare: (fare: number) => void;
  setCurrentRide: (ride: any) => void;
  clearRide: () => void;
  
  requestRide: () => Promise<any>;
  acceptRide: (rideId: string) => Promise<any>;
  fetchRide: (rideId: string) => Promise<any>;
  completeRide: (rideId: string) => Promise<any>;
  verifyOtp: (rideId: string, otp: string) => Promise<any>;
}

export const useRideStore = create<RideState>((set, get) => ({
  pickup: null,
  dropoff: null,
  selectedVehicle: null,
  estimatedFare: 0,
  currentRide: null,
  isLoading: false,
  error: null,

  setPickup: (loc) => set({ pickup: loc }),
  setDropoff: (loc) => set({ dropoff: loc }),
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
  setEstimatedFare: (fare) => set({ estimatedFare: fare }),
  setCurrentRide: (ride) => set({ currentRide: ride }),
  clearRide: () => set({
    pickup: null,
    dropoff: null,
    selectedVehicle: null,
    estimatedFare: 0,
    currentRide: null,
    error: null
  }),

  requestRide: async () => {
    const { pickup, dropoff, selectedVehicle, estimatedFare } = get();
    if (!pickup || !dropoff) throw new Error("Missing locations");

    set({ isLoading: true, error: null });

    try {
      // --- FORCE TOKEN GRAB ---
      // We look specifically at 'auth-storage' which is where your Login store saves data
      const authData = localStorage.getItem('auth-storage');
      const token = authData ? JSON.parse(authData)?.state?.token : null;

      const response = await api.post('/rides/request', 
        {
          pickup,
          dropoff,
          vehicleType: selectedVehicle,
          estimatedFare
        },
        {
          // We manually attach it here as a fallback to the axios interceptor
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        }
      );

      set({ isLoading: false, currentRide: response.data });
      return response.data;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || "Failed to request ride" 
      });
      throw error;
    }
  },

  acceptRide: async (rideId: string) => {
    set({ isLoading: true, error: null });
    try {
      // --- FORCE TOKEN GRAB ---
      const authData = localStorage.getItem('auth-storage');
      const token = authData ? JSON.parse(authData)?.state?.token : null;

      const response = await api.put(`/rides/${rideId}/accept`, {}, {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });

      set({ isLoading: false, currentRide: response.data });
      return response.data;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || "Failed to accept ride." 
      });
      throw error;
    }
  },

  fetchRide: async (rideId: string) => {
    set({ isLoading: true, error: null });
    try {
      const authData = localStorage.getItem('auth-storage');
      const token = authData ? JSON.parse(authData)?.state?.token : null;

      const response = await api.get(`/rides/${rideId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });

      set({ isLoading: false, currentRide: response.data });
      return response.data;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || "Failed to fetch ride." 
      });
      throw error;
    }
  },

  completeRide: async (rideId: string) => {
    set({ isLoading: true, error: null });
    try {
      const authData = localStorage.getItem('auth-storage');
      const token = authData ? JSON.parse(authData)?.state?.token : null;

      const response = await api.patch(`/rides/${rideId}/status`, { status: 'completed' }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });

      set({ isLoading: false, currentRide: response.data });
      return response.data;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || "Failed to complete ride." 
      });
      throw error;
    }
  },
  verifyOtp: async (rideId: string, otp: string) => {
    set({ isLoading: true, error: null });
    try {
      const authData = localStorage.getItem('auth-storage');
      const token = authData ? JSON.parse(authData)?.state?.token : null;

      const response = await api.post(`/rides/${rideId}/verify-otp`, { otp }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });

      set({ isLoading: false, currentRide: response.data.ride });
      return response.data;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || "Failed to verify OTP." 
      });
      throw error;
    }
  },
}));
