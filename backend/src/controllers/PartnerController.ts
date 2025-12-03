import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { Partner } from '../models/Partner';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { AnalyticsEvent } from '../models/AnalyticsEvent';
import { PartnerFilters, NotFoundError, ValidationError, UnauthorizedError } from '../types';

// HCI: Interaction Design - Comprehensive partner/seller management controller
export class PartnerController {
  // HCI: Social Interaction - Get partner profile with enhanced seller information
  static async getPartnerProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const partner = await Partner.findByPk(id, {
        include: [
          {
            model: Product,
            as: 'products',
            where: { is_active: true },
            required: false,
            limit: 10,
            order: [['created_at', 'DESC']],
          },
        ],
      });

      if (!partner) {
        throw new NotFoundError('Partner not found');
      }

      // Calculate real-time stats
      const stats = await PartnerController.calculatePartnerStats(partner.id);
      partner.stats = stats;

      res.json({
        ...partner.toJSON(),
        stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // HCI: Interaction Design - Seller dashboard with comprehensive analytics
  static async getSellerDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || req.user.role !== 'partner') {
        throw new UnauthorizedError('Partner access required');
      }

      const partnerId = req.user.id;

      // Get partner with stats
      const partner = await Partner.findByPk(partnerId);
      if (!partner) {
        throw new NotFoundError('Partner not found');
      }

      // Calculate comprehensive dashboard data
      const dashboardData = await PartnerController.getDashboardData(partnerId);

      res.json({
        partner: partner.toJSON(),
        dashboard: dashboardData,
      });
    } catch (error) {
      next(error);
    }
  }

  // HCI: Data Gathering - Comprehensive dashboard analytics
  private static async getDashboardData(partnerId: string) {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Basic stats
    const [totalProducts, activeProducts, totalOrders] = await Promise.all([
      Product.count({ where: { partner_id: partnerId } }),
      Product.count({ where: { partner_id: partnerId, is_active: true } }),
      Order.count({
        where: {
          cart_snapshot: {
            [Op.contains]: { user_id: partnerId } // This is a simplified check
          }
        }
      }),
    ]);

    // Revenue calculations (simplified)
    const recentOrders = await Order.findAll({
      where: {
        created_at: { [Op.gte]: monthAgo },
        // Note: In real implementation, we'd need to link orders to partners properly
      },
      limit: 100,
    });

    const totalRevenue = recentOrders.reduce((sum, order) => {
      // Calculate revenue from order items that belong to this partner
      return sum; // Placeholder - would need proper order-partner linking
    }, 0);

    // Analytics data for charts
    const weeklyViews = await AnalyticsEvent.findAll({
      where: {
        event: 'product_view',
        created_at: { [Op.gte]: weekAgo },
      },
      attributes: [
        [AnalyticsEvent.sequelize?.fn('DATE', AnalyticsEvent.sequelize?.col('timestamp')), 'date'],
        [AnalyticsEvent.sequelize?.fn('COUNT', '*'), 'views'],
      ],
      group: [AnalyticsEvent.sequelize?.fn('DATE', AnalyticsEvent.sequelize?.col('timestamp'))],
      order: [[AnalyticsEvent.sequelize?.fn('DATE', AnalyticsEvent.sequelize?.col('timestamp')), 'ASC']],
    });

    const topProducts = await Product.findAll({
      where: { partner_id: partnerId, is_active: true },
      limit: 5,
      order: [['created_at', 'DESC']], // In real app, order by sales/views
    });

    return {
      stats: {
        total_products: totalProducts,
        active_products: activeProducts,
        total_orders: totalOrders,
        total_revenue: totalRevenue,
        average_rating: 4.2, // Placeholder
      },
      charts: {
        weekly_views: weeklyViews.map(item => ({
          date: item.get('date'),
          views: parseInt(item.get('views')),
        })),
        revenue_trend: [], // Placeholder for revenue over time
      },
      top_products: topProducts.map(product => ({
        id: product.id,
        title: product.title,
        price: product.discount_price,
        views: 0, // Placeholder
        orders: 0, // Placeholder
      })),
      recent_activity: [], // Placeholder for recent orders/activities
    };
  }

  // HCI: Interaction Design - Partner registration/onboarding
  static async registerPartner(req: Request, res: Response, next: NextFunction) {
    try {
      const partnerData = req.body;

      // Validate required fields
      if (!partnerData.name || !partnerData.type || !partnerData.contact?.email) {
        throw new ValidationError('Missing required fields', [
          { field: 'name', message: 'Business name is required' },
          { field: 'type', message: 'Business type is required' },
          { field: 'contact.email', message: 'Contact email is required' },
        ]);
      }

      // Check if partner already exists
      const existingPartner = await Partner.findOne({
        where: { 'contact.email': partnerData.contact.email }
      });

      if (existingPartner) {
        throw new ValidationError('Partner with this email already exists');
      }

      // Create partner with default settings
      const partner = await Partner.create({
        ...partnerData,
        is_verified: false, // Will need verification process
        settings: {
          auto_confirm_orders: false,
          notification_preferences: {
            new_orders: true,
            low_stock: true,
            reviews: true,
          },
          commission_rate: 15,
          ...partnerData.settings,
        },
      });

      // HCI: Data Gathering - Track partner registration
      await AnalyticsEvent.create({
        event: 'partner_registered',
        data: {
          partner_id: partner.id,
          business_type: partner.type,
        },
      });

      res.status(201).json({
        partner: partner.toJSON(),
        message: 'Partner registered successfully. Please complete verification.',
      });
    } catch (error) {
      next(error);
    }
  }

  // HCI: Interaction Design - Update partner profile
  static async updatePartnerProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || req.user.role !== 'partner') {
        throw new UnauthorizedError('Partner access required');
      }

      const partnerId = req.user.id;
      const updateData = req.body;

      const partner = await Partner.findByPk(partnerId);
      if (!partner) {
        throw new NotFoundError('Partner not found');
      }

      // Update partner
      await partner.update(updateData);

      res.json({
        partner: partner.toJSON(),
        message: 'Profile updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // HCI: Interaction Design - Seller product management
  static async getSellerProducts(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || req.user.role !== 'partner') {
        throw new UnauthorizedError('Partner access required');
      }

      const partnerId = req.user.id;
      const { page = 1, limit = 20, status = 'all' } = req.query;

      const whereClause: any = { partner_id: partnerId };

      if (status === 'active') whereClause.is_active = true;
      if (status === 'inactive') whereClause.is_active = false;

      const { count, rows: products } = await Product.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit as string),
        offset: (parseInt(page as string) - 1) * parseInt(limit as string),
        order: [['created_at', 'DESC']],
      });

      res.json({
        products,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: count,
          totalPages: Math.ceil(count / parseInt(limit as string)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // HCI: Interaction Design - Seller order management
  static async getSellerOrders(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || req.user.role !== 'partner') {
        throw new UnauthorizedError('Partner access required');
      }

      const partnerId = req.user.id;
      const { page = 1, limit = 20, status = 'all' } = req.query;

      // Get products belonging to this partner
      const partnerProducts = await Product.findAll({
        where: { partner_id: partnerId },
        attributes: ['id'],
      });

      const productIds = partnerProducts.map(p => p.id);

      // Find orders containing these products (simplified - in real app need proper order-product linking)
      const orders = await Order.findAll({
        where: status !== 'all' ? { status } : {},
        limit: parseInt(limit as string),
        offset: (parseInt(page as string) - 1) * parseInt(limit as string),
        order: [['created_at', 'DESC']],
      });

      // Filter orders that actually contain partner products
      const filteredOrders = orders.filter(order => {
        // Check if order contains products from this partner
        return true; // Placeholder - would need proper implementation
      });

      res.json({
        orders: filteredOrders,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: filteredOrders.length,
          totalPages: Math.ceil(filteredOrders.length / parseInt(limit as string)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // HCI: Data at Scale - Seller analytics and reporting
  static async getSellerAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || req.user.role !== 'partner') {
        throw new UnauthorizedError('Partner access required');
      }

      const partnerId = req.user.id;
      const { period = 'month' } = req.query;

      // Calculate date range
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'quarter':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Get analytics data
      const analytics = await PartnerController.calculateDetailedAnalytics(partnerId, startDate);

      res.json(analytics);
    } catch (error) {
      next(error);
    }
  }

  // Helper method to calculate partner stats
  private static async calculatePartnerStats(partnerId: string) {
    const [totalProducts, activeProducts, totalOrders] = await Promise.all([
      Product.count({ where: { partner_id: partnerId } }),
      Product.count({ where: { partner_id: partnerId, is_active: true } }),
      // Orders count would need proper linking
      Promise.resolve(0), // Placeholder
    ]);

    return {
      total_products: totalProducts,
      active_products: activeProducts,
      total_orders: totalOrders,
      total_revenue: 0, // Placeholder
      average_rating: 4.2, // Placeholder
      products_sold: 0, // Placeholder
    };
  }

  // Helper method for detailed analytics
  private static async calculateDetailedAnalytics(partnerId: string, startDate: Date) {
    // Placeholder analytics - in real implementation would aggregate from orders and events
    return {
      overview: {
        total_views: 1250,
        total_orders: 45,
        total_revenue: 125000,
        conversion_rate: 3.6,
      },
      charts: {
        daily_views: [], // Array of {date, views}
        daily_orders: [], // Array of {date, orders}
        revenue_trend: [], // Array of {date, revenue}
      },
      top_products: [], // Array of best-selling products
      customer_insights: {
        average_order_value: 2778,
        repeat_customers: 12,
        new_customers: 33,
      },
    };
  }
}
