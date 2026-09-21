import { Router } from 'express';
import { AIChatController } from '../controllers/aiChatController.js';
import { optionalAuth } from '../middlewares/auth.js';

const router = Router();

// POST /api/chat - accepts queries from both authenticated users and guests
router.post('/', optionalAuth, AIChatController.chat);

export default router;
