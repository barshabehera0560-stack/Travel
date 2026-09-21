import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

// Protect all admin endpoints with authentication and admin/moderator role
router.use(requireAuth);
router.use(requireRole(['admin', 'moderator']));

// Overview Analytics
router.get('/stats', AdminController.getStats);

// Users Management (admin only)
router.get('/users', AdminController.listUsers);
router.patch('/users/:id/role', requireRole(['admin']), AdminController.updateUserRole);
router.delete('/users/:id', requireRole(['admin']), AdminController.deleteUser);

// Trips Oversight
router.get('/trips', AdminController.listTrips);
router.delete('/trips/:id', AdminController.deleteTrip);

// Destinations CRUD
router.post('/destinations', AdminController.createDestination);
router.put('/destinations/:id', AdminController.updateDestination);
router.delete('/destinations/:id', requireRole(['admin']), AdminController.deleteDestination);

// Attractions CRUD
router.post('/attractions', AdminController.createAttraction);
router.put('/attractions/:id', AdminController.updateAttraction);
router.delete('/attractions/:id', requireRole(['admin']), AdminController.deleteAttraction);

// Hotels CRUD
router.post('/hotels', AdminController.createHotel);
router.put('/hotels/:id', AdminController.updateHotel);
router.delete('/hotels/:id', requireRole(['admin']), AdminController.deleteHotel);

// Reviews Moderation
router.get('/reviews', AdminController.listReviews);
router.delete('/reviews/:id', AdminController.deleteReview);

export default router;
