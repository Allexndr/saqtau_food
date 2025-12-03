import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/timezone.dart' as tz;

// HCI: Emotional Interaction - Local notification service for mobile engagement
class NotificationService {
  static final FlutterLocalNotificationsPlugin _notificationsPlugin =
      FlutterLocalNotificationsPlugin();

  static bool _initialized = false;

  // Initialize the notification service
  static Future<void> initialize() async {
    if (_initialized) return;

    const AndroidInitializationSettings androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const DarwinInitializationSettings iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const InitializationSettings settings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _notificationsPlugin.initialize(
      settings,
      onDidReceiveNotificationResponse: _onNotificationTap,
      onDidReceiveBackgroundNotificationResponse: _onNotificationTap,
    );

    // Create notification channels for Android
    await _createNotificationChannels();

    _initialized = true;
  }

  // Create notification channels for Android
  static Future<void> _createNotificationChannels() async {
    const AndroidNotificationChannel ordersChannel = AndroidNotificationChannel(
      'orders_channel',
      'Заказы',
      description: 'Уведомления о заказах',
      importance: Importance.high,
      playSound: true,
      sound: RawResourceAndroidNotificationSound('notification'),
    );

    const AndroidNotificationChannel productsChannel = AndroidNotificationChannel(
      'products_channel',
      'Товары',
      description: 'Уведомления о товарах',
      importance: Importance.defaultImportance,
      playSound: true,
    );

    const AndroidNotificationChannel promotionsChannel = AndroidNotificationChannel(
      'promotions_channel',
      'Акции',
      description: 'Промо-уведомления',
      importance: Importance.low,
      playSound: false,
    );

    const AndroidNotificationChannel systemChannel = AndroidNotificationChannel(
      'system_channel',
      'Система',
      description: 'Системные уведомления',
      importance: Importance.min,
      playSound: false,
    );

    await _notificationsPlugin
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(ordersChannel);

    await _notificationsPlugin
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(productsChannel);

    await _notificationsPlugin
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(promotionsChannel);

    await _notificationsPlugin
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(systemChannel);
  }

  // Handle notification tap
  static void _onNotificationTap(NotificationResponse response) {
    // Handle notification tap based on payload
    final payload = response.payload;
    if (payload != null) {
      // Navigate to appropriate screen based on payload
      // This would be handled by the app's navigation system
      print('Notification tapped: $payload');
    }
  }

  // Show order notification
  static Future<void> showOrderNotification({
    required int id,
    required String title,
    required String body,
    String? payload,
    String? orderId,
    String? status,
  }) async {
    await _showNotification(
      id: id,
      title: title,
      body: body,
      channelId: 'orders_channel',
      payload: payload ?? '{"type": "order", "orderId": "$orderId", "status": "$status"}',
    );
  }

  // Show product notification
  static Future<void> showProductNotification({
    required int id,
    required String title,
    required String body,
    String? payload,
    String? productId,
    String? type,
  }) async {
    await _showNotification(
      id: id,
      title: title,
      body: body,
      channelId: 'products_channel',
      payload: payload ?? '{"type": "product", "productId": "$productId", "notificationType": "$type"}',
    );
  }

  // Show promotion notification
  static Future<void> showPromotionNotification({
    required int id,
    required String title,
    required String body,
    String? payload,
    String? url,
  }) async {
    await _showNotification(
      id: id,
      title: title,
      body: body,
      channelId: 'promotions_channel',
      payload: payload ?? '{"type": "promotion", "url": "$url"}',
    );
  }

  // Show system notification
  static Future<void> showSystemNotification({
    required int id,
    required String title,
    required String body,
    String? payload,
  }) async {
    await _showNotification(
      id: id,
      title: title,
      body: body,
      channelId: 'system_channel',
      payload: payload ?? '{"type": "system"}',
    );
  }

  // Generic notification display
  static Future<void> _showNotification({
    required int id,
    required String title,
    required String body,
    required String channelId,
    String? payload,
    bool enableVibration = true,
    Importance importance = Importance.defaultImportance,
  }) async {
    if (!_initialized) {
      await initialize();
    }

    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      channelId,
      channelId == 'orders_channel' ? 'Заказы' :
      channelId == 'products_channel' ? 'Товары' :
      channelId == 'promotions_channel' ? 'Акции' : 'Система',
      channelDescription: channelId == 'orders_channel' ? 'Уведомления о заказах' :
                         channelId == 'products_channel' ? 'Уведомления о товарах' :
                         channelId == 'promotions_channel' ? 'Промо-уведомления' : 'Системные уведомления',
      importance: importance,
      priority: importance == Importance.high ? Priority.high : Priority.defaultPriority,
      enableVibration: enableVibration,
      playSound: importance != Importance.min,
      icon: '@mipmap/ic_launcher',
    );

    const DarwinNotificationDetails iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: importance != Importance.min,
    );

    const NotificationDetails details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _notificationsPlugin.show(
      id,
      title,
      body,
      details,
      payload: payload,
    );
  }

  // Schedule delayed notification
  static Future<void> scheduleNotification({
    required int id,
    required String title,
    required String body,
    required DateTime scheduledDate,
    String? payload,
    String channelId = 'system_channel',
  }) async {
    await _notificationsPlugin.zonedSchedule(
      id,
      title,
      body,
      tz.TZDateTime.from(scheduledDate, tz.local),
      _getNotificationDetails(channelId),
      payload: payload,
      androidAllowWhileIdle: true,
      uiLocalNotificationDateInterpretation:
          UILocalNotificationDateInterpretation.absoluteTime,
    );
  }

  // Cancel notification
  static Future<void> cancelNotification(int id) async {
    await _notificationsPlugin.cancel(id);
  }

  // Cancel all notifications
  static Future<void> cancelAllNotifications() async {
    await _notificationsPlugin.cancelAll();
  }

  // Get notification details based on channel
  static NotificationDetails _getNotificationDetails(String channelId) {
    final AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      channelId,
      channelId,
      channelDescription: 'Scheduled notification',
      importance: Importance.defaultImportance,
      priority: Priority.defaultPriority,
    );

    const DarwinNotificationDetails iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    return NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );
  }

  // Check if notifications are enabled
  static Future<bool> areNotificationsEnabled() async {
    return await _notificationsPlugin
            .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
            ?.areNotificationsEnabled() ??
        true; // Assume enabled on iOS if plugin is available
  }

  // Request permissions (iOS)
  static Future<bool> requestPermissions() async {
    return await _notificationsPlugin
            .resolvePlatformSpecificImplementation<IOSFlutterLocalNotificationsPlugin>()
            ?.requestPermissions(
              alert: true,
              badge: true,
              sound: true,
            ) ??
        true; // Assume granted on Android
  }
}

// Convenience methods for business logic notifications
class NotificationHelper {
  static int _notificationId = 0;

  static int _getNextId() {
    return ++_notificationId;
  }

  // Notify about new order (for sellers)
  static Future<void> notifyNewOrder(String customerName, String orderId) async {
    await NotificationService.showOrderNotification(
      id: _getNextId(),
      title: '🛒 Новый заказ',
      body: 'Заказ от $customerName (#$orderId)',
      orderId: orderId,
      status: 'new',
    );
  }

  // Notify about order status change (for buyers)
  static Future<void> notifyOrderStatusChange(String orderId, String status) async {
    final statusText = {
      'confirmed': 'подтвержден',
      'ready': 'готов к выдаче',
      'picked_up': 'получен',
      'cancelled': 'отменен'
    }[status] ?? status;

    await NotificationService.showOrderNotification(
      id: _getNextId(),
      title: '📦 Статус заказа',
      body: 'Заказ #$orderId $statusText',
      orderId: orderId,
      status: status,
    );
  }

  // Notify about low stock (for sellers)
  static Future<void> notifyLowStock(String productName, int quantity) async {
    await NotificationService.showProductNotification(
      id: _getNextId(),
      title: '⚠️ Малый остаток',
      body: 'У "$productName" осталось $quantity шт',
      type: 'low_stock',
    );
  }

  // Notify about new review (for sellers)
  static Future<void> notifyNewReview(String productName, double rating) async {
    await NotificationService.showProductNotification(
      id: _getNextId(),
      title: '⭐ Новый отзыв',
      body: 'Отзыв о "$productName" ($rating⭐)',
      type: 'review',
    );
  }

  // Notify about promotions
  static Future<void> notifyPromotion(String title, String message) async {
    await NotificationService.showPromotionNotification(
      id: _getNextId(),
      title: title,
      body: message,
    );
  }

  // Notify about system events
  static Future<void> notifySystemEvent(String title, String message) async {
    await NotificationService.showSystemNotification(
      id: _getNextId(),
      title: title,
      body: message,
    );
  }
}
