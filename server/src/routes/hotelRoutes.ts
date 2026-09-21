import { Router } from 'express';
import { HotelController } from '../controllers/hotelController.js';

const router = Router();

router.get('/', HotelController.list);

export default router;
