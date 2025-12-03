import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// HCI: Interaction Design - Order lifecycle management
// TODO: Implement order controller
router.get('/', authMiddleware, (req, res) => res.json({ message: 'Get orders endpoint - Coming soon' }));
router.get('/:id', authMiddleware, (req, res) => res.json({ message: 'Get order details endpoint - Coming soon' }));
router.post('/', authMiddleware, (req, res) => res.json({ message: 'Create order endpoint - Coming soon' }));
router.put('/:id/status', authMiddleware, (req, res) => res.json({ message: 'Update order status endpoint - Coming soon' }));

export default router;
