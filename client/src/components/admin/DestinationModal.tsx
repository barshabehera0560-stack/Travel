import React, { useState, useEffect } from 'react';
import { X, Globe, MapPin, DollarSign, Image, Calendar, Sun, FileText, CheckCircle2 } from 'lucide-react';
import { Destination } from '../../types/index.js';
import { apiClient } from '../../api/client.js';

interface DestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  destinationToEdit?: Destination | null;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  destinationToEdit,
}) => {
  const isEditing = Boolean(destinationToEdit);

  const [formData, setFormData] = useState({
    name: '',
    country: 'India',
    region: 'North India',
    category: 'Heritage',
    avgCostTier: 2,
    bestSeason: 'Oct - Mar',
    climateSummary: 'Pleasant winter weather with daytime 20-25°C',
    description: '',
    imageUrl: '',
    heroImageUrl: '',
    lat: 26.9124,
    lng: 75.7873,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (destinationToEdit) {
      setFormData({
        name: destinationToEdit.name,
        country: destinationToEdit.country,
        region: destinationToEdit.region,
        category: destinationToEdit.category,
        avgCostTier: destinationToEdit.avgCostTier,
        bestSeason: destinationToEdit.bestSeason,
        climateSummary: destinationToEdit.climateSummary,
        description: destinationToEdit.description,
        imageUrl: destinationToEdit.imageUrl,
        heroImageUrl: destinationToEdit.heroImageUrl,
        lat: destinationToEdit.lat,
        lng: destinationToEdit.lng,
      });
    } else {
      setFormData({
        name: '',
        country: 'India',
        region: 'North India',
        category: 'Heritage',
        avgCostTier: 2,
        bestSeason: 'Oct - Mar',
        climateSummary: 'Pleasant winter weather with daytime 20-25°C',
        description: '',
        imageUrl: '',
        heroImageUrl: '',
        lat: 26.9124,
        lng: 75.7873,
      });
    }
  }, [destinationToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        avgCostTier: Number(formData.avgCostTier),
        lat: Number(formData.lat),
        lng: Number(formData.lng),
      };

      if (isEditing && destinationToEdit) {
        await apiClient.updateDestination(destinationToEdit.id, payload);
      } else {
        await apiClient.createDestination(payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save destination. Please check the inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-wander-700 p-6 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-wander-400">Destination Management</span>
            <h3 className="text-2xl font-black mt-0.5">
              {isEditing ? `Edit ${destinationToEdit?.name}` : 'Add New Destination'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Destination Name *</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Udaipur"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Country *</label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="India"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
              />
            </div>

            {/* Region */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Region / State *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="e.g. Rajasthan, North India"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Travel Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none bg-white"
              >
                <option value="Heritage">Heritage</option>
                <option value="Nature">Nature</option>
                <option value="Beach">Beach</option>
                <option value="Spiritual">Spiritual</option>
                <option value="Metropolitan">Metropolitan</option>
                <option value="Adventure">Adventure</option>
                <option value="Culinary">Culinary</option>
              </select>
            </div>

            {/* Cost Tier */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Average Cost Tier *</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={formData.avgCostTier}
                  onChange={(e) => setFormData({ ...formData, avgCostTier: Number(e.target.value) })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none bg-white"
                >
                  <option value={1}>Tier 1: Budget (~₹1,500/day)</option>
                  <option value={2}>Tier 2: Moderate (~₹4,500/day)</option>
                  <option value={3}>Tier 3: Luxury (~₹12,000/day)</option>
                </select>
              </div>
            </div>

            {/* Best Season */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Best Season to Visit *</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={formData.bestSeason}
                  onChange={(e) => setFormData({ ...formData, bestSeason: e.target.value })}
                  placeholder="e.g. Oct - Mar"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Lat */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Latitude Coordinate</label>
              <input
                type="number"
                step="any"
                required
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
              />
            </div>

            {/* Lng */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Longitude Coordinate</label>
              <input
                type="number"
                step="any"
                required
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Climate Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Climate Summary</label>
            <div className="relative">
              <Sun className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={formData.climateSummary}
                onChange={(e) => setFormData({ ...formData, climateSummary: e.target.value })}
                placeholder="e.g. Pleasant winter days (18-24°C), cool nights"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Image URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Card Image URL *</label>
              <div className="relative">
                <Image className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hero Banner Image URL *</label>
              <div className="relative">
                <Image className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="url"
                  required
                  value={formData.heroImageUrl}
                  onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Engaging summary of why travelers should visit this destination..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-wander-600 hover:bg-wander-700 text-white font-bold text-sm rounded-xl transition shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Destination' : 'Create Destination'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
