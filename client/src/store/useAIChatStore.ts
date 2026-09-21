import { create } from 'zustand';
import { ChatMessage, AIChatDestinationCard } from '../types/index.js';
import { apiClient } from '../api/client.js';

interface AIChatState {
  isOpen: boolean;
  isLoading: boolean;
  messages: ChatMessage[];
  setIsOpen: (open: boolean) => void;
  toggleChat: () => void;
  sendMessage: (text: string) => Promise<void>;
  openWithPrompt: (prompt: string) => Promise<void>;
  clearHistory: () => void;
}

const initialWelcomeMessage: ChatMessage = {
  id: 'welcome-0',
  role: 'assistant',
  content: `### 👋 Welcome to WanderAI!\n\nI'm your intelligent travel concierge. Tell me what kind of trip you have in mind, your budget in **₹**, or where you want to go, and I'll build you a personalized plan with photos and real prices!`,
  suggestedPrompts: [
    '🌟 Plan a 5-day trip to Kyoto under ₹60,000',
    '🏖️ Top romantic beach destinations for couples',
    '💰 Best budget getaways under ₹40,000',
    '🏔️ Scenic mountain & adventure destinations',
  ],
  timestamp: new Date().toISOString(),
};

export const useAIChatStore = create<AIChatState>((set, get) => ({
  isOpen: false,
  isLoading: false,
  messages: [initialWelcomeMessage],

  setIsOpen: (open) => set({ isOpen: open }),

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

  clearHistory: () => set({ messages: [initialWelcomeMessage] }),

  sendMessage: async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || get().isLoading) return;

    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    // Optimistically add user message
    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      isOpen: true,
    }));

    try {
      const history = get().messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await apiClient.sendChatMessage(trimmed, history);

      if (res.success && res.data) {
        const assistantMessage: ChatMessage = {
          id: 'ai-' + Date.now(),
          role: 'assistant',
          content: res.data.reply,
          destinations: res.data.destinations,
          suggestedPrompts: res.data.suggestedPrompts,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          messages: [...state.messages, assistantMessage],
        }));
      }
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: "I apologize, but I encountered an error fetching travel intelligence. Please try asking again in a moment!",
        timestamp: new Date().toISOString(),
      };
      set((state) => ({
        messages: [...state.messages, errorMessage],
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  openWithPrompt: async (prompt: string) => {
    set({ isOpen: true });
    await get().sendMessage(prompt);
  },
}));
