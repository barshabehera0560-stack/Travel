import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Send,
  Trash2,
  MapPin,
  Star,
  Heart,
  ArrowRight,
  Compass,
  IndianRupee,
  Bot,
  MessageSquare,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAIChatStore } from '../../store/useAIChatStore.js';
import { useWishlistStore } from '../../store/useWishlistStore.js';
import { AIChatDestinationCard } from '../../types/index.js';

export const AIChatbotModal: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, setIsOpen, toggleChat, messages, isLoading, sendMessage, clearHistory } = useAIChatStore();
  const { toggleFavorite, isFavorited } = useWishlistStore();

  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput('');
    await sendMessage(text);
  };

  const handleCardFavorite = async (dest: AIChatDestinationCard) => {
    await toggleFavorite({
      itemType: 'destination',
      itemId: dest.id,
      title: dest.name,
      subtitle: `${dest.country} • ${dest.category}`,
      imageUrl: dest.imageUrl,
    });
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={toggleChat}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="group relative flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-slate-900 via-navy-900 to-wander-700 text-white rounded-full shadow-2xl border border-white/20 backdrop-blur-md transition-all duration-300 hover:shadow-wander-500/25"
          title="Open AI Travel Concierge"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-wander-500 to-amber-400 flex items-center justify-center text-white shadow-md group-hover:rotate-12 transition-transform">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>

          <div className="text-left">
            <span className="block text-xs font-black tracking-tight leading-tight">WanderAI</span>
            <span className="hidden sm:block text-[10px] text-amber-300 font-bold uppercase tracking-wider">
              Travel Concierge
            </span>
          </div>

          <span className="relative flex h-2 w-2 ml-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </motion.button>
      </div>

      {/* Slide-Up Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-50 shadow-2xl bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col ${
              isExpanded
                ? 'bottom-4 right-4 sm:right-6 w-[94vw] sm:w-[650px] h-[86vh]'
                : 'bottom-4 right-4 sm:right-6 w-[94vw] sm:w-[420px] h-[620px] max-h-[88vh]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-navy-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-wander-500 to-amber-400 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-white">WanderAI Concierge</h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold px-1.5 py-0.2 rounded-md">
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Powered by Verified Travel Intelligence & ₹ Pricing</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
                  title={isExpanded ? 'Collapse size' : 'Expand window'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={clearHistory}
                  className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/10 transition"
                  title="Clear conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleChat}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF8F5]/60 text-sm">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Message Bubble */}
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-wander-600 to-wander-500 text-white shadow-md rounded-br-xs'
                        : 'bg-white border border-slate-200/80 text-slate-800 shadow-xs rounded-bl-xs'
                    }`}
                  >
                    {/* Render message with line breaks and formatting */}
                    <div className="space-y-1.5 whitespace-pre-line break-words">
                      {msg.content}
                    </div>

                    {/* Embedded Destination Travel Cards */}
                    {msg.destinations && msg.destinations.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                          Recommended Travel Destinations:
                        </span>

                        <div className="grid grid-cols-1 gap-2.5">
                          {msg.destinations.map((dest) => {
                            const favorited = isFavorited(dest.id);
                            return (
                              <div
                                key={dest.id}
                                className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 rounded-2xl overflow-hidden transition-all duration-200 shadow-xs group"
                              >
                                <div className="flex gap-3 p-2.5 items-center">
                                  {/* Thumbnail */}
                                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 relative">
                                    <img
                                      src={dest.imageUrl}
                                      alt={dest.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      decoding="async"
                                    />
                                    <span className="absolute top-1 left-1 text-[9px] font-black uppercase px-1.5 py-0.2 bg-black/60 text-white rounded">
                                      {dest.category}
                                    </span>
                                  </div>

                                  {/* Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                      <h4 className="font-extrabold text-xs text-slate-900 truncate">
                                        {dest.name}
                                      </h4>
                                      <div className="flex items-center gap-0.5 text-amber-500 text-[11px] font-bold shrink-0">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        <span>{dest.rating.toFixed(1)}</span>
                                      </div>
                                    </div>

                                    <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                                      <MapPin className="w-3 h-3 text-wander-500 shrink-0" />
                                      <span>{dest.country}</span>
                                    </p>

                                    <div className="mt-1.5 flex items-center justify-between text-[11px]">
                                      <span className="font-bold text-slate-700">
                                        ₹{dest.estimatedDailyCostInr.toLocaleString('en-IN')}{' '}
                                        <span className="text-[10px] text-slate-400 font-normal">/ day</span>
                                      </span>

                                      <div className="flex items-center gap-1">
                                        {/* Quick Wishlist */}
                                        <button
                                          onClick={() => handleCardFavorite(dest)}
                                          className={`p-1.5 rounded-lg border transition ${
                                            favorited
                                              ? 'bg-red-50 text-red-500 border-red-200'
                                              : 'bg-white text-slate-500 hover:text-red-500 border-slate-200'
                                          }`}
                                          title={favorited ? 'In Wishlist' : 'Add to Wishlist'}
                                        >
                                          <Heart className={`w-3 h-3 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
                                        </button>

                                        {/* View Details */}
                                        <button
                                          onClick={() => {
                                            setIsOpen(false);
                                            navigate(`/destination/${dest.id}`);
                                          }}
                                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[10px] flex items-center gap-0.5 transition"
                                        >
                                          <span>View</span>
                                          <ArrowRight className="w-2.5 h-2.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Suggested follow-up prompt chips */}
                  {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                      {msg.suggestedPrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessage(prompt)}
                          disabled={isLoading}
                          className="text-[11px] font-semibold bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200/80 hover:border-amber-300 px-2.5 py-1 rounded-full shadow-xs transition active:scale-95 text-left disabled:opacity-50"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-wander-500 to-amber-400 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs p-3.5 shadow-xs flex items-center gap-2">
                    <span className="font-semibold text-slate-600">WanderAI is researching destinations & ₹ rates</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-wander-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-wander-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-wander-500 rounded-full animate-bounce"></span>
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about places, itineraries, budgets in ₹..."
                disabled={isLoading}
                className="flex-1 bg-slate-100/90 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-wander-500/20 focus:border-wander-500 transition"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-2xl bg-gradient-to-r from-wander-500 to-wander-600 hover:from-wander-600 hover:to-wander-700 text-white flex items-center justify-center shadow-md disabled:opacity-40 transition-all active:scale-95 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
