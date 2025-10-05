// API service for Church Portal backend communication

import axios from 'axios';
import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // Important for cookie-based authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication API calls
export const authAPI = {
  // User login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Login failed');
    }
  },

  // User registration
  register: async (userData: RegisterData): Promise<{ msg: string; verificationToken: string }> => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Registration failed');
    }
  },

  // User logout
  logout: async (): Promise<{ msg: string }> => {
    try {
      const response = await api.delete('/auth/logout');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Logout failed');
    }
  },

  // Email verification
  verifyEmail: async (verificationToken: string, email: string): Promise<{ msg: string }> => {
    try {
      const response = await api.post('/auth/verify-email', {
        verificationToken,
        email,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Email verification failed');
    }
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<{ msg: string }> => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Password reset request failed');
    }
  },

  // Reset password
  resetPassword: async (email: string, token: string, password: string): Promise<{ msg: string }> => {
    try {
      const response = await api.post('/auth/reset-password', {
        email,
        token,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Password reset failed');
    }
  },
};

// Member management API calls (Admin only)
export const memberAPI = {
  // Get all members
  getAllMembers: async () => {
    try {
      const response = await api.get('/member');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to fetch members');
    }
  },

  // Create new member
  createMember: async (memberData: any) => {
    try {
      const response = await api.post('/member', memberData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to create member');
    }
  },

  // Get specific member
  getMember: async (id: string) => {
    try {
      const response = await api.get(`/member/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to fetch member');
    }
  },

  // Update member
  updateMember: async (id: string, memberData: any) => {
    try {
      const response = await api.patch(`/member/${id}`, memberData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to update member');
    }
  },

  // Delete member
  deleteMember: async (id: string) => {
    try {
      const response = await api.delete(`/member/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to delete member');
    }
  },
};

// Service management API calls (Admin only)
export const serviceAPI = {
  // Get all services
  getAllServices: async () => {
    try {
      const response = await api.get('/services');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to fetch services');
    }
  },

  // Create new service
  createService: async (serviceData: any) => {
    try {
      const response = await api.post('/services', serviceData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to create service');
    }
  },

  // Get specific service
  getService: async (id: string) => {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to fetch service');
    }
  },

  // Update service
  updateService: async (id: string, serviceData: any) => {
    try {
      const response = await api.patch(`/services/${id}`, serviceData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to update service');
    }
  },

  // Delete service
  deleteService: async (id: string) => {
    try {
      const response = await api.delete(`/services/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to delete service');
    }
  },
};

// Churchday management API calls (Admin only)
export const churchdayAPI = {
  // Get all churchdays
  getAllChurchdays: async () => {
    try {
      const response = await api.get('/churchday');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to fetch church days');
    }
  },

  // Create new churchday
  createChurchday: async (churchdayData: any) => {
    try {
      const response = await api.post('/churchday', churchdayData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to create church day');
    }
  },

  // Get specific churchday
  getChurchday: async (id: string) => {
    try {
      const response = await api.get(`/churchday/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to fetch church day');
    }
  },

  // Update churchday
  updateChurchday: async (id: string, churchdayData: any) => {
    try {
      const response = await api.patch(`/churchday/${id}`, churchdayData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to update church day');
    }
  },

  // Delete churchday
  deleteChurchday: async (id: string) => {
    try {
      const response = await api.delete(`/churchday/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to delete church day');
    }
  },
};

// Attendance management API calls (Admin only)
export const attendanceAPI = {
  // Get all attendance records
  getAllAttendance: async () => {
    try {
      const response = await api.get('/attendance');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to fetch attendance records');
    }
  },

  // Create new attendance record
  createAttendance: async (attendanceData: any) => {
    try {
      const response = await api.post('/attendance', attendanceData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to create attendance record');
    }
  },

  // Delete attendance record
  deleteAttendance: async (id: string) => {
    try {
      const response = await api.delete(`/attendance/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to delete attendance record');
    }
  },
};

export default api;
