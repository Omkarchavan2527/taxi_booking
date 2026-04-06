import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';

// ... (keep the User and AuthState interfaces from before)
interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginUser: (credentials: any) => Promise<void>;
  registerUser: (userData: any) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      loginUser: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.login(credentials);
          set({ user: data, token: data.token, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
          throw error;
        }
      },

      registerUser: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.register(userData);
          set({ user: data, token: data.token, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
          throw error;
        }
      },
      
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      clearError: () => set({ error: null })
    }),
    { name: 'auth-storage' }
  )
);