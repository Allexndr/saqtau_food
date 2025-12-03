import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// HCI: Interaction Design - RESTful routes for product management
// Public routes - no authentication required
router.get('/', ProductController.getProducts);
router.get('/recommended', ProductController.getRecommendedProducts);
router.get('/:id', ProductController.getProductById);

// Protected routes - require authentication
// HCI: Security - Partner-only routes for product management
router.post('/', authMiddleware, ProductController.createProduct);
router.put('/:id', authMiddleware, ProductController.updateProduct);
router.delete('/:id', authMiddleware, ProductController.deleteProduct);

export default router;
