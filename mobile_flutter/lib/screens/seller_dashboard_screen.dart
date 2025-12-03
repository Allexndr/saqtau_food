import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../widgets/seller_dashboard_content.dart';
import '../services/notification_service.dart';

class SellerDashboardScreen extends StatefulWidget {
  const SellerDashboardScreen({super.key});

  @override
  State<SellerDashboardScreen> createState() => _SellerDashboardScreenState();
}

class _SellerDashboardScreenState extends State<SellerDashboardScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('👨‍💼 Кабинет продавца'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: _testNotifications,
            tooltip: 'Тест уведомлений',
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: const [
            Tab(icon: Icon(Icons.dashboard), text: 'Обзор'),
            Tab(icon: Icon(Icons.inventory), text: 'Товары'),
            Tab(icon: Icon(Icons.shopping_cart), text: 'Заказы'),
            Tab(icon: Icon(Icons.analytics), text: 'Аналитика'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: const [
          SellerDashboardOverview(),
          SellerProductsTab(),
          SellerOrdersTab(),
          SellerAnalyticsTab(),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddProductDialog(context),
        child: const Icon(Icons.add),
        tooltip: 'Добавить товар',
      ),
    );
  }

  void _showAddProductDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Добавить товар'),
        content: const Text('Функционал добавления товара будет реализован в следующей версии'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  void _testNotifications() async {
    // Test different types of notifications
    await NotificationHelper.notifyNewOrder('Иван Петров', 'ORD-001');
    await Future.delayed(const Duration(seconds: 2));
    await NotificationHelper.notifyOrderStatusChange('ORD-001', 'ready');
    await Future.delayed(const Duration(seconds: 2));
    await NotificationHelper.notifyLowStock('Органический мед', 3);
    await Future.delayed(const Duration(seconds: 2));
    await NotificationHelper.notifyNewReview('Свежие яблоки', 4.5);
    await Future.delayed(const Duration(seconds: 2));
    await NotificationHelper.notifyPromotion('Скидка 20%!', 'На все товары раздела "Еда"');
    await Future.delayed(const Duration(seconds: 2));
    await NotificationHelper.notifySystemEvent('Обновление', 'Приложение обновлено до версии 1.1.0');

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Тестовые уведомления отправлены!')),
    );
  }
}

// Overview Tab
class SellerDashboardOverview extends StatelessWidget {
  const SellerDashboardOverview({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Stats Cards
          Row(
            children: [
              Expanded(
                child: _buildStatCard(
                  context,
                  '24',
                  'Товаров',
                  Icons.inventory,
                  Colors.blue,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildStatCard(
                  context,
                  '156',
                  'Заказов',
                  Icons.shopping_cart,
                  Colors.green,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildStatCard(
                  context,
                  '245k ₸',
                  'Выручка',
                  Icons.attach_money,
                  Colors.orange,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildStatCard(
                  context,
                  '4.2',
                  'Рейтинг',
                  Icons.star,
                  Colors.purple,
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Recent Activity
          const Text(
            'Недавняя активность',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),

          _buildActivityItem(
            'Новый заказ',
            'Заказ #ORD-001 готов к выдаче',
            '2 мин назад',
            Icons.shopping_bag,
            Colors.green,
          ),

          _buildActivityItem(
            'Отзыв',
            'Новый отзыв: 5 звезд',
            '1 час назад',
            Icons.star,
            Colors.orange,
          ),

          _buildActivityItem(
            'Продажа',
            'Продано 3 товара',
            '3 часа назад',
            Icons.trending_up,
            Colors.blue,
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(BuildContext context, String value, String label, IconData icon, Color color) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, size: 32, color: color),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActivityItem(String title, String subtitle, String time, IconData icon, Color color) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color.withOpacity(0.1),
          child: Icon(icon, color: color),
        ),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: Text(
          time,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[500],
          ),
        ),
      ),
    );
  }
}

// Products Tab
class SellerProductsTab extends StatelessWidget {
  const SellerProductsTab({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 5, // Mock data
      itemBuilder: (context, index) {
        return Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.image, color: Colors.grey),
            ),
            title: Text('Товар ${index + 1}'),
            subtitle: const Text('24 шт • 1200 ₸'),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () {},
                ),
                IconButton(
                  icon: const Icon(Icons.delete),
                  onPressed: () {},
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

// Orders Tab
class SellerOrdersTab extends StatelessWidget {
  const SellerOrdersTab({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 10,
      itemBuilder: (context, index) {
        return Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ExpansionTile(
            title: Text('Заказ #ORD-00${index + 1}'),
            subtitle: Text('Сумма: ${(index + 1) * 1200} ₸ • Статус: Готов'),
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Товары:'),
                    Text('• Свежие яблоки x2'),
                    Text('• Органический мед x1'),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        OutlinedButton(
                          onPressed: () {},
                          child: const Text('Подробнее'),
                        ),
                        const SizedBox(width: 8),
                        ElevatedButton(
                          onPressed: () {},
                          child: const Text('Выдать'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

// Analytics Tab
class SellerAnalyticsTab extends StatelessWidget {
  const SellerAnalyticsTab({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '📊 Аналитика продаж',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),

          // Mock chart placeholder
          Container(
            height: 200,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Center(
              child: Text('График продаж (будет реализован)'),
            ),
          ),

          const SizedBox(height: 24),

          const Text(
            'Ключевые метрики',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),

          _buildMetricCard('Средний чек', '2,778 ₸'),
          _buildMetricCard('Конверсия', '3.6%'),
          _buildMetricCard('Повторные покупки', '23%'),
          _buildMetricCard('Удовлетворенность', '4.2/5'),
        ],
      ),
    );
  }

  Widget _buildMetricCard(String label, String value) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label),
            Text(
              value,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
