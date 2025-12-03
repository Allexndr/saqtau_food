import { Router } from 'express';
import { PartnerController } from '../controllers/PartnerController';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

// HCI: Social Interaction - Public partner endpoints
router.get('/', PartnerController.getPartnerProfile); // List partners (to be implemented)
router.get('/:id', PartnerController.getPartnerProfile);

// HCI: Interaction Design - Partner registration
router.post('/register', PartnerController.registerPartner);

// HCI: Security - Seller-only protected endpoints
router.use(authMiddleware);
router.use(requireRole('partner'));

// Seller dashboard and management
router.get('/dashboard/me', PartnerController.getSellerDashboard);
router.put('/profile/me', PartnerController.updatePartnerProfile);
router.get('/products/me', PartnerController.getSellerProducts);
router.get('/orders/me', PartnerController.getSellerOrders);
router.get('/analytics/me', PartnerController.getSellerAnalytics);

export default router;
