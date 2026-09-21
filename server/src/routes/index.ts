import { Router } from 'express';
import authRoutes from './authRoutes.js';
import destinationRoutes from './destinationRoutes.js';
import tripRoutes from './tripRoutes.js';
import budgetRoutes from './budgetRoutes.js';
import favoriteRoutes from './favoriteRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import hotelRoutes from './hotelRoutes.js';
import transportRoutes from './transportRoutes.js';
import adminRoutes from './adminRoutes.js';
import aiChatRoutes from './aiChatRoutes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/destinations', destinationRoutes);
apiRouter.use('/trips', tripRoutes);
apiRouter.use('/budget', budgetRoutes);
apiRouter.use('/favorites', favoriteRoutes);
apiRouter.use('/reviews', reviewRoutes);
apiRouter.use('/hotels', hotelRoutes);
apiRouter.use('/transport', transportRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/chat', aiChatRoutes);

export default apiRouter;
