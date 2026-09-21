import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search,
  Compass,
  Sparkles,
  SlidersHorizontal,
  MapPin,
  TrendingUp,
  Sun,
  ShieldCheck,
  Scale,
  Bot,
  Send,
  ArrowRight,
  Star,
  IndianRupee,
  MessageSquare,
} from 'lucide-react';
import { apiClient } from '../api/client.js';
import { DestinationCard } from '../components/destinations/DestinationCard.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { useAIChatStore } from '../store/useAIChatStore.js';
import { Link, useNavigate } from 'react-router-dom';

export const DiscoverPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { openWithPrompt, toggleChat } = useAIChatStore();
  const [heroPrompt, setHeroPrompt] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCostTier, setSelectedCostTier] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'rating' | 'cost_asc' | 'cost_desc'>('rating');

  const handleHeroPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroPrompt.trim()) {
      toggleChat();
      return;
    }
    openWithPrompt(heroPrompt.trim());
    setHeroPrompt('');
  };

  const heroFeaturedDestinations = [
    {
      id: 'dest-kyoto',
      name: 'Kyoto',
      country: 'Japan',
      category: 'Heritage',
      dailyCostInr: 8500,
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
      prompt: 'Plan a 5-day trip to Kyoto under ₹60,000 with temples and food',
    },
    {
      id: 'dest-bali',
      name: 'Bali',
      country: 'Indonesia',
      category: 'Beach',
      dailyCostInr: 3500,
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
      prompt: 'Top romantic beach getaways and private villas in Bali',
    },
    {
      id: 'dest-paris',
      name: 'Paris',
      country: 'France',
      category: 'Romantic',
      dailyCostInr: 18000,
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
      prompt: 'Create a 4-day romantic Paris itinerary with budget in INR',
    },
  ];

  const { data: destinationsData, isLoading } = useQuery({
    queryKey: ['destinations', searchTerm, selectedCategory, selectedCostTier, sortBy],
    queryFn: () =>
      apiClient.getDestinations({
        search: searchTerm,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        avgCostTier: selectedCostTier,
        sortBy,
      }),
  });

  const categories = ['All', 'Heritage', 'Beach', 'Mountain', 'Island', 'Adventure', 'Urban'];

  const destinations = destinationsData?.data || [];

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-12 pb-10 sm:pb-14 bg-gradient-to-b from-amber-500/10 via-[#FAF8F5] to-[#FAF8F5] overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute top-10 right-10 w-80 h-80 bg-wander-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Heading, Search & Personalized Info */}
            <div className="lg:col-span-7 text-left">
              {/* Top Pill */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-amber-200/70 shadow-2xs text-xs font-bold text-amber-900 mb-5"
              >
                <Sparkles className="w-4 h-4 text-wander-500" />
                <span>AI-Powered Travel Intelligence & Day-Wise Planning</span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-[52px] font-black text-slate-900 tracking-tight leading-[1.12]"
              >
                One unified workspace to{' '}
                <span className="bg-gradient-to-r from-wander-500 via-amber-500 to-wander-600 bg-clip-text text-transparent">
                  discover, plan & wander.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl"
              >
                Compare real budgets side-by-side in Indian Rupees (₹), inspect live weather forecasts, and craft day-wise itineraries in minutes with WanderAI.
              </motion.p>

              {/* Search Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 max-w-xl"
              >
                <div className="bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200/80 flex flex-col sm:flex-row items-center gap-2">
                  <div className="flex items-center gap-2.5 px-3 py-1.5 flex-1 w-full">
                    <Search className="w-5 h-5 text-wander-500 shrink-0" />
                    <input
                      type="text"
                      placeholder="Where do you want to explore? (e.g. Kyoto, Bali, Paris...)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                    />
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-wander-500 to-wander-600 hover:from-wander-600 hover:to-wander-700 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-float transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Search Places</span>
                  </button>
                </div>
              </motion.div>

              {/* Quick AI Prompts below search */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Try Asking AI:</span>
                <button
                  type="button"
                  onClick={() => openWithPrompt('Plan a 5-day trip to Kyoto under ₹60,000')}
                  className="text-xs font-semibold bg-white/80 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200/80 hover:border-amber-300 px-3 py-1 rounded-full shadow-2xs transition active:scale-95"
                >
                  🌸 Kyoto under ₹60k
                </button>
                <button
                  type="button"
                  onClick={() => openWithPrompt('Top romantic beach destinations in Bali')}
                  className="text-xs font-semibold bg-white/80 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200/80 hover:border-amber-300 px-3 py-1 rounded-full shadow-2xs transition active:scale-95"
                >
                  🏖️ Bali Beaches
                </button>
                <button
                  type="button"
                  onClick={() => openWithPrompt('Budget mountain destinations with ₹ estimates')}
                  className="text-xs font-semibold bg-white/80 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200/80 hover:border-amber-300 px-3 py-1 rounded-full shadow-2xs transition active:scale-95"
                >
                  🏔️ Mountain Treks
                </button>
              </div>

              {/* Personalized User Notice */}
              {user?.preferences && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white/80 px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-2xs"
                >
                  <span>Personalized for {user.name} ({user.preferences.travelStyle} style)</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-wander-600 font-bold">Interests: {user.preferences.interests.join(', ')}</span>
                </motion.div>
              )}
            </div>

            {/* Right Column: WanderAI Interactive Showcase with Real Travel Images */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-b from-white via-white/95 to-amber-50/40 rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200/90 backdrop-blur-md relative overflow-hidden"
              >
                {/* Header with WanderAI branding and Live Indicator */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-wander-500 to-amber-400 flex items-center justify-center text-white shadow-md">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-slate-900">WanderAI Travel Concierge</h3>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Ask for day-by-day itineraries & ₹ budgets</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={toggleChat}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Chat</span>
                  </button>
                </div>

                {/* Quick Interactive Prompt Input */}
                <form onSubmit={handleHeroPromptSubmit} className="mt-4 flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Ask anything... (e.g. 5 days in Kyoto under ₹60k)"
                      value={heroPrompt}
                      onChange={(e) => setHeroPrompt(e.target.value)}
                      className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-wander-500/20 focus:border-wander-500 transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2.5 bg-gradient-to-r from-wander-500 to-wander-600 hover:from-wander-600 hover:to-wander-700 text-white font-bold text-xs rounded-2xl shadow-sm transition active:scale-95 flex items-center gap-1 shrink-0"
                    title="Ask WanderAI"
                  >
                    <span>Ask</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Featured Visual Travel Cards */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Featured Travel Inspirations</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">1-Click AI Trip Planning</span>
                  </div>

                  <div className="space-y-2.5">
                    {heroFeaturedDestinations.map((dest) => (
                      <div
                        key={dest.id}
                        className="group flex items-center justify-between p-2 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/70 hover:border-wander-300 hover:shadow-md transition-all duration-200"
                      >
                        {/* Image Thumbnail */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 shrink-0 relative">
                            <img
                              src={dest.imageUrl}
                              alt={dest.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              decoding="async"
                            />
                            <span className="absolute bottom-0.5 left-0.5 text-[8px] font-black uppercase px-1 bg-black/70 text-white rounded">
                              {dest.category}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-extrabold text-xs text-slate-900 truncate">{dest.name}</h4>
                              <span className="text-[11px] text-slate-400">• {dest.country}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] mt-0.5">
                              <span className="text-amber-600 font-bold flex items-center gap-0.5">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                                {dest.rating}
                              </span>
                              <span className="text-slate-300">|</span>
                              <span className="text-slate-600 font-semibold">
                                ₹{dest.dailyCostInr.toLocaleString('en-IN')}/day
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 shrink-0 pl-2">
                          <button
                            type="button"
                            onClick={() => openWithPrompt(dest.prompt)}
                            className="px-2.5 py-1.5 bg-gradient-to-r from-wander-500 to-amber-500 hover:from-wander-600 hover:to-amber-600 text-white rounded-xl text-[11px] font-bold shadow-2xs transition active:scale-95 flex items-center gap-1"
                            title="Ask WanderAI to plan a trip here"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Plan Trip</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/destination/${dest.id}`)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
                            title="View Destination Details"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature highlight footer pills */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-wander-500" />
                    Day-Wise Plans
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <IndianRupee className="w-3 h-3 text-emerald-600" />
                    Real INR Estimates
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Compass className="w-3 h-3 text-blue-500" />
                    Sights & Stays
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Discovery Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
        {/* Filter Controls Bar */}
        <div className="bg-white px-5 py-4 sm:px-6 sm:py-5 rounded-3xl border border-slate-200/80 shadow-card mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 w-full lg:w-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Right Side: Budget and Sort Filters */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end shrink-0">
              {/* Cost Tier Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-full text-xs font-bold shrink-0">
                <button
                  onClick={() => setSelectedCostTier(undefined)}
                  className={`px-3 py-1 rounded-full transition ${
                    selectedCostTier === undefined ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All ₹
                </button>
                <button
                  onClick={() => setSelectedCostTier(1)}
                  className={`px-2.5 py-1 rounded-full transition ${
                    selectedCostTier === 1 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ₹
                </button>
                <button
                  onClick={() => setSelectedCostTier(2)}
                  className={`px-2.5 py-1 rounded-full transition ${
                    selectedCostTier === 2 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ₹₹
                </button>
                <button
                  onClick={() => setSelectedCostTier(3)}
                  className={`px-2.5 py-1 rounded-full transition ${
                    selectedCostTier === 3 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ₹₹₹
                </button>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-semibold bg-slate-100 border border-slate-200/80 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-wander-500/20 focus:border-wander-500 cursor-pointer"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="cost_asc">Budget: Low to High</option>
                  <option value="cost_desc">Budget: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Destination Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : destinations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto my-12">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No destinations found</h3>
            <p className="text-xs text-slate-500 mt-1">Try relaxing your search keywords or resetting the filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedCostTier(undefined);
              }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        )}

        {/* Feature Highlights Banner */}
        <section className="mt-20 bg-gradient-to-br from-slate-900 via-navy-900 to-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-wander-400 flex items-center justify-center flex-shrink-0">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-white">Side-by-Side Comparison</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Can’t decide between Bali and Kyoto? Compare itemized costs across hotels, flights, and activities side-by-side.
                </p>
                <Link to="/compare" className="inline-block mt-3 text-xs font-bold text-wander-400 hover:text-wander-300">
                  Open Budget Comparator →
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-white">Live Weather Intelligence</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Never pack the wrong layers. Get 5-day forecasts, climate recommendations, and smart packing suggestions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-white">Smart Auto-Itinerary</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Generate day-wise schedules in seconds, with geographic grouping of sights, suggested hotels, and dining stops.
                </p>
                <Link to="/trips" className="inline-block mt-3 text-xs font-bold text-emerald-400 hover:text-emerald-300">
                  Build Trip Itinerary →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
