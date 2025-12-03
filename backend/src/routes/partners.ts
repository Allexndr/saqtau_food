import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// HCI: Social Interaction - Partner management endpoints
// TODO: Implement partner controller
router.get('/', (req, res) => res.json({ message: 'Partners endpoint - Coming soon' }));
router.get('/:id', (req, res) => res.json({ message: 'Partner details endpoint - Coming soon' }));
router.post('/', authMiddleware, (req, res) => res.json({ message: 'Create partner endpoint - Coming soon' }));

export default router;
