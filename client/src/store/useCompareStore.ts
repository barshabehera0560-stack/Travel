import { create } from 'zustand';
import { Destination } from '../types/index.js';

interface CompareState {
  selectedDestinations: Destination[];
  toggleDestination: (dest: Destination) => void;
  removeDestination: (id: string) => void;
  clearAll: () => void;
  isSelected: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  selectedDestinations: [],

  toggleDestination: (dest: Destination) => {
    const { selectedDestinations } = get();
    const exists = selectedDestinations.some((d) => d.id === dest.id);

    if (exists) {
      set({ selectedDestinations: selectedDestinations.filter((d) => d.id !== dest.id) });
    } else {
      if (selectedDestinations.length >= 3) {
        alert('You can compare up to 3 destinations simultaneously.');
        return;
      }
      set({ selectedDestinations: [...selectedDestinations, dest] });
    }
  },

  removeDestination: (id: string) => {
    set({ selectedDestinations: get().selectedDestinations.filter((d) => d.id !== id) });
  },

  clearAll: () => {
    set({ selectedDestinations: [] });
  },

  isSelected: (id: string) => {
    return get().selectedDestinations.some((d) => d.id === id);
  },
}));
