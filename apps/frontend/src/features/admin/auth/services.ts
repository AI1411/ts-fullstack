import { storage } from '@/db';
// Auth services
import { login, register } from './controllers';

// Auth service
export const authService = {
  // Login service
  login: async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      // Store user info in local storage
      storage.set('user', result.user);
      return result.user;
    }
    throw new Error('Login failed');
  },

  // Register service
  register: async (name: string, email: string, password: string) => {
    const result = await register(name, email, password);
    if (result.success) {
      // Store user info in local storage
      storage.set('user', result.user);
      return result.user;
    }
    throw new Error('Registration failed');
  },

  // Logout service
  logout: () => {
    // Remove user from local storage
    storage.remove('user');
  },

  // Get current user
  getCurrentUser: () => {
    return storage.get('user');
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!storage.get('user');
  },
};
