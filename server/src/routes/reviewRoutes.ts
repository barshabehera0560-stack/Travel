import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.js';
import { optionalAuth } from '../middlewares/auth.js';

const router = Router();

router.use(optionalAuth);

router.post('/', ReviewController.create);
router.get('/destination/:destinationId', ReviewController.getByDestination);

export default router;
