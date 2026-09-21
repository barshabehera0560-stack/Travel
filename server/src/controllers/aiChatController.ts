import { Request, Response, NextFunction } from 'express';
import { AIChatService } from '../services/aiChatService.js';

export class AIChatController {
  static async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, history, userPreferences } = req.body;
      if (!message || typeof message !== 'string') {
        res.status(400).json({
          success: false,
          message: 'A message string is required.',
        });
        return;
      }

      const result = await AIChatService.handleChat({
        message,
        history: Array.isArray(history) ? history : [],
        userPreferences: userPreferences || (req.user as any)?.preferences || undefined,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}
