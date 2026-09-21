import { Request, Response, NextFunction } from 'express';
import { DestinationService } from '../services/destinationService.js';

export class DestinationController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, category, region, avgCostTier, season, sortBy } = req.query;
      const destinations = await DestinationService.listDestinations({
        search: search as string,
        category: category as string,
        region: region as string,
        avgCostTier: avgCostTier ? parseInt(avgCostTier as string, 10) : undefined,
        season: season as string,
        sortBy: sortBy as any,
      });

      res.json({
        success: true,
        count: destinations.length,
        data: destinations,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const destination = await DestinationService.getDestinationById(req.params.id);
      res.json({ success: true, data: destination });
    } catch (err) {
      next(err);
    }
  }

  static async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await DestinationService.getCategories();
      res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  }
}
