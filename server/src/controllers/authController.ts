import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, preferences } = req.body;
      const result = await AuthService.register(name, email, password, preferences);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async demoLogin(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.demoLogin();
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async demoAdminLogin(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.demoAdminLogin();
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const user = await AuthService.getMe(req.user.id);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  static async updatePreferences(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const user = await AuthService.updatePreferences(req.user.id, req.body.preferences);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
}
