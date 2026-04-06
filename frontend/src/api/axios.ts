import axios from 'axios';

// 1. Create the base Axios instance
const api = axios.create({
  // Ensure this matches your backend URL
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add the Request Interceptor (The "Security Guard")
// This runs automatically BEFORE every single API call
api.interceptors.request.use(
  (config) => {
    // Grab the stringified Zustand store from local storage
    const authStorageString = localStorage.getItem('auth-storage');
    
    if (authStorageString) {
      try {
        // Parse the JSON string into an object
        const authData = JSON.parse(authStorageString);
        
        // Zustand 'persist' wraps your variables inside a 'state' object
        // We extract the token from: authData.state.token
        const token = authData?.state?.token;
        
        // If the token exists, attach it to the "Authorization" header
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          // console.log("Token attached successfully!"); // Debugging
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

// 3. Optional: Add a Response Interceptor to handle 401s (Expired Tokens)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Session might be expired.");
      // Optional: Redirect to login or clear storage here
    }
    return Promise.reject(error);
  }
);

export default api;