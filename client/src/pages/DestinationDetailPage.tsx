import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MapPin,
  Star,
  Sun,
  Heart,
  Scale,
  Compass,
  IndianRupee,
  Clock,
  ExternalLink,
  Luggage,
  CheckCircle2,
  Plus,
  Plane,
  Train,
  Car,
} from 'lucide-react';
import { apiClient } from '../api/client.js';
import { useCompareStore } from '../store/useCompareStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { useWishlistStore } from '../store/useWishlistStore.js';

export const DestinationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, setAuthModalOpen } = useAuthStore();
  const { toggleDestination, isSelected } = useCompareStore();
  const { isFavorited, toggleFavorite } = useWishlistStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'attractions' | 'hotels' | 'transport' | 'reviews'>('overview');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewTravelerType, setReviewTravelerType] = useState('Solo');

  const { data: destData, isLoading, error } = useQuery({
    queryKey: ['destination', id],
    queryFn: () => apiClient.getDestinationById(id!),
    enabled: !!id,
  });

  const { data: transportData } = useQuery({
    queryKey: ['transport', id],
    queryFn: () => apiClient.getTransportEstimates(id!),
    enabled: !!id,
  });

  const destination = destData?.data;
  const isCompared = destination ? isSelected(destination.id) : false;
  const favorited = destination ? isFavorited(destination.id) : false;

  const reviewMutation = useMutation({
    mutationFn: (newReview: { destinationId: string; rating: number; comment: string; travelerType: string }) =>
      apiClient.createReview(newReview),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destination', id] });
      setReviewModalOpen(false);
      setReviewComment('');
    },
  });

  const handleFavoriteToggle = async () => {
    if (!destination) return;
    await toggleFavorite({
      itemType: 'destination',
      itemId: destination.id,
      title: destination.name,
      subtitle: `${destination.country} • ${destination.category}`,
      imageUrl: destination.imageUrl,
    });
  };

  const handleCreateTripClick = () => {
    if (!destination) return;
    navigate(`/trips?newDestinationId=${destination.id}`);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (!destination) return;
    reviewMutation.mutate({
      destinationId: destination.id,
      rating: reviewRating,
      comment: reviewComment,
      travelerType: reviewTravelerType,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-wander-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading destination intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Destination Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The requested travel destination could not be retrieved.</p>
        <Link to="/" className="inline-block mt-4 px-6 py-2.5 bg-wander-500 text-white font-bold text-sm rounded-full">
          Return to Discover
        </Link>
      </div>
    );
  }

  const costTierLabel = ['₹ Budget', '₹₹ Moderate', '₹₹₹ Luxury'][destination.avgCostTier - 1] || '₹₹ Moderate';

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Header */}
      <div className="relative h-[480px] sm:h-[560px] w-full overflow-hidden bg-slate-900">
        <img
          src={destination.heroImageUrl || destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 text-white">
          {/* Category & Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Link to="/" className="text-xs text-white/80 hover:text-white transition">
              Destinations
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-xs text-white/80">{destination.region}</span>
            <span className="text-white/40">/</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-wander-500 text-white shadow-sm">
              {destination.category}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-md">
            {destination.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-3 text-sm text-white/90">
            <div className="flex items-center gap-1.5 font-semibold">
              <MapPin className="w-4 h-4 text-wander-400" />
              <span>{destination.country}</span>
            </div>

            <div className="flex items-center gap-1.5 font-semibold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{destination.rating.toFixed(1)}</span>
              <span className="text-white/60 font-normal">({destination.reviewCount} reviews)</span>
            </div>

            <div className="flex items-center gap-1.5 font-semibold">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Best: {destination.bestSeason}</span>
            </div>

            <div className="flex items-center gap-1 font-semibold bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
              <span>{costTierLabel}</span>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={handleCreateTripClick}
              className="px-6 py-3 bg-gradient-to-r from-wander-500 to-wander-600 hover:from-wander-600 hover:to-wander-700 text-white text-sm font-extrabold rounded-full shadow-float transition-all active:scale-95 flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              Start Planning Trip
            </button>

            <button
              onClick={handleFavoriteToggle}
              className={`px-4 py-3 rounded-full text-sm font-bold backdrop-blur-md border transition flex items-center gap-2 ${
                favorited
                  ? 'bg-red-500 text-white border-red-500 shadow-md'
                  : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-white text-white' : ''}`} />
              <span>{favorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>

            <button
              onClick={() => toggleDestination(destination)}
              className={`px-4 py-3 rounded-full text-sm font-bold backdrop-blur-md border transition flex items-center gap-2 ${
                isCompared
                  ? 'bg-wander-500 text-white border-wander-500'
                  : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{isCompared ? 'In Compare' : 'Compare Budget'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Tab Navigation */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 sm:gap-4 overflow-x-auto py-3">
          {[
            { id: 'overview', label: 'Overview & Climate' },
            { id: 'attractions', label: `Attractions (${destination.attractions?.length || 0})` },
            { id: 'hotels', label: `Hotels (${destination.hotels?.length || 0})` },
            { id: 'transport', label: 'Transport' },
            { id: 'reviews', label: `Reviews (${destination.reviews?.length || 0})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* TAB 1: OVERVIEW & CLIMATE */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Destination Story */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
              <h2 className="text-2xl font-black text-slate-900 mb-3">About {destination.name}</h2>
              <p className="text-base text-slate-600 leading-relaxed max-w-4xl">
                {destination.description}
              </p>
              <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-3">
                <Sun className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">Climate & Season Guide</h4>
                  <p className="text-xs text-amber-800 mt-0.5">{destination.climateSummary}</p>
                </div>
              </div>
            </div>

            {/* Weather Intelligence Widget */}
            {destination.weather && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-wander-600">Real-Time Forecast</span>
                    <h3 className="text-2xl font-black text-slate-900">Weather Intelligence</h3>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-2xl">
                    <Sun className="w-5 h-5 text-amber-500" />
                    <div>
                      <span className="text-lg font-black text-slate-900">{destination.weather.currentTemp}°C</span>
                      <span className="text-xs text-slate-500 ml-1.5 font-medium">{destination.weather.currentCondition}</span>
                    </div>
                  </div>
                </div>

                {/* 5-Day Forecast Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                  {destination.weather.forecast.map((day, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center flex flex-col items-center justify-between"
                    >
                      <span className="text-xs font-bold text-slate-500 uppercase">{day.dayName}</span>
                      <span className="text-[11px] text-slate-400">{day.date.slice(5)}</span>
                      <div className="my-2 p-2 rounded-full bg-white shadow-xs">
                        <Sun className="w-6 h-6 text-amber-500" />
                      </div>
                      <div className="text-sm font-black text-slate-800">
                        {day.tempMax}° / <span className="text-slate-400 font-normal">{day.tempMin}°</span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 truncate max-w-full font-medium">
                        {day.condition}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Smart Packing Suggestions */}
                {destination.weather.packingSuggestions && (
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
                      <Luggage className="w-4 h-4 text-wander-500" />
                      <span>Recommended Packing Essentials based on Forecast:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {destination.weather.packingSuggestions.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-xs font-medium text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ATTRACTIONS & SIGHTS */}
        {activeTab === 'attractions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">Must-See Attractions in {destination.name}</h2>
              <button
                onClick={handleCreateTripClick}
                className="text-xs font-bold text-wander-600 hover:text-wander-700 flex items-center gap-1"
              >
                Add all to itinerary →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destination.attractions?.map((attraction) => (
                <div
                  key={attraction.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-lg transition-all flex flex-col"
                >
                  <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
                    <img
                      src={attraction.imageUrl}
                      alt={attraction.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white">
                      {attraction.category}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-black bg-white text-slate-900 shadow-sm">
                      {attraction.estimatedCost === 0 ? 'Free Entry' : `₹${attraction.estimatedCost}`}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-lg text-slate-900">{attraction.name}</h4>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{attraction.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{attraction.avgVisitMinutes} mins</span>
                      </div>

                      <button
                        onClick={handleCreateTripClick}
                        className="flex items-center gap-1 text-wander-600 font-bold hover:text-wander-700"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add to Trip
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: HOTELS & ACCOMMODATION */}
        {activeTab === 'hotels' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Recommended Stays & Resorts</h2>
              <p className="text-xs text-slate-500 mt-1">
                Hand-curated accommodations matching Wanderly's quality standards. Deep-link directly to booking partners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {destination.hotels?.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card flex flex-col sm:flex-row hover:shadow-lg transition-all"
                >
                  <div className="sm:w-2/5 aspect-[4/3] sm:aspect-auto relative overflow-hidden bg-slate-100">
                    <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="sm:w-3/5 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{hotel.rating.toFixed(1)}</span>
                        </span>
                        <div className="text-right">
                          <span className="text-xl font-black text-slate-900">₹{hotel.pricePerNight}</span>
                          <span className="text-[11px] text-slate-400 font-medium"> / night</span>
                        </div>
                      </div>

                      <h4 className="font-extrabold text-lg text-slate-900">{hotel.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{hotel.address}</span>
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {hotel.amenities.map((amenity, i) => (
                          <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Best Price Guarantee
                      </span>
                      <a
                        href={hotel.bookingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full transition flex items-center gap-1.5"
                      >
                        <span>Check Live Rates</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TRANSPORTATION */}
        {activeTab === 'transport' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Transportation & Getting to {destination.name}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Estimated travel options, travel times, and deep links to ticketing providers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transportData?.data?.map((opt, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-wander-50 text-wander-600 flex items-center justify-center mb-4">
                      {opt.type === 'flight' ? <Plane className="w-6 h-6" /> : opt.type === 'train' ? <Train className="w-6 h-6" /> : <Car className="w-6 h-6" />}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-wander-600">{opt.type}</span>
                    <h4 className="text-lg font-black text-slate-900 mt-0.5">{opt.operator}</h4>
                    <p className="text-xs text-slate-500 mt-1">{opt.durationLabel}</p>

                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-xs text-slate-400">Estimated Cost</div>
                      <div className="text-xl font-black text-slate-900">
                        ₹{opt.estimatedPriceMin} – ₹{opt.estimatedPriceMax}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{opt.frequency}</div>
                    </div>
                  </div>

                  <a
                    href={opt.bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>Search on {opt.bookingPartner}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: COMMUNITY REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Traveler Community Reviews</h2>
                <p className="text-xs text-slate-500 mt-1">Authentic feedback from travelers who explored {destination.name}.</p>
              </div>
              <button
                onClick={() => setReviewModalOpen(true)}
                className="px-5 py-2.5 bg-wander-500 hover:bg-wander-600 text-white text-xs font-bold rounded-full shadow-sm transition active:scale-95 flex items-center gap-1.5"
              >
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>Write a Review</span>
              </button>
            </div>

            <div className="space-y-4">
              {destination.reviews?.map((review) => (
                <div key={review.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-wander-100 text-wander-700 flex items-center justify-center font-bold text-sm">
                        {review.user?.name.charAt(0) || 'T'}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{review.user?.name || 'Traveler'}</h4>
                        <span className="text-[11px] text-slate-400 font-medium">Style: {review.travelerType}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 relative">
            <h3 className="text-xl font-black text-slate-900 mb-1">Write a Review for {destination.name}</h3>
            <p className="text-xs text-slate-500 mb-4">Share helpful tips for fellow wanderers.</p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400' : 'text-slate-200'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">{reviewRating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Traveler Persona</label>
                <select
                  value={reviewTravelerType}
                  onChange={(e) => setReviewTravelerType(e.target.value)}
                  className="w-full text-xs font-medium border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-wander-500"
                >
                  <option value="Solo">Solo Traveler</option>
                  <option value="Couple">Couple</option>
                  <option value="Family">Family with Kids</option>
                  <option value="Friends">Friends Group</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Review Comments</label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="What was the highlight of your visit? Any local secrets or tips?"
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-wander-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewMutation.isPending}
                  className="px-5 py-2.5 bg-wander-500 hover:bg-wander-600 text-white text-xs font-bold rounded-full shadow-sm transition active:scale-95 disabled:opacity-50"
                >
                  {reviewMutation.isPending ? 'Publishing...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
