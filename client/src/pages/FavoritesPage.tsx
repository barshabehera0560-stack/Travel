import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, Compass, MapPin, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '../store/useWishlistStore.js';

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, isLoading, fetchFavorites, removeFavorite } = useWishlistStore();

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <section className="bg-gradient-to-b from-amber-500/10 via-[#FAF8F5] to-[#FAF8F5] pt-12 pb-10 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-2">
                <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                <span>Saved Wishlist</span>
                {favorites.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold ml-1">
                    {favorites.length}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Your Saved Places & Sights
              </h1>
              <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
                Bookmark dream destinations, sights, and boutique hotels as you explore. Convert any saved place into an active itinerary with one click.
              </p>
            </div>

            {favorites.length > 0 && (
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition"
              >
                <Compass className="w-4 h-4 text-wander-500" />
                Explore More Places
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {isLoading && favorites.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Your wishlist is empty</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Tap the heart icon on any destination, hotel, or attraction card across Wanderly to bookmark it here for your travels.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-wander-500 hover:bg-wander-600 text-white font-bold text-xs rounded-full shadow-sm transition-all"
            >
              <Compass className="w-4 h-4" />
              Explore Destinations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <div
                key={fav.id || fav.itemId}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="aspect-[16/9] relative overflow-hidden bg-slate-100">
                  {fav.imageUrl ? (
                    <img
                      src={fav.imageUrl}
                      alt={fav.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                      <MapPin className="w-8 h-8" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white">
                    {fav.itemType}
                  </span>
                  <button
                    onClick={() => removeFavorite(fav)}
                    title="Remove from wishlist"
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-red-500 shadow-sm backdrop-blur-md transition group-hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 line-clamp-1">{fav.title}</h3>
                    {fav.subtitle && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{fav.subtitle}</p>}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    {fav.itemType === 'destination' ? (
                      <Link
                        to={`/destination/${fav.itemId}`}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900"
                      >
                        View Details
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-400">Saved item</span>
                    )}

                    <button
                      onClick={() => navigate(`/trips?newDestinationId=${fav.itemId}`)}
                      className="flex items-center gap-1 text-xs font-bold text-wander-600 hover:text-wander-700 transition"
                    >
                      <span>Create Trip</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
