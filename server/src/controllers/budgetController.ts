import { Request, Response, NextFunction } from 'express';
import { BudgetService } from '../services/budgetService.js';

export class BudgetController {
  static async compare(req: Request, res: Response, next: NextFunction) {
    try {
      const { destinationIds, durationDays, travelerCount, budgetTier } = req.body;
      const comparison = await BudgetService.compareDestinations({
        destinationIds,
        durationDays: durationDays ? parseInt(durationDays, 10) : 5,
        travelerCount: travelerCount ? parseInt(travelerCount, 10) : 2,
        budgetTier: budgetTier ? parseInt(budgetTier, 10) : 2,
      });

      res.json({ success: true, data: comparison });
    } catch (err) {
      next(err);
    }
  }
}
