import axios from 'axios';

// 1. Create the Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add the Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Grab the stringified Zustand store from local storage
    const authStorageString = localStorage.getItem('auth-storage');
    
    if (authStorageString) {
      try {
        // Parse safely
        const authData = JSON.parse(authStorageString);
        
        // Safely extract the token. Zustand 'persist' wraps your variables inside 'state'
        const token = authData?.state?.token;
        
        // If we found it, attach it as a Bearer token!
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Axios Interceptor Error: Failed to parse auth-storage", error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;