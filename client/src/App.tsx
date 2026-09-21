import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { FloatingCompareBar } from './components/layout/FloatingCompareBar.js';
import { AuthModal } from './components/auth/AuthModal.js';
import { PreferencesQuizModal } from './components/auth/PreferencesQuizModal.js';
import { AIChatbotModal } from './components/chat/AIChatbotModal.js';
import { DiscoverPage } from './pages/DiscoverPage.js';
import { DestinationDetailPage } from './pages/DestinationDetailPage.js';
import { TripPlannerPage } from './pages/TripPlannerPage.js';
import { BudgetComparePage } from './pages/BudgetComparePage.js';
import { FavoritesPage } from './pages/FavoritesPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { AdminDashboard } from './pages/admin/AdminDashboard.js';
import { useAuthStore } from './store/useAuthStore.js';
import { useWishlistStore } from './store/useWishlistStore.js';

export const App: React.FC = () => {
  const { initAuth } = useAuthStore();
  const { fetchFavorites, toastMessage, clearToast } = useWishlistStore();

  useEffect(() => {
    initAuth();
    fetchFavorites();
  }, [initAuth, fetchFavorites]);

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DiscoverPage />} />
            <Route path="/destination/:id" element={<DestinationDetailPage />} />
            <Route path="/trips" element={<TripPlannerPage />} />
            <Route path="/compare" element={<BudgetComparePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <FloatingCompareBar />
        <AIChatbotModal />
        <Footer />

        {/* Global Modals & Notifications */}
        <AuthModal />
        <PreferencesQuizModal />

        {/* Wishlist Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-3 border border-slate-700/60 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <span className="text-sm font-semibold">{toastMessage}</span>
            <button
              onClick={clearToast}
              className="text-slate-400 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded-full hover:bg-slate-800 transition"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;
