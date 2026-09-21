import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/demo-login', AuthController.demoLogin);
router.post('/demo-admin-login', AuthController.demoAdminLogin);
router.get('/me', requireAuth, AuthController.getMe);
router.put('/preferences', requireAuth, AuthController.updatePreferences);

export default router;
