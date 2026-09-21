import { Request, Response, NextFunction } from 'express';
import { TransportService } from '../integrations/transportService.js';

export class TransportController {
  static async getEstimates(req: Request, res: Response, next: NextFunction) {
    try {
      const { destinationId, originCity } = req.query;
      if (!destinationId) {
        res.status(400).json({ success: false, message: 'destinationId is required' });
        return;
      }

      const estimates = await TransportService.getTransportEstimates(
        destinationId as string,
        originCity as string | undefined
      );

      res.json({ success: true, count: estimates.length, data: estimates });
    } catch (err) {
      next(err);
    }
  }
}
