import { useState, useEffect, useRef } from 'react';
import {
  Badge, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Typography,
  Box, Divider, Button, Chip, CircularProgress, Alert, Snackbar,
} from '@mui/material';
import {
  Notifications, NotificationsActive, DoneAll, Delete, ShoppingCart,
  LocalOffer, Info, Star,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

// HCI: Emotional Interaction - Notification center for user engagement
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'product' | 'system' | 'promotion';
  is_read: boolean;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  data?: any;
}

interface NotificationCenterProps {
  userId?: string;
}

const NotificationCenter = ({ userId }: NotificationCenterProps) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const open = Boolean(anchorEl);

  // Mock data for demonstration - in real app would fetch from API
  useEffect(() => {
    if (userId) {
      loadNotifications();
    }
  }, [userId]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Mock notifications data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Новый заказ',
          message: 'У вас новый заказ от пользователя Иван',
          type: 'order',
          is_read: false,
          priority: 'high',
          created_at: new Date().toISOString(),
          data: { order_id: 'ORD-001' },
        },
        {
          id: '2',
          title: 'Товар распродан',
          message: 'Органический мед закончился на складе',
          type: 'product',
          is_read: false,
          priority: 'medium',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '3',
          title: 'Акция!',
          message: 'Скидка 20% на все товары в разделе "Еда"',
          type: 'promotion',
          is_read: true,
          priority: 'low',
          created_at: new Date(Date.now() - 7200000).toISOString(),
        },
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // In real app: await api.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      showSnackbar('Уведомление отмечено как прочитанное', 'success');
    } catch (error) {
      showSnackbar('Ошибка при обновлении уведомления', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // In real app: await api.markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
      showSnackbar('Все уведомления отмечены как прочитанные', 'success');
    } catch (error) {
      showSnackbar('Ошибка при обновлении уведомлений', 'error');
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      // In real app: await api.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev =>
        Math.max(0, prev - (notifications.find(n => n.id === notificationId)?.is_read ? 0 : 1))
      );
      showSnackbar('Уведомление удалено', 'success');
    } catch (error) {
      showSnackbar('Ошибка при удалении уведомления', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart color="primary" />;
      case 'product': return <LocalOffer color="secondary" />;
      case 'system': return <Info color="info" />;
      case 'promotion': return <Star color="warning" />;
      default: return <Notifications />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    return `${diffDays} д назад`;
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ mr: 1 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? <NotificationsActive /> : <Notifications />}
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 600,
            borderRadius: 2,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Уведомления
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={handleMarkAllAsRead}
                sx={{ textTransform: 'none' }}
              >
                Отметить все
              </Button>
            )}
          </Box>
        </Box>

        <Divider />

        {/* Loading */}
        {loading && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              Загрузка...
            </Typography>
          </Box>
        )}

        {/* Notifications List */}
        {!loading && (
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {notifications.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Notifications sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  У вас нет уведомлений
                </Typography>
              </Box>
            ) : (
              AnimatePresence>
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MenuItem
                      sx={{
                        py: 2,
                        px: 2,
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        backgroundColor: notification.is_read ? 'transparent' : 'action.hover',
                        borderLeft: notification.is_read ? 'none' : `4px solid`,
                        borderLeftColor: notification.is_read ? 'transparent' : 'primary.main',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {getNotificationIcon(notification.type)}
                        </ListItemIcon>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
                              {notification.title}
                            </Typography>
                            <Chip
                              label={notification.priority}
                              size="small"
                              color={getPriorityColor(notification.priority) as any}
                              sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                            {notification.message}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.disabled">
                              {formatTime(notification.created_at)}
                            </Typography>
                            <Box>
                              {!notification.is_read && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  title="Отметить как прочитанное"
                                >
                                  <DoneAll fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteNotification(notification.id)}
                                title="Удалить"
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </MenuItem>
                    {index < notifications.length - 1 && <Divider />}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </Box>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1 }}>
              <Button
                fullWidth
                size="small"
                onClick={() => {
                  // Navigate to full notifications page
                  handleClose();
                }}
                sx={{ textTransform: 'none' }}
              >
                Посмотреть все уведомления
              </Button>
            </Box>
          </>
        )}
      </Menu>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NotificationCenter;
