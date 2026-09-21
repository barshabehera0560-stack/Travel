import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, X, Compass, DollarSign, Heart } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';

export const PreferencesQuizModal: React.FC = () => {
  const { isQuizModalOpen, setQuizModalOpen, user, updatePreferences } = useAuthStore();

  const [travelStyle, setTravelStyle] = useState<string>(
    user?.preferences?.travelStyle || 'Explorer'
  );
  const [budgetTier, setBudgetTier] = useState<number>(
    user?.preferences?.budgetTier || 2
  );
  const [interests, setInterests] = useState<string[]>(
    user?.preferences?.interests || ['Heritage', 'Nature', 'Food']
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isQuizModalOpen) return null;

  const styles = [
    { id: 'Explorer', label: 'Solo / Explorer', desc: 'Curated adventures & off-the-beaten-path trails' },
    { id: 'Luxury', label: 'Luxury & Wellness', desc: 'Boutique ryokans, villas, fine dining & serene spas' },
    { id: 'Family', label: 'Family & Group', desc: 'Kid-friendly pace, safety, and bundled convenience' },
    { id: 'Backpacker', label: 'Backpacker & Budget', desc: 'Maximum flexibility, social stays & scenic transit' },
  ];

  const tiers = [
    { id: 1, label: '₹ Budget', desc: 'Under ₹2,500 / day (Hostels, street food, rail)' },
    { id: 2, label: '₹₹ Moderate', desc: '₹2,500 - ₹8,000 / day (Boutique hotels, guided tours)' },
    { id: 3, label: '₹₹₹ Luxury', desc: '₹8,000+ / day (5-star resorts, private transfers)' },
  ];

  const themes = ['Heritage', 'Nature', 'Beach', 'Mountain', 'Food', 'Adventure', 'Island', 'Urban'];

  const toggleInterest = (theme: string) => {
    if (interests.includes(theme)) {
      setInterests(interests.filter((i) => i !== theme));
    } else {
      setInterests([...interests, theme]);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await updatePreferences({
        travelStyle,
        budgetTier,
        interests,
      });
      setQuizModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 relative max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-wander-600 to-amber-500 p-6 text-white relative">
            <button
              onClick={() => setQuizModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              Traveler Intelligence Quiz
            </div>
            <h3 className="text-2xl font-black">Personalize Your Wanderly</h3>
            <p className="text-xs text-white/90 mt-1">
              Tell us how you like to wander so we can tailor destination suggestions and budget estimates.
            </p>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Section 1: Travel Style */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                <Compass className="w-4 h-4 text-wander-500" />
                1. What is your primary travel persona?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {styles.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setTravelStyle(s.id)}
                    className={`p-3 rounded-2xl border text-left transition relative ${
                      travelStyle === s.id
                        ? 'border-wander-500 bg-wander-50/50 ring-2 ring-wander-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-sm font-bold text-slate-800">{s.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                    {travelStyle === s.id && (
                      <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-wander-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 2: Budget Tier */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                <DollarSign className="w-4 h-4 text-wander-500" />
                2. Target Daily Budget Preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                {tiers.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setBudgetTier(t.id)}
                    className={`p-3 rounded-2xl border text-center transition ${
                      budgetTier === t.id
                        ? 'border-wander-500 bg-wander-50/60 ring-2 ring-wander-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-sm font-bold text-slate-800">{t.label}</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: Themes */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                <Heart className="w-4 h-4 text-wander-500" />
                3. Experiences that inspire you
              </label>
              <div className="flex flex-wrap gap-2">
                {themes.map((theme) => {
                  const active = interests.includes(theme);
                  return (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => toggleInterest(theme)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                        active
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {active && <Check className="w-3 h-3 text-wander-400" />}
                      {theme}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setQuizModalOpen(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2"
            >
              Skip for now
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-wander-500 hover:bg-wander-600 text-white text-xs font-bold rounded-full shadow-md transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
