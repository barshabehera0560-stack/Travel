import { Router } from 'express';
import { TripController } from '../controllers/tripController.js';
import { optionalAuth } from '../middlewares/auth.js';

const router = Router();

router.use(optionalAuth);

router.post('/', TripController.create);
router.get('/', TripController.list);
router.get('/:id', TripController.getById);
router.post('/:id/auto-generate', TripController.autoGenerate);
router.post('/:id/days/:dayId/items', TripController.addItem);
router.patch('/:id/items/:itemId', TripController.updateItem);
router.delete('/:id/items/:itemId', TripController.deleteItem);
router.delete('/:id', TripController.deleteTrip);

export default router;
