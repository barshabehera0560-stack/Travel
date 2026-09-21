import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, Compass, DollarSign, Heart, MapPin, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, logout, setQuizModalOpen, setAuthModalOpen } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen max-w-md mx-auto px-4 py-24 text-center">
        <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-slate-800">You are not signed in</h2>
        <p className="text-xs text-slate-500 mt-2">
          Sign in or use 1-click demo login to manage your traveler preferences and itineraries.
        </p>
        <button
          onClick={() => setAuthModalOpen(true, 'login')}
          className="mt-6 px-6 py-2.5 bg-wander-500 text-white font-bold text-xs rounded-full shadow-md"
        >
          Sign In / Demo Login
        </button>
      </div>
    );
  }

  const prefs = user.preferences;

  return (
    <div className="min-h-screen pb-24">
      <section className="bg-gradient-to-b from-amber-500/10 via-[#FAF8F5] to-[#FAF8F5] pt-12 pb-10 border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-wander-500 to-amber-400 text-white flex items-center justify-center font-black text-3xl shadow-float">
                {user.name.charAt(0)}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-wander-600 bg-wander-50 px-2.5 py-0.5 rounded-full">
                  {user.role}
                </span>
                <h1 className="text-3xl font-black text-slate-900 mt-1">{user.name}</h1>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="px-4 py-2 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-bold rounded-full transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        {/* Preferences Summary Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Traveler Profile
              </span>
              <h3 className="text-2xl font-black text-slate-900">Your Travel Personality</h3>
            </div>
            <button
              onClick={() => setQuizModalOpen(true)}
              className="px-4 py-2 bg-wander-50 hover:bg-wander-100 text-wander-700 text-xs font-bold rounded-full border border-wander-200/60 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-wander-500" />
              <span>Update Preferences</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Compass className="w-4 h-4 text-wander-500" />
                <span>Travel Style</span>
              </div>
              <p className="text-lg font-black text-slate-800">{prefs?.travelStyle || 'Explorer'}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Focuses on culture & authentic sights</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span>Budget Tier</span>
              </div>
              <p className="text-lg font-black text-slate-800">
                {prefs?.budgetTier === 1 ? '₹ Budget' : prefs?.budgetTier === 3 ? '₹₹₹ Luxury' : '₹₹ Moderate'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Balances value and premium comfort</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Interests</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {prefs?.interests?.map((int) => (
                  <span key={int} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                    {int}
                  </span>
                )) || <span className="text-xs text-slate-400">Not set</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/trips"
            className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-card hover:shadow-lg transition flex items-center justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-black text-slate-900 group-hover:text-wander-600 transition">
                My Itineraries
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Manage scheduled trips and day timelines</p>
            </div>
          </Link>

          <Link
            to="/favorites"
            className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-card hover:shadow-lg transition flex items-center justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-black text-slate-900 group-hover:text-red-500 transition">
                Saved Wishlist
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Revisit bookmarked destinations and hotels</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
