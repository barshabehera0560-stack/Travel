import axios from 'axios';
import {
  Destination,
  Trip,
  Favorite,
  Review,
  Hotel,
  TransportOption,
  BudgetComparisonResult,
  Attraction,
  AdminDashboardStats,
  AdminUser,
  AdminReview,
  AdminTrip,
  AIChatResponse,
} from '../types/index.js';

const rawApiUrl = import.meta.env.VITE_API_URL;
const baseURL = rawApiUrl
  ? `${rawApiUrl.replace(/\/+$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wanderly_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiClient = {
  // Auth
  register: (data: any) => api.post('/auth/register', data).then((res) => res.data),
  login: (data: any) => api.post('/auth/login', data).then((res) => res.data),
  demoLogin: () => api.post('/auth/demo-login').then((res) => res.data),
  demoAdminLogin: () => api.post('/auth/demo-admin-login').then((res) => res.data),
  getMe: () => api.get('/auth/me').then((res) => res.data),
  updatePreferences: (preferences: any) => api.put('/auth/preferences', { preferences }).then((res) => res.data),

  // Destinations
  getDestinations: (params?: { search?: string; category?: string; region?: string; avgCostTier?: number; sortBy?: string }) =>
    api.get<{ success: boolean; data: Destination[] }>('/destinations', { params }).then((res) => res.data),
  getDestinationById: (id: string) =>
    api.get<{ success: boolean; data: Destination }>(`/destinations/${id}`).then((res) => res.data),
  getCategories: () => api.get<{ success: boolean; data: string[] }>('/destinations/categories').then((res) => res.data),

  // Hotels & Transport
  getHotels: (destinationId: string) =>
    api.get<{ success: boolean; data: Hotel[] }>('/hotels', { params: { destinationId } }).then((res) => res.data),
  getTransportEstimates: (destinationId: string) =>
    api.get<{ success: boolean; data: TransportOption[] }>('/transport/estimates', { params: { destinationId } }).then((res) => res.data),

  // Budget
  compareBudget: (data: { destinationIds: string[]; durationDays: number; travelerCount: number; budgetTier?: number }) =>
    api.post<{ success: boolean; data: BudgetComparisonResult }>('/budget/compare', data).then((res) => res.data),

  // Trips & Itinerary
  getTrips: () => api.get<{ success: boolean; data: Trip[] }>('/trips').then((res) => res.data),
  getTripById: (id: string) => api.get<{ success: boolean; data: Trip }>(`/trips/${id}`).then((res) => res.data),
  createTrip: (data: any) => api.post<{ success: boolean; data: Trip }>('/trips', data).then((res) => res.data),
  autoGenerateTrip: (tripId: string) => api.post<{ success: boolean; data: Trip }>(`/trips/${tripId}/auto-generate`).then((res) => res.data),
  addItineraryItem: (tripId: string, dayId: string, data: any) =>
    api.post(`/trips/${tripId}/days/${dayId}/items`, data).then((res) => res.data),
  deleteItineraryItem: (tripId: string, itemId: string) =>
    api.delete(`/trips/${tripId}/items/${itemId}`).then((res) => res.data),
  deleteTrip: (tripId: string) => api.delete(`/trips/${tripId}`).then((res) => res.data),

  // Favorites
  getFavorites: () => api.get<{ success: boolean; data: Favorite[] }>('/favorites').then((res) => res.data),
  toggleFavorite: (data: { itemType: string; itemId: string; title: string; subtitle?: string; imageUrl?: string }) =>
    api.post<{ success: boolean; data: { isFavorited: boolean } }>('/favorites/toggle', data).then((res) => res.data),

  // Reviews
  createReview: (data: { destinationId: string; rating: number; comment: string; travelerType: string }) =>
    api.post<{ success: boolean; data: Review }>('/reviews', data).then((res) => res.data),
  getReviews: (destinationId: string) =>
    api.get<{ success: boolean; data: Review[] }>(`/reviews/destination/${destinationId}`).then((res) => res.data),

  // Admin Management
  getAdminStats: () =>
    api.get<{ success: boolean; data: AdminDashboardStats }>('/admin/stats').then((res) => res.data),
  getAdminUsers: () =>
    api.get<{ success: boolean; count: number; data: AdminUser[] }>('/admin/users').then((res) => res.data),
  updateUserRole: (userId: string, role: string) =>
    api.patch(`/admin/users/${userId}/role`, { role }).then((res) => res.data),
  deleteUser: (userId: string) =>
    api.delete(`/admin/users/${userId}`).then((res) => res.data),
  getAdminTrips: () =>
    api.get<{ success: boolean; count: number; data: AdminTrip[] }>('/admin/trips').then((res) => res.data),
  deleteAdminTrip: (tripId: string) =>
    api.delete(`/admin/trips/${tripId}`).then((res) => res.data),
  createDestination: (data: any) =>
    api.post<{ success: boolean; data: Destination }>('/admin/destinations', data).then((res) => res.data),
  updateDestination: (id: string, data: any) =>
    api.put<{ success: boolean; data: Destination }>(`/admin/destinations/${id}`, data).then((res) => res.data),
  deleteDestination: (id: string) =>
    api.delete(`/admin/destinations/${id}`).then((res) => res.data),
  createAttraction: (data: any) =>
    api.post<{ success: boolean; data: Attraction }>('/admin/attractions', data).then((res) => res.data),
  updateAttraction: (id: string, data: any) =>
    api.put<{ success: boolean; data: Attraction }>(`/admin/attractions/${id}`, data).then((res) => res.data),
  deleteAttraction: (id: string) =>
    api.delete(`/admin/attractions/${id}`).then((res) => res.data),
  createHotel: (data: any) =>
    api.post<{ success: boolean; data: Hotel }>('/admin/hotels', data).then((res) => res.data),
  updateHotel: (id: string, data: any) =>
    api.put<{ success: boolean; data: Hotel }>(`/admin/hotels/${id}`, data).then((res) => res.data),
  deleteHotel: (id: string) =>
    api.delete(`/admin/hotels/${id}`).then((res) => res.data),
  getAdminReviews: () =>
    api.get<{ success: boolean; count: number; data: AdminReview[] }>('/admin/reviews').then((res) => res.data),
  deleteAdminReview: (reviewId: string) =>
    api.delete(`/admin/reviews/${reviewId}`).then((res) => res.data),

  // AI Travel Chatbot
  sendChatMessage: (message: string, history?: any[]) =>
    api.post<AIChatResponse>('/chat', { message, history }).then((res) => res.data),
};
