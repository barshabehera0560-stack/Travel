import { Request, Response, NextFunction } from 'express';
import { TripService } from '../services/tripService.js';

export class TripController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'usr-demo-001';
      const trip = await TripService.createTrip(userId, req.body);
      res.status(201).json({ success: true, data: trip });
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'usr-demo-001';
      const trips = await TripService.listUserTrips(userId);
      res.json({ success: true, count: trips.length, data: trips });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const trip = await TripService.getTripById(req.params.id, userId);
      res.json({ success: true, data: trip });
    } catch (err) {
      next(err);
    }
  }

  static async autoGenerate(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'usr-demo-001';
      const trip = await TripService.autoGenerateItinerary(req.params.id, userId);
      res.json({ success: true, data: trip, message: 'Itinerary auto-generated successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await TripService.addItineraryItem(req.params.dayId, req.body);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }

  static async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await TripService.updateItineraryItem(req.params.itemId, req.body);
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }

  static async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      await TripService.deleteItineraryItem(req.params.itemId);
      res.json({ success: true, message: 'Item deleted' });
    } catch (err) {
      next(err);
    }
  }

  static async deleteTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || 'usr-demo-001';
      await TripService.deleteTrip(req.params.id, userId);
      res.json({ success: true, message: 'Trip deleted' });
    } catch (err) {
      next(err);
    }
  }
}
