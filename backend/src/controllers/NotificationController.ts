import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { Notification } from '../models/Notification';
import { User } from '../models/User';
import { NotificationFilters, NotFoundError, ValidationError } from '../types';

// HCI: Emotional Interaction - Notification system for user engagement
export class NotificationController {
  // HCI: Interaction Design - Get user notifications with pagination
  static async getUserNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(new ValidationError('User not authenticated'));
      }

      const { page = 1, limit = 20, type, is_read } = req.query;

      const whereClause: any = { user_id: userId };

      // Add filters
      if (type) whereClause.type = type;
      if (is_read !== undefined) whereClause.is_read = is_read === 'true';

      // Don't show expired notifications
      whereClause[Op.or] = [
        { expires_at: null },
        { expires_at: { [Op.gt]: new Date() } }
      ];

      const { count, rows: notifications } = await Notification.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit as string),
        offset: (parseInt(page as string) - 1) * parseInt(limit as string),
        order: [
          ['priority', 'DESC'], // High priority first
          ['created_at', 'DESC'] // Newest first
        ],
      });

      res.json({
        notifications,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: count,
          totalPages: Math.ceil(count / parseInt(limit as string)),
        },
        unread_count: await NotificationController.getUnreadCount(userId),
      });
    } catch (error) {
      next(error);
    }
  }

  // HCI: Interaction Design - Mark notification as read
  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        return next(new ValidationError('User not authenticated'));
      }

      const notification = await Notification.findOne({
        where: { id, user_id: userId }
      });

      if (!notification) {
        throw new NotFoundError('Notification not found');
      }

      await notification.update({ is_read: true });

      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  }

  // HCI: Interaction Design - Mark all notifications as read
  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return next(new ValidationError('User not authenticated'));
      }

      await Notification.update(
        { is_read: true },
        {
          where: {
            user_id: userId,
            is_read: false,
          }
        }
      );

      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }

  // HCI: Interaction Design - Delete notification
  static async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        return next(new ValidationError('User not authenticated'));
      }

      const notification = await Notification.findOne({
        where: { id, user_id: userId }
      });

      if (!notification) {
        throw new NotFoundError('Notification not found');
      }

      await notification.destroy();

      res.json({ message: 'Notification deleted' });
    } catch (error) {
      next(error);
    }
  }

  // HCI: Data Gathering - Get unread count for badge
  static async getUnreadCount(userId: string): Promise<number> {
    const count = await Notification.count({
      where: {
        user_id: userId,
        is_read: false,
        [Op.or]: [
          { expires_at: null },
          { expires_at: { [Op.gt]: new Date() } }
        ]
      }
    });
    return count;
  }

  // HCI: Emotional Interaction - Create notification helper
  static async createNotification(
    userId: string,
    title: string,
    message: string,
    type: 'order' | 'product' | 'system' | 'promotion',
    data?: any,
    priority: 'low' | 'medium' | 'high' = 'medium',
    expiresAt?: Date
  ): Promise<Notification> {
    const notification = await Notification.create({
      user_id: userId,
      title,
      message,
      type,
      data,
      priority,
      expires_at: expiresAt,
    });

    return notification;
  }

  // HCI: Social Interaction - Broadcast notifications to multiple users
  static async broadcastNotification(
    userIds: string[],
    title: string,
    message: string,
    type: 'order' | 'product' | 'system' | 'promotion',
    data?: any,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<void> {
    const notifications = userIds.map(userId => ({
      user_id: userId,
      title,
      message,
      type,
      data,
      priority,
      expires_at: type === 'promotion' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null, // 7 days for promotions
    }));

    await Notification.bulkCreate(notifications);
  }

  // HCI: Interaction Design - Business logic notifications
  static async notifyNewOrder(orderId: string, partnerId: string, customerName: string): Promise<void> {
    await NotificationController.createNotification(
      partnerId,
      '🛒 Новый заказ',
      `Поступил новый заказ от ${customerName}`,
      'order',
      { order_id: orderId },
      'high'
    );
  }

  static async notifyOrderStatusUpdate(orderId: string, userId: string, status: string): Promise<void> {
    const statusText = {
      'confirmed': 'подтвержден',
      'ready': 'готов к выдаче',
      'picked_up': 'получен',
      'cancelled': 'отменен'
    }[status] || status;

    await NotificationController.createNotification(
      userId,
      '📦 Статус заказа изменен',
      `Ваш заказ #${orderId} ${statusText}`,
      'order',
      { order_id: orderId },
      'medium'
    );
  }

  static async notifyLowStock(productId: string, partnerId: string, productName: string, quantity: number): Promise<void> {
    await NotificationController.createNotification(
      partnerId,
      '⚠️ Малый остаток',
      `У товара "${productName}" осталось ${quantity} шт`,
      'product',
      { product_id: productId },
      'medium'
    );
  }

  static async notifyNewReview(partnerId: string, productName: string, rating: number): Promise<void> {
    await NotificationController.createNotification(
      partnerId,
      '⭐ Новый отзыв',
      `Получен новый отзыв о товаре "${productName}" (${rating} звезд)`,
      'product',
      { rating },
      'low'
    );
  }

  static async notifyPromotion(title: string, message: string, targetUsers?: string[]): Promise<void> {
    if (targetUsers && targetUsers.length > 0) {
      await NotificationController.broadcastNotification(
        targetUsers,
        title,
        message,
        'promotion',
        null,
        'low'
      );
    } else {
      // Broadcast to all users (in real app, would be more selective)
      const users = await User.findAll({ attributes: ['id'] });
      const userIds = users.map(user => user.id);

      await NotificationController.broadcastNotification(
        userIds,
        title,
        message,
        'promotion',
        null,
        'low'
      );
    }
  }
}
