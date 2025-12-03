import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { sequelize } from './utils/database';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

// HCI: Interaction Design - Import all models for proper initialization
import './models/User';
import './models/Partner';
import './models/Product';
import './models/Order';
import './models/AnalyticsEvent';
import './models/Notification';

// Setup model associations after models are imported
import './models/associations';

// Routes
import productRoutes from './routes/products';
import authRoutes from './routes/auth';
import partnerRoutes from './routes/partners';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import notificationRoutes from './routes/notifications';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// HCI: Security & Performance - Security headers and rate limiting
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// HCI: Social Interaction - CORS for cross-origin requests (web + mobile)
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://saqtau-platform.com', 'https://app.saqtau-platform.com']
    : ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// HCI: Data Gathering - Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// HCI: Cognitive Aspects - JSON parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
// HCI: Interaction Design - System monitoring
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
// HCI: Interaction Design - RESTful API structure
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// HCI: Error Handling - Centralized error processing
app.use(errorHandler);

// Database synchronization and server start
// HCI: Interaction Design - Proper initialization sequence
const startServer = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');

    // Sync database (in production, use migrations)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ force: false, alter: true });
      logger.info('Database synchronized successfully.');
    }

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Saqtau Backend Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
