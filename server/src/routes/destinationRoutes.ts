import { Router } from 'express';
import { DestinationController } from '../controllers/destinationController.js';

const router = Router();

router.get('/', DestinationController.list);
router.get('/categories', DestinationController.getCategories);
router.get('/:id', DestinationController.getById);

export default router;
