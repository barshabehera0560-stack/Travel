import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, authMode, login, register, demoLogin, demoAdminLogin, isLoading } = useAuthStore();
  const [mode, setMode] = useState<'login' | 'register'>(authMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Sync mode whenever modal is opened
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authMode);
      setError(null);
    }
  }, [isAuthModalOpen, authMode]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleDemo = async () => {
    setError(null);
    try {
      await demoLogin();
    } catch (err: any) {
      setError('Demo login failed. Please try again.');
    }
  };

  const handleDemoAdmin = async () => {
    setError(null);
    try {
      await demoAdminLogin();
    } catch (err: any) {
      setError('Admin demo login failed. Please try again.');
    }
  };

  const fillTravelerCreds = () => {
    setEmail('priya@wanderly.com');
    setPassword('password123');
    setError(null);
  };

  const fillAdminCreds = () => {
    setEmail('admin@wanderly.com');
    setPassword('admin123');
    setError(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 relative"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-900 via-navy-900 to-slate-800 p-6 text-white relative">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs uppercase tracking-wider font-bold text-wander-400">Welcome to Wanderly</span>
            <h3 className="text-2xl font-black mt-1">
              {mode === 'login' ? 'Sign in to your account' : 'Start your journey'}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Save dream itineraries, sync favorites, and get personalized recommendations.
            </p>
          </div>

          {/* Quick Demo Login Banner */}
          <div className="p-3.5 bg-amber-50/80 border-b border-amber-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
              <Sparkles className="w-4 h-4 text-wander-500" />
              <span>Instant demo:</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleDemo}
                disabled={isLoading}
                className="text-xs font-bold px-2.5 py-1.5 rounded-full bg-white border border-amber-200 text-slate-700 hover:bg-slate-50 transition shadow-xs active:scale-95 disabled:opacity-50"
              >
                Traveler
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                disabled={isLoading}
                className="text-xs font-bold px-3 py-1.5 rounded-full bg-wander-600 text-white hover:bg-wander-700 transition shadow-xs active:scale-95 disabled:opacity-50 flex items-center gap-1"
              >
                <span>⚡ Demo Admin</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition ${
                mode === 'login' ? 'border-wander-500 text-wander-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition ${
                mode === 'register' ? 'border-wander-500 text-wander-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Chen"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-wander-500/20 focus:border-wander-500 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="wanderer@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-wander-500/20 focus:border-wander-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-wander-500/20 focus:border-wander-500 transition"
                />
              </div>
            </div>

            {mode === 'login' && (
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs space-y-1.5">
                <div className="font-bold text-slate-700 flex items-center justify-between">
                  <span>Quick autofill test accounts:</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={fillTravelerCreds}
                    className="px-2.5 py-1 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-lg text-[11px] font-bold text-slate-700 transition shadow-xs"
                  >
                    Traveler (Priya)
                  </button>
                  <button
                    type="button"
                    onClick={fillAdminCreds}
                    className="px-2.5 py-1 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-lg text-[11px] font-bold text-slate-700 transition shadow-xs flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3 h-3 text-amber-500" />
                    Admin (Operations)
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-wander-500 to-wander-600 hover:from-wander-600 hover:to-wander-700 text-white font-bold rounded-xl shadow-float hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 text-sm"
            >
              {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Join Wanderly'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
