import { Request, Response, NextFunction } from 'express';
import { HotelService } from '../integrations/hotelService.js';

export class HotelController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { destinationId, minPrice, maxPrice, minRating } = req.query;
      if (!destinationId) {
        res.status(400).json({ success: false, message: 'destinationId is required' });
        return;
      }

      const hotels = await HotelService.getHotelsForDestination({
        destinationId: destinationId as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        minRating: minRating ? parseFloat(minRating as string) : undefined,
      });

      res.json({ success: true, count: hotels.length, data: hotels });
    } catch (err) {
      next(err);
    }
  }
}
