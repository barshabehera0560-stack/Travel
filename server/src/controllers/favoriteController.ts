import { Request, Response, NextFunction } from 'express';
import { FavoriteService } from '../services/favoriteService.js';

export class FavoriteController {
  static async toggle(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'usr-demo-001';
      const { itemType, itemId, title, subtitle, imageUrl } = req.body;
      const result = await FavoriteService.toggleFavorite({
        userId,
        itemType,
        itemId,
        title,
        subtitle,
        imageUrl,
      });

      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'usr-demo-001';
      const favorites = await FavoriteService.getUserFavorites(userId);
      res.json({ success: true, count: favorites.length, data: favorites });
    } catch (err) {
      next(err);
    }
  }
}
