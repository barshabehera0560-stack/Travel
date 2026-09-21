import { Router } from 'express';
import { FavoriteController } from '../controllers/favoriteController.js';
import { optionalAuth } from '../middlewares/auth.js';

const router = Router();

router.use(optionalAuth);

router.post('/toggle', FavoriteController.toggle);
router.get('/', FavoriteController.list);

export default router;
