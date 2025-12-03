import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { Product } from '../models/Product';
import { Partner } from '../models/Partner';
import { ProductFilters, PaginationOptions, NotFoundError, ValidationError } from '../types';

export class ProductController {
  // HCI: Data Gathering - Comprehensive product search with multiple filters
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: ProductFilters = {
        category: req.query.category as 'food' | 'fashion',
        subcategory: req.query.subcategory as string,
        min_price: req.query.min_price ? parseFloat(req.query.min_price as string) : undefined,
        max_price: req.query.max_price ? parseFloat(req.query.max_price as string) : undefined,
        search: req.query.search as string,
        lat: req.query.lat ? parseFloat(req.query.lat as string) : undefined,
        lng: req.query.lng ? parseFloat(req.query.lng as string) : undefined,
        radius: req.query.radius ? parseFloat(req.query.radius as string) : 10,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      };

      const pagination: PaginationOptions = {
        page: parseInt(req.query.page as string) || 1,
        limit: Math.min(parseInt(req.query.limit as string) || 20, 100),
        sort_by: req.query.sort_by as string || 'created_at',
        sort_order: (req.query.sort_order as 'asc' | 'desc') || 'desc',
      };

      const whereClause: any = {
        is_active: true,
      };

      // Category filter
      if (filters.category) {
        whereClause.category = filters.category;
      }

      // Subcategory filter
      if (filters.subcategory) {
        whereClause.subcategory = filters.subcategory;
      }

      // Price range filter
      if (filters.min_price !== undefined || filters.max_price !== undefined) {
        whereClause.discount_price = {};
        if (filters.min_price !== undefined) {
          whereClause.discount_price[Op.gte] = filters.min_price;
        }
        if (filters.max_price !== undefined) {
          whereClause.discount_price[Op.lte] = filters.max_price;
        }
      }

      // Search filter (title, description, partner name)
      if (filters.search) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${filters.search}%` } },
          { description: { [Op.iLike]: `%${filters.search}%` } },
          { '$Partner.name$': { [Op.iLike]: `%${filters.search}%` } },
        ];
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        whereClause.tags = {
          [Op.overlap]: filters.tags,
        };
      }

      // Location-based filtering
      // HCI: Cognitive Aspects - Location awareness for better UX
      if (filters.lat !== undefined && filters.lng !== undefined && filters.radius) {
        // Using PostGIS ST_DWithin for accurate distance calculation
        // For simplicity, we'll use a bounding box approximation
        const earthRadius = 6371; // km
        const latDiff = (filters.radius / earthRadius) * (180 / Math.PI);
        const lngDiff = (filters.radius / earthRadius) * (180 / Math.PI) / Math.cos((filters.lat * Math.PI) / 180);

        whereClause['location.lat'] = {
          [Op.between]: [filters.lat - latDiff, filters.lat + latDiff],
        };
        whereClause['location.lng'] = {
          [Op.between]: [filters.lng - lngDiff, filters.lng + lngDiff],
        };
      }

      const offset = (pagination.page - 1) * pagination.limit;

      // HCI: Data at Scale - Optimized queries with proper indexing
      const { count, rows: products } = await Product.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Partner,
            as: 'Partner',
            attributes: ['id', 'name', 'rating', 'logo_url'],
          },
        ],
        limit: pagination.limit,
        offset,
        order: [[pagination.sort_by, pagination.sort_order]],
      });

      const totalPages = Math.ceil(count / pagination.limit);

      // HCI: Emotional Interaction - Rich product data for engaging UI
      const response = {
        products: products.map(product => ({
          ...product.toJSON(),
          partner: product.Partner,
          Partner: undefined, // Remove duplicate nested data
        })),
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: count,
          totalPages,
          hasNext: pagination.page < totalPages,
          hasPrev: pagination.page > 1,
        },
        filters: {
          applied: Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
          ),
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // HCI: Interaction Design - Detailed product view with related data
  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id, {
        include: [
          {
            model: Partner,
            as: 'Partner',
            attributes: ['id', 'name', 'rating', 'review_count', 'logo_url', 'contact', 'business_hours'],
          },
        ],
      });

      if (!product) {
        throw new NotFoundError('Product not found');
      }

      // HCI: Social Interaction - Include partner reviews and rating
      res.json({
        ...product.toJSON(),
        partner: product.Partner,
        Partner: undefined,
      });
    } catch (error) {
      next(error);
    }
  }

  // HCI: Interaction Design - Product creation for partners
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productData = req.body;

      // Validate required fields
      if (!productData.title || !productData.category || !productData.partner_id) {
        throw new ValidationError('Missing required fields', [
          { field: 'title', message: 'Title is required' },
          { field: 'category', message: 'Category is required' },
          { field: 'partner_id', message: 'Partner ID is required' },
        ]);
      }

      // Validate price logic
      if (productData.discount_price > productData.original_price) {
        throw new ValidationError('Discount price cannot be higher than original price');
      }

      const product = await Product.create(productData);

      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  // HCI: Interaction Design - Product updates with validation
  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const product = await Product.findByPk(id);

      if (!product) {
        throw new NotFoundError('Product not found');
      }

      // Validate price logic on update
      if (updateData.discount_price !== undefined && updateData.original_price !== undefined) {
        if (updateData.discount_price > updateData.original_price) {
          throw new ValidationError('Discount price cannot be higher than original price');
        }
      }

      await product.update(updateData);

      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  // HCI: Interaction Design - Soft delete for better UX
  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        throw new NotFoundError('Product not found');
      }

      // Soft delete - mark as inactive instead of removing
      await product.update({ is_active: false });

      res.json({ message: 'Product deactivated successfully' });
    } catch (error) {
      next(error);
    }
  }

  // HCI: Data at Scale - AI-powered product recommendations
  static async getRecommendedProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, limit = 6 } = req.query;

      // Simple recommendation logic based on user's past interactions
      // In a real implementation, this would use ML models
      const recommendedProducts = await Product.findAll({
        where: {
          is_active: true,
          quantity: { [Op.gt]: 0 },
        },
        include: [
          {
            model: Partner,
            as: 'Partner',
            attributes: ['name', 'rating'],
          },
        ],
        order: [
          ['discount_percentage', 'DESC'],
          ['created_at', 'DESC'],
        ],
        limit: parseInt(limit as string),
      });

      res.json({
        recommendations: recommendedProducts.map(product => ({
          ...product.toJSON(),
          partner: product.Partner,
          Partner: undefined,
        })),
        algorithm: 'popularity_based', // Would be 'ml_based' in production
      });
    } catch (error) {
      next(error);
    }
  }
}
