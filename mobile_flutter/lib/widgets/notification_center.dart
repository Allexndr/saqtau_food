import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/notification_service.dart';

// HCI: Emotional Interaction - Mobile notification center widget
class NotificationCenter extends StatefulWidget {
  final String? userId;

  const NotificationCenter({super.key, this.userId});

  @override
  State<NotificationCenter> createState() => _NotificationCenterState();
}

class _NotificationCenterState extends State<NotificationCenter> {
  List<Map<String, dynamic>> _notifications = [];
  bool _isLoading = false;
  int _unreadCount = 0;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  @override
  void didUpdateWidget(NotificationCenter oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.userId != oldWidget.userId && widget.userId != null) {
      _loadNotifications();
    }
  }

  Future<void> _loadNotifications() async {
    if (widget.userId == null) return;

    setState(() => _isLoading = true);

    try {
      final notifications = await ApiService.getNotifications(
        page: 1,
        limit: 50,
      );

      setState(() {
        _notifications = notifications;
        _unreadCount = notifications.where((n) => !(n['is_read'] as bool? ?? false)).length;
      });
    } catch (error) {
      print('Failed to load notifications: $error');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _markAsRead(String notificationId) async {
    try {
      await ApiService.markNotificationAsRead(notificationId);
      setState(() {
        final index = _notifications.indexWhere((n) => n['id'] == notificationId);
        if (index >= 0) {
          _notifications[index]['is_read'] = true;
          _unreadCount = _notifications.where((n) => !(n['is_read'] as bool? ?? false)).length;
        }
      });
    } catch (error) {
      print('Failed to mark notification as read: $error');
    }
  }

  Future<void> _markAllAsRead() async {
    try {
      await ApiService.markAllNotificationsAsRead();
      setState(() {
        for (final notification in _notifications) {
          notification['is_read'] = true;
        }
        _unreadCount = 0;
      });
    } catch (error) {
      print('Failed to mark all notifications as read: $error');
    }
  }

  IconData _getNotificationIcon(String type) {
    switch (type) {
      case 'order':
        return Icons.shopping_cart;
      case 'product':
        return Icons.inventory;
      case 'system':
        return Icons.info;
      case 'promotion':
        return Icons.local_offer;
      default:
        return Icons.notifications;
    }
  }

  Color _getNotificationColor(String type) {
    switch (type) {
      case 'order':
        return Colors.blue;
      case 'product':
        return Colors.green;
      case 'system':
        return Colors.grey;
      case 'promotion':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  String _getPriorityText(String priority) {
    switch (priority) {
      case 'high':
        return 'Высокий';
      case 'medium':
        return 'Средний';
      case 'low':
        return 'Низкий';
      default:
        return '';
    }
  }

  void _showNotificationDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            const Text('Уведомления'),
            if (_unreadCount > 0) ...[
              const SizedBox(width: 8),
              CircleAvatar(
                radius: 12,
                backgroundColor: Colors.red,
                child: Text(
                  _unreadCount.toString(),
                  style: const TextStyle(color: Colors.white, fontSize: 12),
                ),
              ),
            ],
          ],
        ),
        content: SizedBox(
          width: double.maxFinite,
          height: 400,
          child: _isLoading
              ? const Center(child: CircularProgressIndicator())
              : _notifications.isEmpty
                  ? const Center(child: Text('Нет уведомлений'))
                  : ListView.builder(
                      itemCount: _notifications.length,
                      itemBuilder: (context, index) {
                        final notification = _notifications[index];
                        final isRead = notification['is_read'] as bool? ?? false;

                        return Card(
                          margin: const EdgeInsets.only(bottom: 8),
                          color: isRead ? null : Colors.blue.withOpacity(0.1),
                          child: ListTile(
                            leading: CircleAvatar(
                              backgroundColor: _getNotificationColor(notification['type']).withOpacity(0.2),
                              child: Icon(
                                _getNotificationIcon(notification['type']),
                                color: _getNotificationColor(notification['type']),
                              ),
                            ),
                            title: Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    notification['title'] ?? '',
                                    style: TextStyle(
                                      fontWeight: isRead ? FontWeight.normal : FontWeight.bold,
                                    ),
                                  ),
                                ),
                                if (notification['priority'] != 'medium')
                                  Chip(
                                    label: Text(
                                      _getPriorityText(notification['priority']),
                                      style: const TextStyle(fontSize: 10),
                                    ),
                                    size: Size.small,
                                    color: MaterialStateProperty.all(
                                      notification['priority'] == 'high'
                                          ? Colors.red.withOpacity(0.1)
                                          : Colors.orange.withOpacity(0.1),
                                    ),
                                  ),
                              ],
                            ),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(notification['message'] ?? ''),
                                const SizedBox(height: 4),
                                Text(
                                  _formatTime(notification['created_at']),
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey[600],
                                  ),
                                ),
                              ],
                            ),
                            trailing: !isRead
                                ? IconButton(
                                    icon: const Icon(Icons.check),
                                    onPressed: () => _markAsRead(notification['id']),
                                    tooltip: 'Отметить как прочитанное',
                                  )
                                : null,
                            onTap: () => _markAsRead(notification['id']),
                          ),
                        );
                      },
                    ),
        ),
        actions: [
          if (_unreadCount > 0)
            TextButton(
              onPressed: () {
                _markAllAsRead();
                Navigator.of(context).pop();
              },
              child: const Text('Отметить все прочитанными'),
            ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Закрыть'),
          ),
        ],
      ),
    );
  }

  String _formatTime(String dateString) {
    try {
      final date = DateTime.parse(dateString);
      final now = DateTime.now();
      final difference = now.difference(date);

      if (difference.inDays > 0) {
        return '${difference.inDays} д назад';
      } else if (difference.inHours > 0) {
        return '${difference.inHours} ч назад';
      } else if (difference.inMinutes > 0) {
        return '${difference.inMinutes} мин назад';
      } else {
        return 'только что';
      }
    } catch (e) {
      return '';
    }
  }

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: Badge(
        isLabelVisible: _unreadCount > 0,
        label: Text(_unreadCount.toString()),
        child: const Icon(Icons.notifications),
      ),
      onPressed: () => _showNotificationDialog(context),
      tooltip: 'Уведомления',
    );
  }
}
