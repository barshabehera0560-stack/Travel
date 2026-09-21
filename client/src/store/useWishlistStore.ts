import { create } from 'zustand';
import { Favorite } from '../types/index.js';
import { apiClient } from '../api/client.js';

interface WishlistState {
  favorites: Favorite[];
  favoriteIds: Set<string>;
  isLoading: boolean;
  toastMessage: string | null;
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (item: {
    itemType: 'destination' | 'attraction' | 'hotel';
    itemId: string;
    title: string;
    subtitle?: string;
    imageUrl?: string;
  }) => Promise<boolean>;
  removeFavorite: (fav: Favorite) => Promise<void>;
  isFavorited: (itemId: string) => boolean;
  clearToast: () => void;
}

const getInitialFavorites = (): Favorite[] => {
  try {
    const saved = localStorage.getItem('wanderly_wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialFavs = getInitialFavorites();

export const useWishlistStore = create<WishlistState>((set, get) => ({
  favorites: initialFavs,
  favoriteIds: new Set(initialFavs.map((f) => f.itemId)),
  isLoading: false,
  toastMessage: null,

  clearToast: () => set({ toastMessage: null }),

  fetchFavorites: async () => {
    try {
      set({ isLoading: true });
      const res = await apiClient.getFavorites();
      if (res.success) {
        const favs = res.data || [];
        localStorage.setItem('wanderly_wishlist', JSON.stringify(favs));
        set({
          favorites: favs,
          favoriteIds: new Set(favs.map((f) => f.itemId)),
        });
      }
    } catch {
      // Keep local cached favorites if request fails
    } finally {
      set({ isLoading: false });
    }
  },

  toggleFavorite: async (item) => {
    const { favorites, favoriteIds } = get();
    const currentlyFavorited = favoriteIds.has(item.itemId);

    // 1. Optimistic Update
    if (currentlyFavorited) {
      const nextFavs = favorites.filter((f) => f.itemId !== item.itemId);
      const nextIds = new Set(favoriteIds);
      nextIds.delete(item.itemId);
      localStorage.setItem('wanderly_wishlist', JSON.stringify(nextFavs));
      set({
        favorites: nextFavs,
        favoriteIds: nextIds,
        toastMessage: `Removed "${item.title}" from your wishlist.`,
      });
    } else {
      const tempFav: Favorite = {
        id: 'temp-' + Date.now(),
        userId: '',
        itemType: item.itemType,
        itemId: item.itemId,
        title: item.title,
        subtitle: item.subtitle,
        imageUrl: item.imageUrl,
        createdAt: new Date().toISOString(),
      };
      const nextFavs = [tempFav, ...favorites];
      const nextIds = new Set(favoriteIds);
      nextIds.add(item.itemId);
      localStorage.setItem('wanderly_wishlist', JSON.stringify(nextFavs));
      set({
        favorites: nextFavs,
        favoriteIds: nextIds,
        toastMessage: `Saved "${item.title}" to your wishlist! ❤️`,
      });
    }

    // Auto-dismiss toast
    setTimeout(() => {
      set({ toastMessage: null });
    }, 3000);

    // 2. Server Sync
    try {
      const res = await apiClient.toggleFavorite(item);
      // Re-fetch from server to get clean DB state and server IDs
      const refreshed = await apiClient.getFavorites();
      if (refreshed.success) {
        const favs = refreshed.data || [];
        localStorage.setItem('wanderly_wishlist', JSON.stringify(favs));
        set({
          favorites: favs,
          favoriteIds: new Set(favs.map((f) => f.itemId)),
        });
      }
      return res.data?.isFavorited ?? !currentlyFavorited;
    } catch (err) {
      // Revert to server state on error
      const refreshed = await apiClient.getFavorites().catch(() => null);
      if (refreshed?.success) {
        set({
          favorites: refreshed.data,
          favoriteIds: new Set(refreshed.data.map((f) => f.itemId)),
        });
      }
      return currentlyFavorited;
    }
  },

  removeFavorite: async (fav: Favorite) => {
    await get().toggleFavorite({
      itemType: fav.itemType,
      itemId: fav.itemId,
      title: fav.title,
      subtitle: fav.subtitle,
      imageUrl: fav.imageUrl,
    });
  },

  isFavorited: (itemId: string) => {
    return get().favoriteIds.has(itemId);
  },
}));
