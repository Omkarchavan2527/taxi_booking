import api from '../api/axios'; // Ensure this points to your axios config

export const authService = {
  register: async (userData: any) => {
    console.log("Sending to backend:", userData);
    // Make sure this matches your backend route: /api/auth/register
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};