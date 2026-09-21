import React, { useState, useEffect } from 'react';
import { X, MapPin, DollarSign, Image, Star, CheckCircle2, Link as LinkIcon, Building } from 'lucide-react';
import { Hotel, Destination } from '../../types/index.js';
import { apiClient } from '../../api/client.js';

interface HotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  destinations: Destination[];
  defaultDestinationId?: string;
  hotelToEdit?: Hotel | null;
}

export const HotelModal: React.FC<HotelModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  destinations,
  defaultDestinationId,
  hotelToEdit,
}) => {
  const isEditing = Boolean(hotelToEdit);

  const [formData, setFormData] = useState({
    destinationId: defaultDestinationId || (destinations[0]?.id || ''),
    name: '',
    pricePerNight: 4500,
    rating: 4.5,
    address: '',
    amenities: 'Free Wi-Fi, Pool, Spa, Breakfast Included, Heritage Courtyard',
    imageUrl: '',
    bookingUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hotelToEdit) {
      setFormData({
        destinationId: hotelToEdit.destinationId || defaultDestinationId || (destinations[0]?.id || ''),
        name: hotelToEdit.name,
        pricePerNight: hotelToEdit.pricePerNight,
        rating: hotelToEdit.rating,
        address: hotelToEdit.address,
        amenities: Array.isArray(hotelToEdit.amenities) ? hotelToEdit.amenities.join(', ') : '',
        imageUrl: hotelToEdit.imageUrl,
        bookingUrl: hotelToEdit.bookingUrl,
      });
    } else {
      setFormData({
        destinationId: defaultDestinationId || (destinations[0]?.id || ''),
        name: '',
        pricePerNight: 4500,
        rating: 4.5,
        address: '',
        amenities: 'Free Wi-Fi, Pool, Spa, Breakfast Included',
        imageUrl: '',
        bookingUrl: '',
      });
    }
  }, [hotelToEdit, defaultDestinationId, destinations, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const amenitiesArray = formData.amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        pricePerNight: Number(formData.pricePerNight),
        rating: Number(formData.rating),
        amenities: amenitiesArray,
      };

      if (isEditing && hotelToEdit) {
        await apiClient.updateHotel(hotelToEdit.id, payload);
      } else {
        await apiClient.createHotel(payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save hotel.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 my-8">
        <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-wander-700 p-6 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-wander-400">Hotel Management</span>
            <h3 className="text-2xl font-black mt-0.5">
              {isEditing ? `Edit ${hotelToEdit?.name}` : 'Add New Accommodation'}
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
            {/* Hotel Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hotel / Resort Name *</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Taj Lake Palace"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Price Per Night in INR */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price Per Night (₹) *</label>
              <div className="relative">
                <span className="text-slate-400 font-bold absolute left-3 top-2 text-sm">₹</span>
                <input
                  type="number"
                  min={500}
                  step={100}
                  required
                  value={formData.pricePerNight}
                  onChange={(e) => setFormData({ ...formData, pricePerNight: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rating (1 - 5) *</label>
              <div className="relative">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min={1}
                  max={5}
                  step={0.1}
                  required
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 5 })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Booking URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Booking Website URL</label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="url"
                  value={formData.bookingUrl}
                  onChange={(e) => setFormData({ ...formData, bookingUrl: e.target.value })}
                  placeholder="https://www.booking.com/..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Address / Landmark *</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Lake Pichola, Udaipur, Rajasthan"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Amenities (comma-separated)</label>
            <input
              type="text"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              placeholder="Free Wi-Fi, Swimming Pool, Spa, Airport Shuttle, Restaurant"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-wander-500 focus:outline-none"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hotel Image URL *</label>
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
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Hotel' : 'Create Hotel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
