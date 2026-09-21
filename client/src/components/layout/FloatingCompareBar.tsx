import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, X, ArrowRight } from 'lucide-react';
import { useCompareStore } from '../../store/useCompareStore.js';

export const FloatingCompareBar: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDestinations, removeDestination, clearAll } = useCompareStore();

  if (selectedDestinations.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4"
      >
        <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-3xl p-4 shadow-2xl border border-slate-700/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-wander-500/20 text-wander-400 flex items-center justify-center border border-wander-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Compare Tray</p>
              <p className="text-sm font-semibold text-white">
                {selectedDestinations.length} of 3 destinations selected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {selectedDestinations.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-2 bg-slate-800/90 pl-1.5 pr-2.5 py-1 rounded-full border border-slate-700 text-xs text-slate-200"
              >
                <img src={d.imageUrl} alt={d.name} className="w-6 h-6 rounded-full object-cover" />
                <span className="font-medium max-w-[80px] truncate">{d.name}</span>
                <button
                  onClick={() => removeDestination(d.id)}
                  className="text-slate-400 hover:text-red-400 transition ml-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearAll}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 transition"
            >
              Clear
            </button>
            <button
              onClick={() => navigate('/compare')}
              disabled={selectedDestinations.length < 2}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs shadow-lg transition ${
                selectedDestinations.length >= 2
                  ? 'bg-wander-500 hover:bg-wander-600 text-white cursor-pointer active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Compare
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
