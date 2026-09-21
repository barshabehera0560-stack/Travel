import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/adminService.js';

export class AdminController {
  // Stats
  static async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getDashboardStats();
      res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  }

  // Users
  static async listUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await AdminService.listAllUsers();
      res.json({ success: true, count: users.length, data: users });
    } catch (err) {
      next(err);
    }
  }

  static async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { role } = req.body;
      const user = await AdminService.updateUserRole(req.params.id, role);
      res.json({ success: true, data: user, message: 'User role updated successfully.' });
    } catch (err) {
      next(err);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await AdminService.deleteUser(req.params.id);
      res.json({ success: true, message: 'User deleted successfully.' });
    } catch (err) {
      next(err);
    }
  }

  // Trips Oversight
  static async listTrips(_req: Request, res: Response, next: NextFunction) {
    try {
      const trips = await AdminService.listAllTrips();
      res.json({ success: true, count: trips.length, data: trips });
    } catch (err) {
      next(err);
    }
  }

  static async deleteTrip(req: Request, res: Response, next: NextFunction) {
    try {
      await AdminService.deleteTripAdmin(req.params.id);
      res.json({ success: true, message: 'Trip deleted successfully.' });
    } catch (err) {
      next(err);
    }
  }

  // Destinations CRUD
  static async createDestination(req: Request, res: Response, next: NextFunction) {
    try {
      const destination = await AdminService.createDestination(req.body);
      res.status(201).json({ success: true, data: destination, message: 'Destination created successfully.' });
    } catch (err) {
      next(err);
    }
  }

  static async updateDestination(req: Request, res: Response, next: NextFunction) {
    try {
      const destination = await AdminService.updateDestination(req.params.id, req.body);
      res.json({ success: true, data: destination, message: 'Destination updated successfully.' });
    } catch (err) {
      next(err);
    }
  }

  static async deleteDestination(req: Request, res: Response, next: NextFunction) {
    try {
      await AdminService.deleteDestination(req.params.id);
      res.json({ success: true, message: 'Destination deleted successfully.' });
    } catch (err) {
      next(err);
    }
  }

  // Attractions CRUD
  static async createAttraction(req: Request, res: Response, next: NextFunction) {
    try {
      const attraction = await AdminService.createAttraction(req.body);
      res.status(201).json({ success: true, data: attraction, message: 'Attraction added successfully.' });
    } catch (err) {
      next(err);
    }
  }

  static async updateAttraction(req: Request, res: Response, next: NextFunction) {
    try {
      const attraction = await AdminService.updateAttraction(req.params.id, req.body);
      res.json({ success: true, data: attraction, message: 'Attraction updated successfully.' });
    } catch (err) {
      next(err);
    }
  }

  static async deleteAttraction(req: Request, res: Response, next: NextFunction) {
    try {
      await AdminService.deleteAttraction(req.params.id);
      res.json({ success: true, message: 'Attraction deleted successfully.' });
    } catch (err) {
      next(err);
    }
  }

  // Hotels CRUD
  static async createHotel(req: Request, res: Response, next: NextFunction) {
    try {
      const hotel = await AdminService.createHotel(req.body);
      res.status(201).json({ success: true, data: hotel, message: 'Hotel added successfully.' });
    } catch (err) {
      next(err);
    }
  }

  static async updateHotel(req: Request, res: Response, next: NextFunction) {
    try {
      const hotel = await AdminService.updateHotel(req.params.id, req.body);
      res.json({ success: true, data: hotel, message: 'Hotel updated successfully.' });
    } catch (err) {
      next(err);
    }
  }

  static async deleteHotel(req: Request, res: Response, next: NextFunction) {
    try {
      await AdminService.deleteHotel(req.params.id);
      res.json({ success: true, message: 'Hotel deleted successfully.' });
    } catch (err) {
      next(err);
    }
  }

  // Reviews Moderation
  static async listReviews(_req: Request, res: Response, next: NextFunction) {
    try {
      const reviews = await AdminService.listAllReviews();
      res.json({ success: true, count: reviews.length, data: reviews });
    } catch (err) {
      next(err);
    }
  }

  static async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.deleteReviewAdmin(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
