import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, MapPin, Sun, Scale, ArrowUpRight } from 'lucide-react';
import { Destination } from '../../types/index.js';
import { useCompareStore } from '../../store/useCompareStore.js';
import { useWishlistStore } from '../../store/useWishlistStore.js';

interface DestinationCardProps {
  destination: Destination;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const { toggleDestination, isSelected } = useCompareStore();
  const { isFavorited, toggleFavorite } = useWishlistStore();
  const [isHovered, setIsHovered] = useState(false);

  const selectedForCompare = isSelected(destination.id);
  const favorited = isFavorited(destination.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite({
      itemType: 'destination',
      itemId: destination.id,
      title: destination.name,
      subtitle: `${destination.country} • ${destination.category}`,
      imageUrl: destination.imageUrl,
    });
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDestination(destination);
  };

  const costTierLabel = ['₹ Budget', '₹₹ Moderate', '₹₹₹ Luxury'][destination.avgCostTier - 1] || '₹₹ Moderate';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-xl transition-all flex flex-col h-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Media Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
            {destination.category}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Compare Button */}
            <button
              onClick={handleCompareClick}
              title={selectedForCompare ? 'Remove from comparison' : 'Add to budget comparison'}
              className={`p-2 rounded-full backdrop-blur-md transition shadow-sm ${
                selectedForCompare
                  ? 'bg-wander-500 text-white ring-2 ring-wander-300'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-wander-600'
              }`}
            >
              <Scale className="w-4 h-4" />
            </button>

            {/* Favorite Wishlist Button */}
            <button
              onClick={handleFavoriteClick}
              title={favorited ? 'Remove from Wishlist' : 'Save to Wishlist'}
              className={`p-2 rounded-full backdrop-blur-md transition shadow-sm ${
                favorited
                  ? 'bg-red-500 text-white hover:bg-red-600 scale-105'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-white text-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom Hero Info inside Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white z-10">
          <div className="flex items-center gap-1 text-white/90 text-xs font-semibold mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-wander-400" />
            <span>{destination.country}</span>
            <span className="text-white/50">•</span>
            <span>{destination.region}</span>
          </div>
          <h3 className="text-xl font-extrabold tracking-tight text-white drop-shadow-sm flex items-center justify-between">
            <span>{destination.name}</span>
            <ArrowUpRight className="w-5 h-5 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </h3>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {destination.description}
        </p>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {/* Rating */}
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <div className="flex items-center gap-0.5 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{destination.rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-400 font-normal">({destination.reviewCount})</span>
          </div>

          {/* Cost Tier */}
          <span className="font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full text-[11px]">
            {costTierLabel}
          </span>
        </div>

        {/* Best Season & Quick Action */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span className="truncate max-w-[150px]">{destination.bestSeason}</span>
          </div>

          <Link
            to={`/destination/${destination.id}`}
            className="text-xs font-bold text-wander-600 group-hover:text-wander-700 flex items-center gap-1"
          >
            Explore & Plan
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
