import { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Grid, Card, CardContent, Tabs, Tab, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Alert, useTheme, useMediaQuery,
} from '@mui/material';
import {
  Dashboard, Inventory, ShoppingCart, Analytics, Settings, Add,
  Edit, Delete, TrendingUp, People, AttachMoney, Star,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// HCI: Interaction Design - Comprehensive seller dashboard with analytics and management
interface SellerDashboardProps {
  user: any; // User from auth context
}

const SellerDashboard = ({ user }: SellerDashboardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState(0);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productDialog, setProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Mock data for demonstration - in real app, fetch from API
  useEffect(() => {
    loadDashboardData();
    loadProducts();
    loadOrders();
  }, []);

  const loadDashboardData = async () => {
    try {
      // In real app: const response = await api.getSellerDashboard();
      const mockData = {
        stats: {
          total_products: 24,
          active_products: 18,
          total_orders: 156,
          total_revenue: 245000,
          average_rating: 4.2,
        },
        charts: {
          weekly_views: [
            { date: '2024-01-01', views: 45 },
            { date: '2024-01-02', views: 52 },
            { date: '2024-01-03', views: 38 },
            { date: '2024-01-04', views: 61 },
            { date: '2024-01-05', views: 49 },
            { date: '2024-01-06', views: 73 },
            { date: '2024-01-07', views: 58 },
          ],
          revenue_trend: [
            { month: 'Окт', revenue: 18500 },
            { month: 'Ноя', revenue: 22100 },
            { month: 'Дек', revenue: 19800 },
            { month: 'Янв', revenue: 25600 },
          ],
        },
        top_products: [
          { id: '1', title: 'Свежие яблоки', price: 1200, views: 245, orders: 18 },
          { id: '2', title: 'Органический мед', price: 3500, views: 189, orders: 12 },
          { id: '3', title: 'Домашний сыр', price: 2800, views: 156, orders: 9 },
        ],
      };
      setDashboardData(mockData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    // Mock products data
    const mockProducts = [
      {
        id: '1',
        title: 'Свежие яблоки',
        category: 'food',
        discount_price: 1200,
        quantity: 50,
        is_active: true,
        created_at: '2024-01-15',
      },
      {
        id: '2',
        title: 'Органический мед',
        category: 'food',
        discount_price: 3500,
        quantity: 25,
        is_active: true,
        created_at: '2024-01-10',
      },
    ];
    setProducts(mockProducts);
  };

  const loadOrders = async () => {
    // Mock orders data
    const mockOrders = [
      {
        id: 'ORD-001',
        status: 'ready',
        total: 4700,
        created_at: '2024-01-15',
        items: ['Свежие яблоки', 'Органический мед'],
      },
      {
        id: 'ORD-002',
        status: 'pending',
        total: 1200,
        created_at: '2024-01-14',
        items: ['Свежие яблоки'],
      },
    ];
    setOrders(mockOrders);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'ready': return 'success';
      case 'picked_up': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'confirmed': return 'Подтвержден';
      case 'ready': return 'Готов к выдаче';
      case 'picked_up': return 'Получен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Dashboard sx={{ fontSize: 48, color: theme.palette.primary.main }} />
          </motion.div>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          👨‍💼 Кабинет продавца
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Управляйте своими товарами, заказами и аналитикой
        </Typography>
      </Box>

      {/* Stats Cards */}
      {dashboardData && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card sx={{ borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Inventory sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {dashboardData.stats.total_products}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Всего товаров
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card sx={{ borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <ShoppingCart sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {dashboardData.stats.total_orders}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Заказов
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card sx={{ borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <AttachMoney sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {dashboardData.stats.total_revenue.toLocaleString()} ₸
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Выручка
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card sx={{ borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Star sx={{ fontSize: 40, color: theme.palette.secondary.main, mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {dashboardData.stats.average_rating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Рейтинг
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Card sx={{ borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons={isMobile ? 'auto' : false}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
            },
          }}
        >
          <Tab icon={<Dashboard />} label="Обзор" />
          <Tab icon={<Inventory />} label="Товары" />
          <Tab icon={<ShoppingCart />} label="Заказы" />
          <Tab icon={<Analytics />} label="Аналитика" />
          <Tab icon={<Settings />} label="Настройки" />
        </Tabs>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview Tab */}
            {activeTab === 0 && dashboardData && (
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    📊 Обзор за неделю
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Card sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                          Просмотры товаров
                        </Typography>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={dashboardData.charts.weekly_views}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="views"
                              stroke={theme.palette.primary.main}
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Card sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                          Топ товаров
                        </Typography>
                        {dashboardData.top_products.map((product: any, index: number) => (
                          <Box key={product.id} sx={{ mb: 1.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ flex: 1, mr: 1 }}>
                                {index + 1}. {product.title}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                                {product.orders} заказов
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            )}

            {/* Products Tab */}
            {activeTab === 1 && (
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      📦 Мои товары
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setProductDialog(true)}
                      sx={{ borderRadius: 2 }}
                    >
                      Добавить товар
                    </Button>
                  </Box>

                  <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Название</TableCell>
                          <TableCell>Категория</TableCell>
                          <TableCell>Цена</TableCell>
                          <TableCell>Остаток</TableCell>
                          <TableCell>Статус</TableCell>
                          <TableCell>Действия</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id} hover>
                            <TableCell>{product.title}</TableCell>
                            <TableCell>
                              <Chip
                                label={product.category === 'food' ? '🍎 Еда' : '👕 Одежда'}
                                size="small"
                                color={product.category === 'food' ? 'success' : 'primary'}
                              />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              {product.discount_price} ₸
                            </TableCell>
                            <TableCell>{product.quantity} шт</TableCell>
                            <TableCell>
                              <Chip
                                label={product.is_active ? 'Активен' : 'Неактивен'}
                                size="small"
                                color={product.is_active ? 'success' : 'default'}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton size="small" color="primary">
                                <Edit />
                              </IconButton>
                              <IconButton size="small" color="error">
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </CardContent>
            )}

            {/* Orders Tab */}
            {activeTab === 2 && (
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    📋 Заказы
                  </Typography>

                  <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Номер заказа</TableCell>
                          <TableCell>Дата</TableCell>
                          <TableCell>Товары</TableCell>
                          <TableCell>Сумма</TableCell>
                          <TableCell>Статус</TableCell>
                          <TableCell>Действия</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id} hover>
                            <TableCell sx={{ fontWeight: 600 }}>{order.id}</TableCell>
                            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>{order.items.join(', ')}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              {order.total} ₸
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={getStatusText(order.status)}
                                size="small"
                                color={getStatusColor(order.status) as any}
                              />
                            </TableCell>
                            <TableCell>
                              <Button size="small" variant="outlined">
                                Подробнее
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </CardContent>
            )}

            {/* Analytics Tab */}
            {activeTab === 3 && dashboardData && (
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    📈 Детальная аналитика
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                          Выручка по месяцам
                        </Typography>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={dashboardData.charts.revenue_trend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="revenue" fill={theme.palette.primary.main} />
                          </BarChart>
                        </ResponsiveContainer>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                          Статистика клиентов
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Средний чек</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              2,778 ₸
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Повторные клиенты</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              12 чел
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Новые клиенты</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              33 чел
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Конверсия просмотров</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              3.6%
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            )}

            {/* Settings Tab */}
            {activeTab === 4 && (
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    ⚙️ Настройки продавца
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                          Профиль бизнеса
                        </Typography>
                        <TextField
                          fullWidth
                          label="Название бизнеса"
                          defaultValue="Мой Магазин"
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          label="Описание"
                          multiline
                          rows={3}
                          defaultValue="Продаем свежие продукты и качественную одежду"
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          label="Телефон"
                          defaultValue="+7 (777) 123-45-67"
                          sx={{ mb: 2 }}
                        />
                        <Button variant="outlined" sx={{ borderRadius: 2 }}>
                          Сохранить изменения
                        </Button>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                          Уведомления
                        </Typography>
                        <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                          Настройте, какие уведомления вы хотите получать
                        </Alert>
                        {/* Notification settings would go here */}
                        <Typography variant="body2" color="text.secondary">
                          Функционал уведомлений будет добавлен в следующей версии
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            )}
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Product Dialog */}
      <Dialog
        open={productDialog}
        onClose={() => setProductDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Добавить новый товар</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Название товара"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Категория"
                defaultValue="food"
                required
              >
                <MenuItem value="food">🍎 Еда</MenuItem>
                <MenuItem value="fashion">👕 Одежда</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Оригинальная цена"
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Цена со скидкой"
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Количество"
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Единица измерения"
                defaultValue="шт"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Описание"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductDialog(false)}>Отмена</Button>
          <Button variant="contained" onClick={() => setProductDialog(false)}>
            Добавить товар
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SellerDashboard;
