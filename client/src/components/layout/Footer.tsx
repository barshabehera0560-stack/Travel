import React from 'react';
import { Compass, Heart, Shield, Sparkles, MapPin, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-wander-500 to-wander-400 flex items-center justify-center text-white shadow-float">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">Wanderly</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              The unified workspace for modern travelers. Discover breathtaking destinations, compare real budgets, and create day-wise itineraries without friction.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Verified Insights
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
                <Sparkles className="w-3.5 h-3.5 text-wander-400" />
                Smart Planning
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-wander-400 transition flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> All Destinations
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-wander-400 transition flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-500" /> Budget Comparator
                </Link>
              </li>
              <li>
                <Link to="/trips" className="hover:text-wander-400 transition flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-slate-500" /> Trip Itineraries
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-wander-400 transition flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-slate-500" /> Saved Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Destination Collections */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Trending Styles</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="text-slate-400 hover:text-white transition cursor-pointer">Heritage & Cultural Temples</li>
              <li className="text-slate-400 hover:text-white transition cursor-pointer">Alpine Hiking & National Parks</li>
              <li className="text-slate-400 hover:text-white transition cursor-pointer">Tropical Island Escapes</li>
              <li className="text-slate-400 hover:text-white transition cursor-pointer">Gastronomy & Foodie Capitals</li>
              <li className="text-slate-400 hover:text-white transition cursor-pointer">Coastal Roadtrips & Wildlife</li>
            </ul>
          </div>

          {/* Travel Intelligence */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Travel Intelligence</h4>
            <p className="text-sm text-slate-400 mb-4">
              Real-time weather telemetry, transparent budget models, and verified community reviews in one seamless experience.
            </p>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-300">
              <p className="font-semibold text-white mb-1">Built for modern wanderers</p>
              <p className="text-slate-400">Replace 8 open tabs with one intuitive visual workspace.</p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Wanderly Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Architecture</span>
            <span>System Status</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
