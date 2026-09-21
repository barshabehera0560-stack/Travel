export interface UserPreferences {
  travelStyle: string; // Explorer, Luxury, Family, Solo, Backpacker
  budgetTier: number; // 1, 2, 3
  interests: string[]; // Heritage, Nature, Food, Adventure, Beach, etc.
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  preferences?: UserPreferences | null;
}

export interface Attraction {
  id: string;
  destinationId: string;
  name: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  avgVisitMinutes: number;
  estimatedCost: number;
  imageUrl: string;
}

export interface Hotel {
  id: string;
  destinationId?: string;
  name: string;
  pricePerNight: number;
  rating: number;
  address: string;
  amenities: string[];
  imageUrl: string;
  bookingUrl: string;
}

export interface WeatherForecastDay {
  date: string;
  dayName: string;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
  humidity: number;
}

export interface WeatherIntelligence {
  destinationId: string;
  currentTemp: number;
  currentCondition: string;
  currentIcon: string;
  forecast: WeatherForecastDay[];
  packingSuggestions: string[];
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  category: string;
  bestSeason: string;
  description: string;
  avgCostTier: number;
  imageUrl: string;
  heroImageUrl: string;
  climateSummary: string;
  rating: number;
  reviewCount: number;
  lat: number;
  lng: number;
  counts?: {
    attractions: number;
    hotels: number;
    reviews: number;
  };
  attractions?: Attraction[];
  hotels?: Hotel[];
  weather?: WeatherIntelligence;
  reviews?: Review[];
}

export interface ItineraryItem {
  id: string;
  itineraryDayId: string;
  itemType: 'attraction' | 'hotel' | 'dining' | 'transport' | 'custom';
  title: string;
  description?: string;
  cost: number;
  startTime?: string;
  orderIndex: number;
  refId?: string;
}

export interface ItineraryDay {
  id: string;
  tripId: string;
  dayNumber: number;
  date: string;
  notes?: string;
  items: ItineraryItem[];
}

export interface CalculatedBudget {
  totalCost: number;
  budgetCeiling: number;
  remainingBudget: number;
  percentUsed: number;
  isOverBudget: boolean;
  breakdown: {
    attraction: number;
    hotel: number;
    dining: number;
    transport: number;
    custom: number;
  };
}

export interface Trip {
  id: string;
  userId: string;
  destinationId: string;
  title: string;
  startDate: string;
  endDate: string;
  travelerCount: number;
  budgetCeiling: number;
  status: string;
  destination: Destination;
  days: ItineraryDay[];
  calculatedBudget?: CalculatedBudget;
}

export interface Favorite {
  id: string;
  userId: string;
  itemType: 'destination' | 'attraction' | 'hotel';
  itemId: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  destinationId: string;
  rating: number;
  comment: string;
  travelerType: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface TransportOption {
  type: 'flight' | 'train' | 'bus' | 'cab';
  operator: string;
  durationHours: number;
  durationLabel: string;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  currency: string;
  frequency: string;
  bookingPartner: string;
  bookingUrl: string;
}

export interface BudgetComparisonItem {
  destinationId: string;
  destinationName: string;
  country: string;
  category: string;
  imageUrl: string;
  heroImageUrl: string;
  rating: number;
  avgCostTier: number;
  durationDays: number;
  travelerCount: number;
  grandTotal: number;
  perPersonTotal: number;
  breakdown: {
    accommodation: { amount: number; percent: number; details: string };
    transport: { amount: number; percent: number; details: string };
    food: { amount: number; percent: number; details: string };
    activities: { amount: number; percent: number; details: string };
  };
}

export interface BudgetComparisonResult {
  durationDays: number;
  travelerCount: number;
  budgetTier: number;
  comparisons: BudgetComparisonItem[];
}

export interface AdminDashboardStats {
  totals: {
    users: number;
    destinations: number;
    trips: number;
    reviews: number;
    attractions: number;
    hotels: number;
    platformBudgetVolume: number;
  };
  categoryDistribution: {
    category: string;
    count: number;
  }[];
  recentTrips: (Trip & {
    user: { id: string; name: string; email: string };
    destination: { id: string; name: string; country: string };
  })[];
  recentReviews: (Review & {
    user: { id: string; name: string; email: string };
    destination: { id: string; name: string; country: string };
  })[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'traveler' | 'moderator' | 'admin';
  preferences: UserPreferences | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    trips: number;
    reviews: number;
    favorites: number;
  };
}

export interface AdminReview {
  id: string;
  userId: string;
  destinationId: string;
  rating: number;
  comment: string;
  travelerType: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  destination: {
    id: string;
    name: string;
    country: string;
  };
}

export interface AdminTrip {
  id: string;
  userId: string;
  destinationId: string;
  title: string;
  startDate: string;
  endDate: string;
  travelerCount: number;
  budgetCeiling: number;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  destination: {
    id: string;
    name: string;
    country: string;
  };
  days?: ItineraryDay[];
}

export interface AIChatDestinationCard {
  id: string;
  name: string;
  country: string;
  region: string;
  category: string;
  imageUrl: string;
  rating: number;
  avgCostTier: number;
  estimatedDailyCostInr: number;
  bestSeason: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  destinations?: AIChatDestinationCard[];
  suggestedPrompts?: string[];
  timestamp: string;
}

export interface AIChatResponse {
  success: boolean;
  data: {
    reply: string;
    destinations: AIChatDestinationCard[];
    suggestedPrompts: string[];
  };
}

