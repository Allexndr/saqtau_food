// HCI: Emotional Interaction - Browser notification service for user engagement
class NotificationService {
  private static permissionGranted = false;

  // Request permission for browser notifications
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.permissionGranted = true;
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
      return this.permissionGranted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Show browser notification
  static showNotification(
    title: string,
    options: {
      body?: string;
      icon?: string;
      badge?: string;
      tag?: string;
      data?: any;
      actions?: NotificationAction[];
      silent?: boolean;
    } = {}
  ): void {
    if (!this.permissionGranted) {
      console.warn('Notification permission not granted');
      return;
    }

    const defaultOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      silent: false,
      ...options,
    };

    try {
      const notification = new Notification(title, defaultOptions);

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle click
      notification.onclick = () => {
        window.focus();
        if (options.data?.url) {
          window.location.href = options.data.url;
        }
        notification.close();
      };

      // Handle close
      notification.onclose = () => {
        // Track notification interaction
        console.log('Notification closed:', title);
      };

    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  // Show order-related notifications
  static showOrderNotification(orderId: string, status: string, customerName?: string): void {
    const statusText = {
      'confirmed': 'подтвержден',
      'ready': 'готов к выдаче',
      'picked_up': 'получен',
      'cancelled': 'отменен'
    }[status] || status;

    const title = status === 'confirmed' && customerName
      ? `🛒 Новый заказ от ${customerName}`
      : `📦 Заказ ${statusText}`;

    const body = status === 'confirmed' && customerName
      ? `Поступил новый заказ #${orderId}`
      : `Ваш заказ #${orderId} ${statusText}`;

    this.showNotification(title, {
      body,
      tag: `order-${orderId}`,
      data: { url: `/orders/${orderId}`, orderId, status },
    });
  }

  // Show product-related notifications
  static showProductNotification(productName: string, type: 'low_stock' | 'out_of_stock' | 'new_review'): void {
    const notifications = {
      low_stock: {
        title: '⚠️ Малый остаток',
        body: `У товара "${productName}" заканчивается запас`,
      },
      out_of_stock: {
        title: '❌ Товар закончился',
        body: `Товар "${productName}" распродан`,
      },
      new_review: {
        title: '⭐ Новый отзыв',
        body: `Получен новый отзыв о товаре "${productName}"`,
      },
    };

    const notification = notifications[type];
    if (notification) {
      this.showNotification(notification.title, {
        body: notification.body,
        tag: `product-${type}`,
      });
    }
  }

  // Show promotional notifications
  static showPromotionNotification(title: string, message: string, url?: string): void {
    this.showNotification(`🎉 ${title}`, {
      body: message,
      tag: 'promotion',
      data: { url },
    });
  }

  // Show system notifications
  static showSystemNotification(title: string, message: string): void {
    this.showNotification(`ℹ️ ${title}`, {
      body: message,
      tag: 'system',
    });
  }

  // Initialize service and request permissions
  static async initialize(): Promise<void> {
    const granted = await this.requestPermission();
    if (granted) {
      console.log('Browser notifications enabled');
    } else {
      console.log('Browser notifications disabled');
    }
  }

  // Check if notifications are supported
  static isSupported(): boolean {
    return 'Notification' in window;
  }

  // Get current permission status
  static getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }
}

export default NotificationService;
