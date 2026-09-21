import { Router } from 'express';
import { BudgetController } from '../controllers/budgetController.js';

const router = Router();

router.post('/compare', BudgetController.compare);

export default router;
