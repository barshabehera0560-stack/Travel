import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Globe,
  Users,
  Compass,
  Star,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Shield,
  ShieldCheck,
  AlertTriangle,
  Search,
  ExternalLink,
  MapPin,
  Calendar,
  Building,
  Check,
  Filter,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  KeyRound,
  Activity,
  Database,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { apiClient } from '../../api/client.js';
import {
  AdminDashboardStats,
  AdminUser,
  AdminReview,
  AdminTrip,
  Destination,
  Attraction,
  Hotel,
} from '../../types/index.js';
import { DestinationModal } from '../../components/admin/DestinationModal.js';
import { AttractionModal } from '../../components/admin/AttractionModal.js';
import { HotelModal } from '../../components/admin/HotelModal.js';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, login, logout, demoAdminLogin, isLoading: isAuthLoading } = useAuthStore();
  const isAdminOrMod = user?.role === 'admin' || user?.role === 'moderator';
  const isSuperAdmin = user?.role === 'admin';

  // Professional Admin Login Form States
  const [adminEmail, setAdminEmail] = useState('admin@wanderly.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Authentication Handlers
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) {
      setLoginError('Please provide both administrator email and password.');
      return;
    }
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      await login(adminEmail.trim(), adminPassword.trim());
    } catch (err: any) {
      setLoginError(err?.message || 'Invalid administrator credentials. Access denied.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleQuickDemoAdmin = async () => {
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      await demoAdminLogin();
    } catch (err: any) {
      setLoginError(err?.message || 'Demo admin authentication failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminSignOut = () => {
    logout();
    navigate('/');
  };

  // Navigation tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'destinations' | 'attractions-hotels' | 'reviews' | 'users' | 'trips'
  >('overview');

  // Data states
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [reviewsList, setReviewsList] = useState<AdminReview[]>([]);
  const [tripsList, setTripsList] = useState<AdminTrip[]>([]);

  // Detailed attractions & hotels for a selected destination
  const [selectedDestIdForAssets, setSelectedDestIdForAssets] = useState<string>('');
  const [activeAssetSubTab, setActiveAssetSubTab] = useState<'attractions' | 'hotels'>('attractions');
  const [currentDestinationDetails, setCurrentDestinationDetails] = useState<Destination | null>(null);

  // Note: if user is not admin, the dedicated 1-click barrier below is shown instead of auto-logging in

  // Loading & Action states
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modals
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);

  const [isAttrModalOpen, setIsAttrModalOpen] = useState(false);
  const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(null);

  const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  // Flash toast helper
  const showToast = (msg: string, isError = false) => {
    if (isError) {
      setActionErrorMessage(msg);
      setTimeout(() => setActionErrorMessage(null), 4000);
    } else {
      setActionSuccessMessage(msg);
      setTimeout(() => setActionSuccessMessage(null), 4000);
    }
  };

  // Fetch data
  const loadAllAdminData = async () => {
    if (!isAdminOrMod) return;
    setIsLoading(true);
    try {
      const [statsRes, destsRes, usersRes, reviewsRes, tripsRes] = await Promise.all([
        apiClient.getAdminStats(),
        apiClient.getDestinations(),
        isSuperAdmin ? apiClient.getAdminUsers() : Promise.resolve({ data: [] }),
        apiClient.getAdminReviews(),
        apiClient.getAdminTrips(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (destsRes.success) {
        setDestinations(destsRes.data);
        if (destsRes.data.length > 0 && !selectedDestIdForAssets) {
          setSelectedDestIdForAssets(destsRes.data[0].id);
        }
      }
      if (usersRes.data) setUsersList(usersRes.data);
      if (reviewsRes.success) setReviewsList(reviewsRes.data);
      if (tripsRes.success) setTripsList(tripsRes.data);
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Error loading administrative data.', true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminOrMod) {
      loadAllAdminData();
    }
  }, [isAdminOrMod, isSuperAdmin]);

  // Load destination details when selecting for asset management
  useEffect(() => {
    if (selectedDestIdForAssets && (activeTab === 'attractions-hotels' || activeTab === 'destinations')) {
      apiClient.getDestinationById(selectedDestIdForAssets).then((res) => {
        if (res.success) {
          setCurrentDestinationDetails(res.data);
        }
      });
    }
  }, [selectedDestIdForAssets, activeTab]);

  // Filtered Destinations
  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const matchesSearch =
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || dest.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [destinations, searchQuery, selectedCategory]);

  // Delete Destination
  const handleDeleteDestination = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This will permanently delete its itinerary links, attractions, and reviews.`)) {
      return;
    }
    try {
      await apiClient.deleteDestination(id);
      showToast(`Destination "${name}" removed successfully.`);
      loadAllAdminData();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to delete destination.', true);
    }
  };

  // Delete Attraction
  const handleDeleteAttraction = async (id: string, name: string) => {
    if (!window.confirm(`Delete attraction "${name}"?`)) return;
    try {
      await apiClient.deleteAttraction(id);
      showToast(`Attraction "${name}" removed.`);
      // reload destination details
      if (selectedDestIdForAssets) {
        const res = await apiClient.getDestinationById(selectedDestIdForAssets);
        if (res.success) setCurrentDestinationDetails(res.data);
      }
      loadAllAdminData();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to delete attraction.', true);
    }
  };

  // Delete Hotel
  const handleDeleteHotel = async (id: string, name: string) => {
    if (!window.confirm(`Delete hotel "${name}"?`)) return;
    try {
      await apiClient.deleteHotel(id);
      showToast(`Hotel "${name}" removed.`);
      if (selectedDestIdForAssets) {
        const res = await apiClient.getDestinationById(selectedDestIdForAssets);
        if (res.success) setCurrentDestinationDetails(res.data);
      }
      loadAllAdminData();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to delete hotel.', true);
    }
  };

  // Delete Review
  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Delete this review? Destination rating will automatically recalculate.')) return;
    try {
      const res = await apiClient.deleteAdminReview(id);
      showToast(res.message || 'Review moderated and removed.');
      loadAllAdminData();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to delete review.', true);
    }
  };

  // Delete Trip
  const handleDeleteTrip = async (id: string, title: string) => {
    if (!window.confirm(`Delete itinerary "${title}"?`)) return;
    try {
      await apiClient.deleteAdminTrip(id);
      showToast(`Trip "${title}" removed.`);
      loadAllAdminData();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to delete trip.', true);
    }
  };

  // Update Role
  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await apiClient.updateUserRole(userId, newRole);
      showToast(`User role updated to ${newRole}.`);
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u))
      );
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to update user role.', true);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (userId === user?.id) {
      alert('You cannot delete your own logged-in admin account.');
      return;
    }
    if (!window.confirm(`Permanently delete account for "${userName}"?`)) return;
    try {
      await apiClient.deleteUser(userId);
      showToast(`User "${userName}" deleted.`);
      loadAllAdminData();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to delete user.', true);
    }
  };

  // If loading auth state, show smooth spinner
  if (isAuthLoading && !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-wander-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Connecting to Wanderly Operations Center...</p>
        </div>
      </div>
    );
  }

  // If unauthorized, show Enterprise Administrator Authentication Portal
  if (!isAdminOrMod) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-navy-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 py-10">
          {/* Left Column: Command Center Briefing */}
          <div className="lg:col-span-5 text-left text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-amber-500/30 text-amber-300 text-xs font-bold backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Wanderly Enterprise Security Suite</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Operations HQ & Platform Console
              </h1>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Centralized management portal for curated destinations, live weather telemetry, review moderation, and traveler fleet intelligence.
              </p>
            </div>

            {/* Live Security Metrics */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Role-Based Access Control</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-slate-400">Strict level-3 token authorization enabled</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Neon PostgreSQL Data Layer</div>
                  <p className="text-[11px] text-slate-400">37 Global Destinations & Indian Hubs</p>
                </div>
              </div>
            </div>

            {/* Audit warning */}
            <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-2 border-t border-slate-800">
              <Lock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>All administrative access attempts are cryptographically verified & audited.</span>
            </div>
          </div>

          {/* Right Column: Sleek Authentication Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Administrator Sign In</h2>
                    <p className="text-xs text-slate-400">Authenticate to enter mission control</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                  Admin Gateway
                </span>
              </div>

              {/* Error Banner */}
              {loginError && (
                <div className="mt-4 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Credentials Form */}
              <form onSubmit={handleAdminLoginSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Administrator Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@wanderly.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Security Passcode / Password
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">Default: admin123</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-11 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoggingIn || isAuthLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Unlock Administrative Console</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Fill / 1-Click Access Box */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Instant Demo Admin Access
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Verified Credentials
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleQuickDemoAdmin}
                    disabled={isLoggingIn || isAuthLoading}
                    className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>1-Click Sign In as Demo Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdminEmail('admin@wanderly.com');
                      setAdminPassword('admin123');
                      setLoginError(null);
                    }}
                    className="w-full sm:w-auto py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition whitespace-nowrap"
                    title="Auto-fill form inputs"
                  >
                    Auto-fill Form
                  </button>
                </div>
              </div>

              {/* Footer navigation */}
              <div className="mt-6 pt-4 border-t border-slate-800 text-center">
                <Link
                  to="/"
                  className="text-xs font-semibold text-slate-400 hover:text-white transition inline-flex items-center gap-1.5"
                >
                  <span>← Return to Public Discovery Page</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Admin Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-navy-900 text-white border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg font-black shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">Wanderly Admin Command Center</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  {user.role}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Fleet Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Authenticated as <strong className="text-slate-200">{user.name}</strong> ({user.email}) • Full CRUD & Moderation Controls • Indian Rupee (₹)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <button
              onClick={loadAllAdminData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition border border-white/10 active:scale-95 shadow-xs"
              title="Refresh platform data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition border border-slate-700 active:scale-95 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Site
            </Link>
            <button
              onClick={handleAdminSignOut}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 text-xs font-bold transition border border-red-500/30 active:scale-95 shadow-xs"
              title="Sign out of Administrator Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              Admin Sign Out
            </button>
          </div>
        </div>

        {/* Global Toast / Alert Notifications */}
        {actionSuccessMessage && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              {actionSuccessMessage}
            </div>
          </div>
        )}
        {actionErrorMessage && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
            <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-200 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              {actionErrorMessage}
            </div>
          </div>
        )}

        {/* Admin Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto border-t border-slate-800/80 pt-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Overview Analytics
          </button>
          <button
            onClick={() => setActiveTab('destinations')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'destinations'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            Destinations ({destinations.length})
          </button>
          <button
            onClick={() => setActiveTab('attractions-hotels')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'attractions-hotels'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building className="w-4 h-4" />
            Attractions & Hotels
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'reviews'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className="w-4 h-4" />
            Review Moderation ({reviewsList.length})
          </button>
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'users'
                  ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              Users & RBAC ({usersList.length})
            </button>
          )}
          <button
            onClick={() => setActiveTab('trips')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'trips'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            Global Trips ({tripsList.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold">Total Travelers</span>
                  <Users className="w-4 h-4 text-wander-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">{stats?.totals.users ?? 0}</div>
                <div className="text-[11px] text-slate-400 mt-1">Registered member accounts</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold">Destinations</span>
                  <Globe className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">{stats?.totals.destinations ?? 0}</div>
                <div className="text-[11px] text-slate-400 mt-1">Active curated hubs</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold">Itineraries Planned</span>
                  <Compass className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">{stats?.totals.trips ?? 0}</div>
                <div className="text-[11px] text-slate-400 mt-1">Platform user trips</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold">Platform Trip Volume</span>
                  <DollarSign className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  ₹{(stats?.totals.platformBudgetVolume ?? 0).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Calculated budget ceilings (INR)</div>
              </div>
            </div>

            {/* Secondary stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Breakdown */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs md:col-span-1">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-wander-600" />
                  Destinations by Category
                </h3>
                <div className="space-y-3">
                  {stats?.categoryDistribution.map((item) => (
                    <div key={item.category} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{item.category}</span>
                        <span>{item.count}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-wander-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, (item.count / (stats?.totals.destinations || 1)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Curated Attractions:</span>
                    <strong className="text-slate-800">{stats?.totals.attractions ?? 0}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Cached Hotels:</span>
                    <strong className="text-slate-800">{stats?.totals.hotels ?? 0}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Community Reviews:</span>
                    <strong className="text-slate-800">{stats?.totals.reviews ?? 0}</strong>
                  </div>
                </div>
              </div>

              {/* Recent Trips Feed */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-wander-600" />
                    Latest Planned Trips
                  </h3>
                  <button
                    onClick={() => setActiveTab('trips')}
                    className="text-xs font-bold text-wander-600 hover:text-wander-700"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {stats?.recentTrips.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4">No trips created yet.</p>
                  ) : (
                    stats?.recentTrips.map((trip: any) => (
                      <div
                        key={trip.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900">{trip.title}</p>
                          <p className="text-[11px] text-slate-500">
                            By {trip.user?.name || 'Traveler'} • {trip.destination?.name} ({trip.destination?.country})
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-slate-800 block">
                            ₹{trip.budgetCeiling.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400">{trip.travelerCount} travelers</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Recent Reviews Moderation Preview */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  Recent Community Reviews
                </h3>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs font-bold text-wander-600 hover:text-wander-700"
                >
                  Manage Reviews →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats?.recentReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">No reviews recorded yet.</p>
                ) : (
                  stats?.recentReviews.map((rev: any) => (
                    <div key={rev.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-800">{rev.user?.name}</span>
                          <span className="text-[11px] text-slate-400 ml-1.5">on {rev.destination?.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{rev.rating}/5</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">"{rev.comment}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DESTINATIONS */}
        {activeTab === 'destinations' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search destinations..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none bg-white"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Heritage">Heritage</option>
                  <option value="Nature">Nature</option>
                  <option value="Beach">Beach</option>
                  <option value="Spiritual">Spiritual</option>
                  <option value="Metropolitan">Metropolitan</option>
                  <option value="Adventure">Adventure</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingDestination(null);
                  setIsDestModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-wander-600 hover:bg-wander-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Destination
              </button>
            </div>

            {/* Destinations Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3.5">Destination</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Cost Tier</th>
                      <th className="px-4 py-3.5">Rating</th>
                      <th className="px-4 py-3.5">Assets</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDestinations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400">
                          No destinations found matching your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredDestinations.map((dest) => (
                        <tr key={dest.id} className="hover:bg-slate-50/70 transition">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={dest.imageUrl}
                                alt={dest.name}
                                className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block">{dest.name}</span>
                                <span className="text-[11px] text-slate-400">{dest.region}, {dest.country}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                              {dest.category}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-semibold text-slate-800">
                              {dest.avgCostTier === 1
                                ? '₹1,500 (Budget)'
                                : dest.avgCostTier === 2
                                ? '₹4,500 (Moderate)'
                                : '₹12,000 (Luxury)'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{dest.rating.toFixed(1)}</span>
                              <span className="text-[11px] text-slate-400 font-normal">({dest.reviewCount})</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <button
                              onClick={() => {
                                setSelectedDestIdForAssets(dest.id);
                                setActiveTab('attractions-hotels');
                              }}
                              className="text-wander-600 hover:text-wander-700 font-bold underline"
                            >
                              Manage Assets →
                            </button>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/destination/${dest.id}`}
                                target="_blank"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                title="View public page"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => {
                                  setEditingDestination(dest);
                                  setIsDestModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                                title="Edit destination"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              {isSuperAdmin && (
                                <button
                                  onClick={() => handleDeleteDestination(dest.id, dest.name)}
                                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                                  title="Delete destination"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ATTRACTIONS & HOTELS */}
        {activeTab === 'attractions-hotels' && (
          <div className="space-y-6">
            {/* Top Selector Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-wander-600" />
                <div>
                  <label className="text-xs font-bold text-slate-500 block">Select Destination</label>
                  <select
                    value={selectedDestIdForAssets}
                    onChange={(e) => setSelectedDestIdForAssets(e.target.value)}
                    className="mt-1 font-bold text-slate-900 border border-slate-200 rounded-xl px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-wander-500"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.region}, {d.country})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subtabs and Add actions */}
              <div className="flex items-center gap-3">
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveAssetSubTab('attractions')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeAssetSubTab === 'attractions'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Attractions ({currentDestinationDetails?.attractions?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveAssetSubTab('hotels')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeAssetSubTab === 'hotels'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Hotels ({currentDestinationDetails?.hotels?.length || 0})
                  </button>
                </div>

                {activeAssetSubTab === 'attractions' ? (
                  <button
                    onClick={() => {
                      setEditingAttraction(null);
                      setIsAttrModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-wander-600 hover:bg-wander-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Attraction
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingHotel(null);
                      setIsHotelModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-wander-600 hover:bg-wander-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Hotel
                  </button>
                )}
              </div>
            </div>

            {/* SubTab Content: Attractions */}
            {activeAssetSubTab === 'attractions' && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3.5">Attraction</th>
                        <th className="px-4 py-3.5">Category</th>
                        <th className="px-4 py-3.5">Visit Duration</th>
                        <th className="px-4 py-3.5">Ticket / Entry (₹)</th>
                        <th className="px-4 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {!currentDestinationDetails?.attractions?.length ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-slate-400">
                            No attractions added for this destination yet. Click "+ Add Attraction" above.
                          </td>
                        </tr>
                      ) : (
                        currentDestinationDetails.attractions.map((attr) => (
                          <tr key={attr.id} className="hover:bg-slate-50/70 transition">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={attr.imageUrl}
                                  alt={attr.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                                />
                                <div>
                                  <span className="font-bold text-slate-900 block">{attr.name}</span>
                                  <span className="text-[11px] text-slate-500 line-clamp-1">{attr.description}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                                {attr.category}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-slate-700 font-semibold">{attr.avgVisitMinutes} mins</td>
                            <td className="px-4 py-3.5 font-bold text-slate-900">
                              ₹{attr.estimatedCost.toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingAttraction(attr);
                                    setIsAttrModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                                  title="Edit attraction"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                {isSuperAdmin && (
                                  <button
                                    onClick={() => handleDeleteAttraction(attr.id, attr.name)}
                                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                                    title="Delete attraction"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SubTab Content: Hotels */}
            {activeAssetSubTab === 'hotels' && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3.5">Hotel Name</th>
                        <th className="px-4 py-3.5">Rate / Night (₹)</th>
                        <th className="px-4 py-3.5">Rating</th>
                        <th className="px-4 py-3.5">Address</th>
                        <th className="px-4 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {!currentDestinationDetails?.hotels?.length ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-slate-400">
                            No hotels recorded for this destination yet. Click "+ Add Hotel" above.
                          </td>
                        </tr>
                      ) : (
                        currentDestinationDetails.hotels.map((hotel) => (
                          <tr key={hotel.id} className="hover:bg-slate-50/70 transition">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={hotel.imageUrl}
                                  alt={hotel.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                                />
                                <div>
                                  <span className="font-bold text-slate-900 block">{hotel.name}</span>
                                  {hotel.bookingUrl && (
                                    <a
                                      href={hotel.bookingUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[10px] text-wander-600 hover:underline flex items-center gap-0.5"
                                    >
                                      Booking Link <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 font-bold text-slate-900">
                              ₹{hotel.pricePerNight.toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1 text-amber-500 font-bold">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                <span>{hotel.rating}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate">{hotel.address}</td>
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingHotel(hotel);
                                    setIsHotelModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                                  title="Edit hotel"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                {isSuperAdmin && (
                                  <button
                                    onClick={() => handleDeleteHotel(hotel.id, hotel.name)}
                                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                                    title="Delete hotel"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: REVIEW MODERATION */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Review Moderation Pipeline</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspect community reviews. Deleting bad or abusive reviews triggers immediate recalculation of destination rating scores.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                Total Reviews: {reviewsList.length}
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3.5">User</th>
                      <th className="px-4 py-3.5">Destination</th>
                      <th className="px-4 py-3.5">Rating</th>
                      <th className="px-4 py-3.5">Review Content</th>
                      <th className="px-4 py-3.5">Traveler Type</th>
                      <th className="px-4 py-3.5">Date</th>
                      <th className="px-4 py-3.5 text-right">Moderation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reviewsList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-400">
                          No reviews currently in the moderation queue.
                        </td>
                      </tr>
                    ) : (
                      reviewsList.map((rev) => (
                        <tr key={rev.id} className="hover:bg-slate-50/70 transition">
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-slate-900 block">{rev.user?.name || 'Anonymous'}</span>
                            <span className="text-[11px] text-slate-400">{rev.user?.email}</span>
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-slate-800">
                            {rev.destination?.name}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{rev.rating}/5</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 max-w-sm">
                            <p className="text-slate-700 italic line-clamp-2">"{rev.comment}"</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                              {rev.travelerType || 'General'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => handleDeleteReview(rev.id)}
                              className="px-2.5 py-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 font-bold text-[11px] transition inline-flex items-center gap-1"
                              title="Delete review and recalculate score"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: USERS & ROLES */}
        {activeTab === 'users' && isSuperAdmin && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">User Role Management (RBAC)</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Change role permissions dynamically: <strong>admin</strong>, <strong>moderator</strong>, or <strong>traveler</strong>.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                Active Users: {usersList.length}
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3.5">User</th>
                      <th className="px-4 py-3.5">Email</th>
                      <th className="px-4 py-3.5">Role Permission</th>
                      <th className="px-4 py-3.5">Activity</th>
                      <th className="px-4 py-3.5">Registered</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((usr) => (
                      <tr key={usr.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                              {usr.name.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-900">{usr.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">{usr.email}</td>
                        <td className="px-4 py-3.5">
                          <select
                            value={usr.role}
                            onChange={(e) => handleUpdateRole(usr.id, e.target.value)}
                            className={`px-2.5 py-1 text-xs font-bold rounded-xl border focus:outline-none focus:ring-1 ${
                              usr.role === 'admin'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : usr.role === 'moderator'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            <option value="traveler">Traveler</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Administrator</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5 text-slate-500">
                          {usr._count?.trips || 0} trips • {usr._count?.reviews || 0} reviews
                        </td>
                        <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                          {new Date(usr.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {usr.id !== user?.id && (
                            <button
                              onClick={() => handleDeleteUser(usr.id, usr.name)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                              title="Delete user account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: GLOBAL TRIPS OVERSIGHT */}
        {activeTab === 'trips' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Platform Itineraries Oversight</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monitor itineraries configured by users across destinations with Indian Rupee (₹) caps.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                Active Itineraries: {tripsList.length}
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3.5">Trip Title</th>
                      <th className="px-4 py-3.5">Destination</th>
                      <th className="px-4 py-3.5">Creator</th>
                      <th className="px-4 py-3.5">Budget Ceiling</th>
                      <th className="px-4 py-3.5">Travelers</th>
                      <th className="px-4 py-3.5">Dates</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tripsList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-400">
                          No trips created across the platform yet.
                        </td>
                      </tr>
                    ) : (
                      tripsList.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/70 transition">
                          <td className="px-4 py-3.5 font-bold text-slate-900">{t.title}</td>
                          <td className="px-4 py-3.5 font-semibold text-slate-700">
                            {t.destination?.name} ({t.destination?.country})
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-semibold text-slate-800 block">{t.user?.name}</span>
                            <span className="text-[11px] text-slate-400">{t.user?.email}</span>
                          </td>
                          <td className="px-4 py-3.5 font-bold text-slate-900">
                            ₹{t.budgetCeiling.toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3.5 text-slate-600">{t.travelerCount}</td>
                          <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                            {t.startDate} - {t.endDate}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => handleDeleteTrip(t.id, t.title)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                              title="Delete trip"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Destination Modal */}
      <DestinationModal
        isOpen={isDestModalOpen}
        onClose={() => setIsDestModalOpen(false)}
        onSuccess={() => {
          showToast(editingDestination ? 'Destination updated successfully.' : 'Destination created successfully.');
          loadAllAdminData();
        }}
        destinationToEdit={editingDestination}
      />

      {/* Attraction Modal */}
      <AttractionModal
        isOpen={isAttrModalOpen}
        onClose={() => setIsAttrModalOpen(false)}
        onSuccess={async () => {
          showToast(editingAttraction ? 'Attraction updated.' : 'Attraction added.');
          if (selectedDestIdForAssets) {
            const res = await apiClient.getDestinationById(selectedDestIdForAssets);
            if (res.success) setCurrentDestinationDetails(res.data);
          }
          loadAllAdminData();
        }}
        destinations={destinations}
        defaultDestinationId={selectedDestIdForAssets}
        attractionToEdit={editingAttraction}
      />

      {/* Hotel Modal */}
      <HotelModal
        isOpen={isHotelModalOpen}
        onClose={() => setIsHotelModalOpen(false)}
        onSuccess={async () => {
          showToast(editingHotel ? 'Hotel updated.' : 'Hotel added.');
          if (selectedDestIdForAssets) {
            const res = await apiClient.getDestinationById(selectedDestIdForAssets);
            if (res.success) setCurrentDestinationDetails(res.data);
          }
          loadAllAdminData();
        }}
        destinations={destinations}
        defaultDestinationId={selectedDestIdForAssets}
        hotelToEdit={editingHotel}
      />
    </div>
  );
};

export default AdminDashboard;
