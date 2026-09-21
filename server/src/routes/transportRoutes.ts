import { Router } from 'express';
import { TransportController } from '../controllers/transportController.js';

const router = Router();

router.get('/estimates', TransportController.getEstimates);

export default router;
