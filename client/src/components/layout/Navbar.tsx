import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Heart, MapPin, Scale, User as UserIcon, Plus, LogOut, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useCompareStore } from '../../store/useCompareStore.js';
import { useWishlistStore } from '../../store/useWishlistStore.js';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, setAuthModalOpen, demoLogin, demoAdminLogin, setQuizModalOpen } = useAuthStore();
  const { selectedDestinations } = useCompareStore();
  const { favorites } = useWishlistStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isAdminOrMod = user?.role === 'admin' || user?.role === 'moderator';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/70 shadow-xs backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-3">
        {/* Brand Logo - Guaranteed Single Line */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group whitespace-nowrap">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-wander-600 via-wander-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-wander-500/20 group-hover:scale-105 transition-all duration-300">
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-navy-900 to-wander-600 bg-clip-text text-transparent">
              Wanderly
            </span>
            <span className="hidden xl:inline-flex text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-wander-50 text-wander-700 border border-wander-200/70">
              India • World
            </span>
          </div>
        </Link>

        {/* Center Navigation Capsule - Clean, Single Line, No Text Wrapping */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-full border border-slate-200/70 shadow-xs text-xs font-bold shrink-0">
          <Link
            to="/"
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
              isActive('/')
                ? 'bg-white text-wander-600 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span>Discover</span>
          </Link>

          <Link
            to="/trips"
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
              isActive('/trips')
                ? 'bg-white text-wander-600 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>Itineraries</span>
          </Link>

          <Link
            to="/compare"
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap relative ${
              isActive('/compare')
                ? 'bg-white text-wander-600 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Scale className="w-3.5 h-3.5 shrink-0" />
            <span>Budget Compare</span>
            {selectedDestinations.length > 0 && (
              <span className="w-4 h-4 bg-wander-500 text-white text-[10px] rounded-full flex items-center justify-center font-black shrink-0">
                {selectedDestinations.length}
              </span>
            )}
          </Link>

          <Link
            to="/favorites"
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap relative ${
              isActive('/favorites')
                ? 'bg-white text-wander-600 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 shrink-0 ${favorites.length > 0 ? 'text-red-500 fill-red-500' : ''}`} />
            <span>Wishlist</span>
            {favorites.length > 0 && (
              <span className="w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-black shrink-0">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Admin Panel Link */}
          <Link
            to="/admin"
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap font-extrabold ${
              isActive('/admin')
                ? 'bg-slate-900 text-amber-300 shadow-sm'
                : 'bg-amber-100/90 text-amber-900 hover:bg-amber-200 border border-amber-300/60'
            }`}
            title="Wanderly Admin & Operations Control Center"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Admin Panel</span>
          </Link>
        </nav>

        {/* User / Action Area - Strictly Single Line */}
        <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
          {user ? (
            <div className="flex items-center gap-2 shrink-0">
              {/* Quick switch to Admin if logged in as regular traveler */}
              {!isAdminOrMod && (
                <button
                  onClick={() => demoAdminLogin()}
                  className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-slate-900 text-amber-300 hover:bg-slate-800 transition shadow-xs whitespace-nowrap shrink-0"
                  title="Switch to Wanderly Administrator"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Demo Admin</span>
                </button>
              )}

              {/* User Pill: Name + Badge + Avatar in ONE Horizontal Line */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 py-1 pl-3 pr-1.5 rounded-full border transition-all shadow-xs whitespace-nowrap ${
                    isAdminOrMod
                      ? 'border-amber-300 bg-amber-50/80 hover:bg-amber-100/90 text-amber-950'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold leading-none">{user.name.split(' ')[0]}</span>
                  {isAdminOrMod && (
                    <span className="text-[10px] text-amber-800 bg-amber-200/90 font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-md leading-none">
                      Admin
                    </span>
                  )}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isAdminOrMod ? 'bg-slate-900 text-amber-300' : 'bg-wander-100 text-wander-700'
                    }`}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Signed in as ({user.role})</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                    </div>

                    {isAdminOrMod ? (
                      <>
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-navy-900 bg-amber-50/80 hover:bg-amber-100 transition border-b border-amber-100"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          Admin Control Center
                        </Link>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            demoLogin();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition text-left"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          Switch to Traveler Demo
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          demoAdminLogin();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-navy-900 bg-amber-50/80 hover:bg-amber-100 transition border-b border-amber-100 text-left"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        ⚡ Switch to Demo Admin
                      </button>
                    )}

                    <Link
                      to="/favorites"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} />
                      <span>My Wishlist</span>
                      {favorites.length > 0 && (
                        <span className="ml-auto text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                          {favorites.length}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      Traveler Profile
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        setQuizModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition text-left"
                    >
                      <Sparkles className="w-4 h-4 text-wander-500" />
                      Preferences Quiz
                    </button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
              <button
                onClick={() => demoLogin()}
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 hover:bg-amber-100 transition whitespace-nowrap shrink-0"
                title="Log in as demo traveler"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Demo
              </button>
              <button
                onClick={() => demoAdminLogin()}
                className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-slate-900 text-amber-300 hover:bg-slate-800 transition shadow-xs whitespace-nowrap shrink-0"
                title="Log in as Wanderly Administrator"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Demo Admin
              </button>
              <button
                onClick={() => setAuthModalOpen(true, 'login')}
                className="text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full text-slate-700 hover:text-slate-900 transition whitespace-nowrap shrink-0"
              >
                Sign In
              </button>
            </div>
          )}

          {/* New Trip CTA Button - Always Single Line */}
          <Link
            to="/trips"
            className="flex items-center gap-1.5 bg-gradient-to-r from-wander-500 to-wander-600 hover:from-wander-600 hover:to-wander-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-full shadow-md shadow-wander-500/25 hover:shadow-lg transition-all active:scale-95 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>New Trip</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
