import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Compass,
  Plus,
  Trash2,
  Sparkles,
  Clock,
  Printer,
  ChevronRight,
  Hotel as HotelIcon,
  Utensils,
  Plane,
  Camera,
  X,
} from 'lucide-react';
import { apiClient } from '../api/client.js';
import { Trip, ItineraryDay, ItineraryItem, Destination } from '../types/index.js';

export const TripPlannerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const newDestIdParam = searchParams.get('newDestinationId');

  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [activeDayNumber, setActiveDayNumber] = useState(1);
  const [createModalOpen, setCreateModalOpen] = useState(!!newDestIdParam);
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);

  // Form states for creating a new trip
  const [newTitle, setNewTitle] = useState('');
  const [newDestId, setNewDestId] = useState(newDestIdParam || 'dest-kyoto');
  const [newStartDate, setNewStartDate] = useState('2026-10-15');
  const [newEndDate, setNewEndDate] = useState('2026-10-19');
  const [newTravelers, setNewTravelers] = useState(2);
  const [newBudget, setNewBudget] = useState(2200);
  const [newAutoGenerate, setNewAutoGenerate] = useState(true);

  // Form states for adding an itinerary item
  const [itemType, setItemType] = useState<'attraction' | 'dining' | 'hotel' | 'transport' | 'custom'>('attraction');
  const [itemTitle, setItemTitle] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemCost, setItemCost] = useState(25);
  const [itemTime, setItemTime] = useState('11:00 AM');

  // Queries
  const { data: allDestData } = useQuery({
    queryKey: ['all-destinations-list'],
    queryFn: () => apiClient.getDestinations(),
  });

  const { data: tripsData, isLoading: tripsLoading } = useQuery({
    queryKey: ['my-trips'],
    queryFn: () => apiClient.getTrips(),
  });

  const trips: Trip[] = tripsData?.data || [];
  const destinations: Destination[] = allDestData?.data || [];

  // If activeTripId not set, pick first trip
  useEffect(() => {
    if (!activeTripId && trips.length > 0) {
      setActiveTripId(trips[0].id);
    }
  }, [trips, activeTripId]);

  // Query for current active trip
  const { data: activeTripData } = useQuery({
    queryKey: ['trip-detail', activeTripId],
    queryFn: () => apiClient.getTripById(activeTripId!),
    enabled: !!activeTripId,
  });

  const activeTrip: Trip | undefined = activeTripData?.data;

  // Mutations
  const createTripMutation = useMutation({
    mutationFn: (data: any) => apiClient.createTrip(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['my-trips'] });
      setActiveTripId(res.data.id);
      setCreateModalOpen(false);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    },
  });

  const autoGenerateMutation = useMutation({
    mutationFn: (tripId: string) => apiClient.autoGenerateTrip(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip-detail', activeTripId] });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    },
  });

  const addItemMutation = useMutation({
    mutationFn: ({ dayId, data }: { dayId: string; data: any }) =>
      apiClient.addItineraryItem(activeTripId!, dayId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip-detail', activeTripId] });
      setAddItemModalOpen(false);
      setItemTitle('');
      setItemDescription('');
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (itemId: string) => apiClient.deleteItineraryItem(activeTripId!, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip-detail', activeTripId] });
    },
  });

  const handleCreateTripSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dest = destinations.find((d: Destination) => d.id === newDestId);
    const title = newTitle.trim() || `Journey to ${dest?.name || 'Paradise'}`;

    createTripMutation.mutate({
      destinationId: newDestId,
      title,
      startDate: newStartDate,
      endDate: newEndDate,
      travelerCount: Number(newTravelers),
      budgetCeiling: Number(newBudget),
      autoGenerate: newAutoGenerate,
    });
  };

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip) return;
    const currentDay = activeTrip.days.find((d: ItineraryDay) => d.dayNumber === activeDayNumber);
    if (!currentDay) return;

    addItemMutation.mutate({
      dayId: currentDay.id,
      data: {
        itemType,
        title: itemTitle.trim(),
        description: itemDescription.trim(),
        cost: Number(itemCost),
        startTime: itemTime,
      },
    });
  };

  const handleQuickAddAttraction = (attraction: any) => {
    if (!activeTrip) return;
    const currentDay = activeTrip.days.find((d: ItineraryDay) => d.dayNumber === activeDayNumber);
    if (!currentDay) return;

    addItemMutation.mutate({
      dayId: currentDay.id,
      data: {
        itemType: 'attraction',
        title: attraction.name,
        description: attraction.description,
        cost: attraction.estimatedCost,
        startTime: '02:00 PM',
        refId: attraction.id,
      },
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDay = activeTrip?.days.find((d: ItineraryDay) => d.dayNumber === activeDayNumber);
  const budget = activeTrip?.calculatedBudget;

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return <HotelIcon className="w-4 h-4 text-indigo-500" />;
      case 'dining':
        return <Utensils className="w-4 h-4 text-amber-500" />;
      case 'transport':
        return <Plane className="w-4 h-4 text-sky-500" />;
      case 'attraction':
        return <Camera className="w-4 h-4 text-emerald-500" />;
      default:
        return <Compass className="w-4 h-4 text-wander-500" />;
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Top Banner */}
      <section className="bg-gradient-to-b from-amber-500/10 via-[#FAF8F5] to-[#FAF8F5] pt-10 pb-8 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wander-100 text-wander-800 text-xs font-bold mb-2">
              <Compass className="w-3.5 h-3.5 text-wander-600" />
              <span>Interactive Day-Wise Itinerary Builder</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Trip Planning Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Organize daily timelines, calculate live budgets, and auto-group attractions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-5 py-2.5 bg-wander-500 hover:bg-wander-600 text-white text-xs font-extrabold rounded-full shadow-float transition flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Trip</span>
            </button>

            {activeTrip && (
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-full shadow-xs transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Export / Print</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* If no trips exist */}
        {trips.length === 0 && !tripsLoading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
            <Compass className="w-16 h-16 text-wander-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-slate-800">No Trips Created Yet</h3>
            <p className="text-xs text-slate-500 mt-2">
              Start by creating your first trip to generate an automated day-by-day itinerary.
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="mt-6 px-6 py-3 bg-wander-500 text-white font-bold text-xs rounded-full shadow-md"
            >
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Trip Selector & Days Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Trip Dropdown / Switcher */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Active Trip
                </label>
                <div className="space-y-2">
                  {trips.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveTripId(t.id);
                        setActiveDayNumber(1);
                      }}
                      className={`w-full p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                        activeTripId === t.id
                          ? 'border-wander-500 bg-wander-50/60 ring-1 ring-wander-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={t.destination?.imageUrl}
                        alt={t.title}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{t.title}</h4>
                        <p className="text-[11px] text-slate-500">
                          {t.destination?.name} • {t.travelerCount} Travelers
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Sticky Live Budget Card */}
              {budget && (
                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Live Budget Estimator
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        budget.isOverBudget
                          ? 'bg-red-100 text-red-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {budget.isOverBudget ? 'Over Budget' : 'Within Budget'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-2xl font-black text-slate-900">
                        ₹{budget.totalCost.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400"> spent</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400">Cap: </span>
                      <span className="text-sm font-bold text-slate-700">
                        ₹{budget.budgetCeiling.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        budget.isOverBudget ? 'bg-red-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${budget.percentUsed}%` }}
                    />
                  </div>

                  {/* Category Breakdown */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Stays</span>
                      <span className="font-bold text-slate-800">₹{budget.breakdown.hotel}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Dining</span>
                      <span className="font-bold text-slate-800">₹{budget.breakdown.dining}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Attractions</span>
                      <span className="font-bold text-slate-800">₹{budget.breakdown.attraction}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Transport</span>
                      <span className="font-bold text-slate-800">₹{budget.breakdown.transport}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Destination Highlights Tray */}
              {activeTrip?.destination?.attractions && (
                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                    Top Sights to Add to Day {activeDayNumber}
                  </span>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {activeTrip.destination.attractions.map((attraction: any) => (
                      <div
                        key={attraction.id}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-slate-800 truncate">{attraction.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {attraction.estimatedCost === 0 ? 'Free' : `₹${attraction.estimatedCost}`} • {attraction.avgVisitMinutes}m
                          </p>
                        </div>
                        <button
                          onClick={() => handleQuickAddAttraction(attraction)}
                          className="px-2.5 py-1 rounded-lg bg-wander-500 hover:bg-wander-600 text-white font-bold text-[10px] flex-shrink-0 transition"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Day-by-Day Interactive Timeline */}
            <div className="lg:col-span-8 space-y-6">
              {activeTrip && (
                <>
                  {/* Day Tabs & Auto-Generate Header */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Day selector pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
                      {activeTrip.days.map((day: ItineraryDay) => (
                        <button
                          key={day.id}
                          onClick={() => setActiveDayNumber(day.dayNumber)}
                          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                            activeDayNumber === day.dayNumber
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <span>Day {day.dayNumber}</span>
                          <span className="text-[10px] opacity-70">({day.items?.length || 0})</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => autoGenerateMutation.mutate(activeTrip.id)}
                        disabled={autoGenerateMutation.isPending}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-wander-500 hover:from-amber-600 hover:to-wander-600 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{autoGenerateMutation.isPending ? 'Generating...' : 'Auto-Fill Sights'}</span>
                      </button>

                      <button
                        onClick={() => setAddItemModalOpen(true)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Item</span>
                      </button>
                    </div>
                  </div>

                  {/* Day Content Timeline */}
                  {currentDay && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                        <div>
                          <h3 className="text-xl font-black text-slate-900">
                            Day {currentDay.dayNumber} Timeline
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {new Date(currentDay.date).toLocaleDateString(undefined, {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                          {currentDay.items?.length || 0} scheduled items
                        </span>
                      </div>

                      {/* Items List */}
                      {currentDay.items?.length === 0 ? (
                        <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="text-sm font-bold text-slate-700">No activities scheduled for this day</p>
                          <p className="text-xs text-slate-400 mt-1">
                            Use "Auto-Fill Sights" or click "+ Add Item" to schedule stops.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {currentDay.items.map((item: ItineraryItem) => (
                            <div
                              key={item.id}
                              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start justify-between gap-4 hover:bg-slate-50 transition"
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-2.5 rounded-xl bg-white shadow-xs border border-slate-100">
                                  {getItemIcon(item.itemType)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-wander-600 bg-wander-50 px-2 py-0.5 rounded-md">
                                      {item.startTime || 'Flexible'}
                                    </span>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                      {item.itemType}
                                    </span>
                                  </div>
                                  <h4 className="text-sm font-black text-slate-900 mt-1">{item.title}</h4>
                                  {item.description && (
                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-sm font-black text-slate-900">
                                  {item.cost === 0 ? 'Free' : `₹${item.cost}`}
                                </span>
                                <button
                                  onClick={() => deleteItemMutation.mutate(item.id)}
                                  className="text-slate-300 hover:text-red-500 transition p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CREATE TRIP MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-100 relative">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-wander-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              Itinerary Wizard
            </div>
            <h3 className="text-2xl font-black text-slate-900">Create a New Trip</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Pick your target destination, dates, and budget ceiling.
            </p>

            <form onSubmit={handleCreateTripSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Destination
                </label>
                <select
                  value={newDestId}
                  onChange={(e) => setNewDestId(e.target.value)}
                  className="w-full text-xs font-bold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-wander-500"
                >
                  {destinations.map((d: Destination) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.country}) — {d.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Trip Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Autumn Foliage in Kyoto"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs font-medium border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-wander-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-wander-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-wander-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Travelers Count
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newTravelers}
                    onChange={(e) => setNewTravelers(Number(e.target.value))}
                    className="w-full text-xs font-medium border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-wander-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Budget Limit (₹)
                  </label>
                  <input
                    type="number"
                    min={100}
                    step={100}
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full text-xs font-medium border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-wander-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Sparkles className="w-4 h-4 text-wander-500" />
                  <span>Auto-generate initial suggested schedule</span>
                </div>
                <input
                  type="checkbox"
                  checked={newAutoGenerate}
                  onChange={(e) => setNewAutoGenerate(e.target.checked)}
                  className="w-4 h-4 accent-wander-500 rounded"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={createTripMutation.isPending}
                  className="w-full py-3 bg-gradient-to-r from-wander-500 to-wander-600 hover:from-wander-600 hover:to-wander-700 text-white font-extrabold text-sm rounded-xl shadow-float transition active:scale-95 disabled:opacity-50"
                >
                  {createTripMutation.isPending ? 'Creating Plan...' : 'Create Itinerary'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD ITEM MODAL */}
      {addItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 relative">
            <button
              onClick={() => setAddItemModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-black text-slate-900">Add Stop to Day {activeDayNumber}</h3>

            <form onSubmit={handleAddItemSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['attraction', 'dining', 'hotel', 'transport'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setItemType(t)}
                      className={`py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                        itemType === t
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunset drinks at rooftop lounge"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  className="w-full text-xs font-medium border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-wander-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Reservation notes, transit instructions..."
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="w-full text-xs font-medium border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-wander-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={itemTime}
                    onChange={(e) => setItemTime(e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-wander-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Cost (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={itemCost}
                    onChange={(e) => setItemCost(Number(e.target.value))}
                    className="w-full text-xs font-medium border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-wander-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={addItemMutation.isPending}
                  className="w-full py-3 bg-wander-500 hover:bg-wander-600 text-white font-bold text-xs rounded-xl shadow-sm transition active:scale-95 disabled:opacity-50"
                >
                  {addItemMutation.isPending ? 'Adding...' : 'Add to Day Timeline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
