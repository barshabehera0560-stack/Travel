import { create } from 'zustand';
import { User, UserPreferences } from '../types/index.js';
import { apiClient } from '../api/client.js';
import { useWishlistStore } from './useWishlistStore.js';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  isQuizModalOpen: boolean;
  authMode: 'login' | 'register';
  setAuthModalOpen: (open: boolean, mode?: 'login' | 'register') => void;
  setQuizModalOpen: (open: boolean) => void;
  initAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  demoAdminLogin: () => Promise<void>;
  logout: () => void;
  updatePreferences: (preferences: UserPreferences) => Promise<void>;
}

const getInitialUser = (): User | null => {
  try {
    const saved = localStorage.getItem('wanderly_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getInitialUser(),
  token: localStorage.getItem('wanderly_token'),
  isLoading: false,
  isAuthModalOpen: false,
  isQuizModalOpen: false,
  authMode: 'login',

  setAuthModalOpen: (open, mode = 'login') => {
    set({ isAuthModalOpen: open, authMode: mode });
  },

  setQuizModalOpen: (open) => {
    set({ isQuizModalOpen: open });
  },

  initAuth: async () => {
    const token = localStorage.getItem('wanderly_token');
    if (!token) return;
    try {
      set({ isLoading: true });
      const res = await apiClient.getMe();
      if (res.success) {
        localStorage.setItem('wanderly_user', JSON.stringify(res.data));
        set({ user: res.data });
      }
    } catch {
      localStorage.removeItem('wanderly_token');
      localStorage.removeItem('wanderly_user');
      set({ user: null, token: null });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await apiClient.login({ email, password });
      if (res.success) {
        localStorage.setItem('wanderly_token', res.data.token);
        localStorage.setItem('wanderly_user', JSON.stringify(res.data.user));
        set({ user: res.data.user, token: res.data.token, isAuthModalOpen: false });
        useWishlistStore.getState().fetchFavorites();
      } else {
        throw new Error(res.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const res = await apiClient.register({ name, email, password });
      if (res.success) {
        localStorage.setItem('wanderly_token', res.data.token);
        localStorage.setItem('wanderly_user', JSON.stringify(res.data.user));
        set({ user: res.data.user, token: res.data.token, isAuthModalOpen: false, isQuizModalOpen: true });
        useWishlistStore.getState().fetchFavorites();
      } else {
        throw new Error(res.message || 'Registration failed.');
      }
    } finally {
      set({ isLoading: false });
    }
  },

  demoLogin: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient.demoLogin();
      if (res.success) {
        localStorage.setItem('wanderly_token', res.data.token);
        localStorage.setItem('wanderly_user', JSON.stringify(res.data.user));
        set({ user: res.data.user, token: res.data.token, isAuthModalOpen: false });
        useWishlistStore.getState().fetchFavorites();
      } else {
        throw new Error(res.message || 'Demo login failed.');
      }
    } finally {
      set({ isLoading: false });
    }
  },

  demoAdminLogin: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient.demoAdminLogin();
      if (res.success) {
        localStorage.setItem('wanderly_token', res.data.token);
        localStorage.setItem('wanderly_user', JSON.stringify(res.data.user));
        set({ user: res.data.user, token: res.data.token, isAuthModalOpen: false });
        useWishlistStore.getState().fetchFavorites();
      } else {
        throw new Error(res.message || 'Admin login failed.');
      }
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('wanderly_token');
    localStorage.removeItem('wanderly_user');
    set({ user: null, token: null, isAuthModalOpen: false, isQuizModalOpen: false });
    useWishlistStore.getState().fetchFavorites();
  },

  updatePreferences: async (preferences: UserPreferences) => {
    const res = await apiClient.updatePreferences(preferences);
    if (res.success) {
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = { ...currentUser, preferences };
        localStorage.setItem('wanderly_user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
      }
    }
  },
}));
