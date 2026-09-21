import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, DollarSign, Image, FileText, CheckCircle2 } from 'lucide-react';
import { Attraction, Destination } from '../../types/index.js';
import { apiClient } from '../../api/client.js';

interface AttractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  destinations: Destination[];
  defaultDestinationId?: string;
  attractionToEdit?: Attraction | null;
}

export const AttractionModal: React.FC<AttractionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  destinations,
  defaultDestinationId,
  attractionToEdit,
}) => {
  const isEditing = Boolean(attractionToEdit);

  const [formData, setFormData] = useState({
    destinationId: defaultDestinationId || (destinations[0]?.id || ''),
    name: '',
    category: 'Heritage',
    description: '',
    lat: 26.9855,
    lng: 75.8513,
    avgVisitMinutes: 120,
    estimatedCost: 500,
    imageUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (attractionToEdit) {
      setFormData({
        destinationId: attractionToEdit.destinationId,
        name: attractionToEdit.name,
        category: attractionToEdit.category,
        description: attractionToEdit.description,
        lat: attractionToEdit.lat,
        lng: attractionToEdit.lng,
        avgVisitMinutes: attractionToEdit.avgVisitMinutes,
        estimatedCost: attractionToEdit.estimatedCost,
        imageUrl: attractionToEdit.imageUrl,
      });
    } else {
      setFormData({
        destinationId: defaultDestinationId || (destinations[0]?.id || ''),
        name: '',
        category: 'Heritage',
        description: '',
        lat: 26.9855,
        lng: 75.8513,
        avgVisitMinutes: 120,
        estimatedCost: 500,
        imageUrl: '',
      });
    }
  }, [attractionToEdit, defaultDestinationId, destinations, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        lat: Number(formData.lat),
        lng: Number(formData.lng),
        avgVisitMinutes: Number(formData.avgVisitMinutes),
        estimatedCost: Number(formData.estimatedCost),
      };

      if (isEditing && attractionToEdit) {
        await apiClient.updateAttraction(attractionToEdit.id, payload);
      } else {
        await apiClient.createAttraction(payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save attraction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 my-8">
        <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-wander-700 p-6 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-wander-400">Attraction Management</span>
            <h3 className="text-2xl font-black mt-0.5">
              {isEditing ? `Edit ${attractionToEdit?.name}` : 'Add Attraction'}
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
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Destination Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Destination *</label>
            <select
              value={formData.destinationId}
              onChange={(e) => setFormData({ ...formData, destinationId: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none bg-white"
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.region}, {d.country})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Attraction Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Amber Palace"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none bg-white"
              >
                <option value="Heritage">Heritage</option>
                <option value="Palace">Palace</option>
                <option value="Fort">Fort</option>
                <option value="Temple">Temple</option>
                <option value="Museum">Museum</option>
                <option value="Nature">Nature</option>
                <option value="Market">Market</option>
                <option value="Activity">Activity</option>
              </select>
            </div>

            {/* Avg Visit Minutes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Visit Duration (Minutes) *</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min={15}
                  step={15}
                  required
                  value={formData.avgVisitMinutes}
                  onChange={(e) => setFormData({ ...formData, avgVisitMinutes: parseInt(e.target.value) || 60 })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Estimated Cost in INR */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Ticket / Entry (₹) *</label>
              <div className="relative">
                <span className="text-slate-400 font-bold absolute left-3 top-2 text-sm">₹</span>
                <input
                  type="number"
                  min={0}
                  step={50}
                  required
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({ ...formData, estimatedCost: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Lat */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Latitude</label>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Longitude</label>
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

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Image URL *</label>
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

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Highlight key points of this attraction..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
            />
          </div>

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
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Attraction' : 'Create Attraction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
