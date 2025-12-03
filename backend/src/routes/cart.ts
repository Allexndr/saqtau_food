import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// HCI: Interaction Design - Shopping cart management
// TODO: Implement cart controller
router.get('/', authMiddleware, (req, res) => res.json({ message: 'Get cart endpoint - Coming soon' }));
router.post('/items', authMiddleware, (req, res) => res.json({ message: 'Add to cart endpoint - Coming soon' }));
router.put('/items/:id', authMiddleware, (req, res) => res.json({ message: 'Update cart item endpoint - Coming soon' }));
router.delete('/items/:id', authMiddleware, (req, res) => res.json({ message: 'Remove from cart endpoint - Coming soon' }));

export default router;
