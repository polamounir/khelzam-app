// src/api/axiosInstance.js
import axios from 'axios';
import { generateFingerprint } from '../utils/deviceFingerprint';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token and device fingerprint
axiosInstance.interceptors.request.use(
  (config) => {
    // Attach auth token if present
    const token = localStorage.getItem('khelzam_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach device fingerprint
    try {
      const fingerprint = generateFingerprint();
      if (fingerprint) {
        config.headers['x-device-fingerprint'] = fingerprint;
      }
    } catch (err) {
      console.warn('[API] Failed to attach fingerprint:', err);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalize errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      const status = error.response.status;
      const data = error.response.data;
      
      message = data.message || data.error || `Error: ${status}`;
      
      if (status === 401) message = 'Unauthorized access. Please login again.';
      if (status === 403) message = 'You do not have permission to perform this action.';
      if (status === 404) message = 'The requested resource was not found.';
      if (status === 500) message = 'Internal server error. Please try again later.';
    } else if (error.request) {
      // Request was made but no response was received
      message = 'Network error. Please check your internet connection.';
    } else {
      // Something happened in setting up the request
      message = error.message;
    }

    console.error('[API Error]', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message
    });

    const axiosError = new Error(message);
    axiosError.response = error.response;
    axiosError.data = error.response?.data; // Include the full response data
    return Promise.reject(axiosError);
  }
);

export default axiosInstance;
