import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Scale,
  Calendar,
  Users,
  DollarSign,
  Plus,
  Trash2,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import { apiClient } from '../api/client.js';
import { useCompareStore } from '../store/useCompareStore.js';
import { Destination } from '../types/index.js';

export const BudgetComparePage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDestinations, removeDestination, toggleDestination } = useCompareStore();

  const [durationDays, setDurationDays] = useState(5);
  const [travelerCount, setTravelerCount] = useState(2);
  const [budgetTier, setBudgetTier] = useState(2);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Fetch all destinations for candidate picker
  const { data: allDestData } = useQuery({
    queryKey: ['all-destinations-picker'],
    queryFn: () => apiClient.getDestinations(),
  });

  const allDestinations: Destination[] = allDestData?.data || [];

  // Default candidate destinations if none selected in tray
  useEffect(() => {
    if (selectedDestinations.length === 0 && allDestinations.length >= 2) {
      toggleDestination(allDestinations[0]);
      toggleDestination(allDestinations[1]);
    }
  }, [allDestinations, selectedDestinations.length, toggleDestination]);

  const destinationIds = selectedDestinations.map((d: Destination) => d.id);

  // Run comparison query
  const { data: compareData, isLoading } = useQuery({
    queryKey: ['compare-budget', destinationIds, durationDays, travelerCount, budgetTier],
    queryFn: () =>
      apiClient.compareBudget({
        destinationIds,
        durationDays,
        travelerCount,
        budgetTier,
      }),
    enabled: destinationIds.length >= 2,
  });

  const comparisons = compareData?.data?.comparisons || [];

  // Find lowest cost destination for winner badge
  const lowestCostDest =
    comparisons.length > 0
      ? [...comparisons].sort((a, b) => a.grandTotal - b.grandTotal)[0]
      : null;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <section className="bg-gradient-to-b from-amber-500/10 via-[#FAF8F5] to-[#FAF8F5] pt-12 pb-10 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wander-100 text-wander-800 text-xs font-bold mb-2">
                <Scale className="w-3.5 h-3.5 text-wander-600" />
                <span>Side-by-Side Budget Comparator</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Compare Destinations & Costs
              </h1>
              <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
                Transparent multi-destination financial modeling across lodging, transport, dining, and sights. Adjust sliders to see live recalculations.
              </p>
            </div>

            <button
              onClick={() => setPickerOpen(!pickerOpen)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full shadow-sm transition active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add / Change Destinations</span>
            </button>
          </div>

          {/* Destination Selector Tray Modal/Drawer */}
          {pickerOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-5 bg-white rounded-3xl border border-slate-200 shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select 2 or 3 destinations to compare:
                </span>
                <button
                  onClick={() => setPickerOpen(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-800"
                >
                  Done
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                {allDestinations.map((dest: Destination) => {
                  const active = selectedDestinations.some((d: Destination) => d.id === dest.id);
                  return (
                    <button
                      key={dest.id}
                      onClick={() => toggleDestination(dest)}
                      className={`p-2 rounded-2xl border text-center transition flex flex-col items-center ${
                        active
                          ? 'border-wander-500 bg-wander-50/70 ring-2 ring-wander-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={dest.imageUrl} alt={dest.name} className="w-12 h-12 rounded-xl object-cover mb-1.5" />
                      <span className="text-xs font-bold text-slate-800 truncate w-full">{dest.name}</span>
                      <span className="text-[10px] text-slate-400 truncate w-full">{dest.country}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Interactive Calculation Controls */}
          <div className="mt-8 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Control 1: Duration Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-wander-500" />
                  Trip Duration
                </span>
                <span className="text-sm font-black text-wander-600">{durationDays} Days</span>
              </div>
              <input
                type="range"
                min={2}
                max={14}
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-wander-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Weekend (2d)</span>
                <span>1 Week (7d)</span>
                <span>Extended (14d)</span>
              </div>
            </div>

            {/* Control 2: Travelers Count */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-wander-500" />
                  Travelers
                </span>
                <span className="text-sm font-black text-wander-600">{travelerCount} Person{travelerCount > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTravelerCount(num)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                      travelerCount === num
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Calculates shared room savings</p>
            </div>

            {/* Control 3: Travel Budget Tier */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-wander-500" />
                  Comfort Tier
                </span>
                <span className="text-xs font-black text-slate-700">
                  {budgetTier === 1 ? 'Budget (₹)' : budgetTier === 2 ? 'Moderate (₹₹)' : 'Luxury (₹₹₹)'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 1, label: '₹ Budget' },
                  { id: 2, label: '₹₹ Moderate' },
                  { id: 3, label: '₹₹₹ Luxury' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setBudgetTier(tier.id)}
                    className={`py-1.5 rounded-xl text-xs font-bold transition text-center ${
                      budgetTier === tier.id
                        ? 'bg-wander-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Adjusts hotel quality and dining scale</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparisons Display */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {selectedDestinations.length < 2 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto">
            <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">Select at least 2 destinations</h3>
            <p className="text-xs text-slate-500 mt-1">
              Choose candidate places to see side-by-side price estimates and cost breakdowns.
            </p>
            <button
              onClick={() => setPickerOpen(true)}
              className="mt-4 px-5 py-2.5 bg-wander-500 text-white font-bold text-xs rounded-full"
            >
              Choose Destinations
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {comparisons.map((c) => {
              const isWinner = lowestCostDest?.destinationId === c.destinationId;

              return (
                <div
                  key={c.destinationId}
                  className={`bg-white rounded-3xl overflow-hidden border transition-all flex flex-col justify-between shadow-card relative ${
                    isWinner ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200/80'
                  }`}
                >
                  {isWinner && (
                    <div className="bg-emerald-500 text-white text-[11px] font-extrabold uppercase tracking-wider py-1.5 px-4 text-center flex items-center justify-center gap-1.5">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>Best Value Destination</span>
                    </div>
                  )}

                  {/* Destination Top Banner */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                    <img src={c.imageUrl} alt={c.destinationName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => removeDestination(c.destinationId)}
                        title="Remove destination"
                        className="p-1.5 rounded-full bg-black/50 text-white/80 hover:text-white backdrop-blur-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-wander-400">
                        {c.country} • {c.category}
                      </span>
                      <h3 className="text-2xl font-black text-white">{c.destinationName}</h3>
                    </div>
                  </div>

                  {/* Grand Total & Per Person Card */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 font-medium">Estimated Total Trip</span>
                        <div className="text-3xl font-black text-slate-900">₹{c.grandTotal.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-medium">Per Person</span>
                        <div className="text-lg font-black text-wander-600">₹{c.perPersonTotal.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Breakdown Progress Bars */}
                    <div className="space-y-3.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Cost Breakdown ({durationDays} Days, {travelerCount} Travelers)
                      </h4>

                      {/* Accommodation */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-700">Stay & Accommodation</span>
                          <span className="font-bold text-slate-900">₹{c.breakdown.accommodation.amount}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-wander-500 rounded-full"
                            style={{ width: `${c.breakdown.accommodation.percent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400">{c.breakdown.accommodation.details}</span>
                      </div>

                      {/* Transport */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-700">Flights & Transport</span>
                          <span className="font-bold text-slate-900">₹{c.breakdown.transport.amount}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sky-500 rounded-full"
                            style={{ width: `${c.breakdown.transport.percent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400">{c.breakdown.transport.details}</span>
                      </div>

                      {/* Food */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-700">Food & Dining</span>
                          <span className="font-bold text-slate-900">₹{c.breakdown.food.amount}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${c.breakdown.food.percent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400">{c.breakdown.food.details}</span>
                      </div>

                      {/* Activities */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-700">Sights & Activities</span>
                          <span className="font-bold text-slate-900">₹{c.breakdown.activities.amount}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${c.breakdown.activities.percent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400">{c.breakdown.activities.details}</span>
                      </div>
                    </div>

                    {/* Action CTA */}
                    <div className="pt-4 border-t border-slate-100">
                      <button
                        onClick={() => navigate(`/trips?newDestinationId=${c.destinationId}`)}
                        className="w-full py-3 bg-gradient-to-r from-wander-500 to-wander-600 hover:from-wander-600 hover:to-wander-700 text-white text-xs font-extrabold rounded-2xl shadow-float transition flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <span>Build Itinerary for {c.destinationName}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
