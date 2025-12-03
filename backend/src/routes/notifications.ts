import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// HCI: Security - All notification routes require authentication
router.use(authMiddleware);

// HCI: Interaction Design - Notification management endpoints
router.get('/', NotificationController.getUserNotifications);
router.put('/:id/read', NotificationController.markAsRead);
router.put('/read-all', NotificationController.markAllAsRead);
router.delete('/:id', NotificationController.deleteNotification);

export default router;
