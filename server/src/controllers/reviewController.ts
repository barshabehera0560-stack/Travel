import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/reviewService.js';

export class ReviewController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'usr-demo-001';
      const { destinationId, rating, comment, travelerType, photos } = req.body;
      const review = await ReviewService.createReview({
        userId,
        destinationId,
        rating: Number(rating),
        comment,
        travelerType,
        photos,
      });

      res.status(201).json({ success: true, data: review });
    } catch (err) {
      next(err);
    }
  }

  static async getByDestination(req: Request, res: Response, next: NextFunction) {
    try {
      const reviews = await ReviewService.getDestinationReviews(req.params.destinationId);
      res.json({ success: true, count: reviews.length, data: reviews });
    } catch (err) {
      next(err);
    }
  }
}
