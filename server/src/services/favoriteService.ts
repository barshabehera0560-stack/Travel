import { prisma } from '../config/prisma.js';

export interface ToggleFavoriteInput {
  userId: string;
  itemType: 'destination' | 'attraction' | 'hotel';
  itemId: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

export class FavoriteService {
  static async toggleFavorite(input: ToggleFavoriteInput) {
    const { userId, itemType, itemId, title, subtitle, imageUrl } = input;

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_itemType_itemId: {
          userId,
          itemType,
          itemId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return { isFavorited: false, favoriteId: null };
    } else {
      const created = await prisma.favorite.create({
        data: {
          userId,
          itemType,
          itemId,
          title,
          subtitle,
          imageUrl,
        },
      });
      return { isFavorited: true, favoriteId: created.id };
    }
  }

  static async getUserFavorites(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async checkFavoriteStatus(userId: string, itemType: string, itemId: string) {
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_itemType_itemId: {
          userId,
          itemType,
          itemId,
        },
      },
    });
    return !!existing;
  }
}
