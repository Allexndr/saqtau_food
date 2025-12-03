import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import '../providers/auth_provider.dart';
import '../providers/product_provider.dart';
import '../providers/cart_provider.dart';
import '../widgets/product_card.dart';
import '../widgets/category_filter.dart';
import '../widgets/search_bar.dart';
import '../widgets/notification_center.dart';
import 'auth_screen.dart';
import 'seller_dashboard_screen.dart';

// HCI: Interaction Design - Main home screen with product discovery
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  late TabController _tabController;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);

    // Load initial data
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadInitialData();
    });

    // Setup scroll listener for infinite scroll
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _loadInitialData() {
    final productProvider = Provider.of<ProductProvider>(context, listen: false);
    productProvider.loadProducts(refresh: true);
    productProvider.loadRecommendedProducts();
  }

  void _onScroll() {
    final productProvider = Provider.of<ProductProvider>(context, listen: false);
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      productProvider.loadMore();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('🍎 Saqtau Platform'),
        actions: [
          const NotificationCenter(),
          IconButton(
            icon: const Icon(Icons.store),
            onPressed: () => _showAuthDialog(context, 'partner'),
            tooltip: 'Войти как продавец',
          ),
          IconButton(
            icon: const Icon(Icons.login),
            onPressed: () => _showAuthDialog(context, 'user'),
            tooltip: 'Войти как покупатель',
          ),
        ],
      ),
      body: SafeArea(
        child: NestedScrollView(
          headerSliverBuilder: (context, innerBoxIsScrolled) => [
            // HCI: Emotional Interaction - Hero section with branding
            SliverToBoxAdapter(
              child: _buildHeroSection(),
            ),

            // HCI: Social Interaction - Stats showcase
            SliverToBoxAdapter(
              child: _buildStatsSection(),
            ),

            // HCI: Interaction Design - Category filters
            SliverPersistentHeader(
              delegate: _CategoryFilterDelegate(),
              pinned: true,
            ),

            // HCI: Cognitive Aspects - Search bar
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: CustomSearchBar(
                  onSearch: (query) {
                    Provider.of<ProductProvider>(context, listen: false)
                        .setSearchQuery(query);
                  },
                ),
              ),
            ),
          ],
          body: Consumer<ProductProvider>(
            builder: (context, productProvider, child) {
              if (productProvider.error != null) {
                return _buildErrorState(productProvider);
              }

              return AnimationLimiter(
                child: RefreshIndicator(
                  onRefresh: () => productProvider.loadProducts(refresh: true),
                  child: CustomScrollView(
                    controller: _scrollController,
                    slivers: [
                      // HCI: Emotional Interaction - AI recommendations
                      if (productProvider.recommendedProducts.isNotEmpty)
                        SliverToBoxAdapter(
                          child: _buildRecommendationsSection(productProvider),
                        ),

                      // HCI: Interaction Design - Product grid
                      SliverPadding(
                        padding: const EdgeInsets.all(16),
                        sliver: SliverGrid(
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            childAspectRatio: 0.75,
                            crossAxisSpacing: 12,
                            mainAxisSpacing: 12,
                          ),
                          delegate: SliverChildBuilderDelegate(
                            (context, index) {
                              final product = productProvider.products[index];

                              return AnimationConfiguration.staggeredGrid(
                                position: index,
                                duration: const Duration(milliseconds: 375),
                                columnCount: 2,
                                child: ScaleAnimation(
                                  child: FadeInAnimation(
                                    child: ProductCard(
                                      product: product,
                                      onTap: () {
                                        // Navigate to product detail
                                        _navigateToProductDetail(product);
                                      },
                                    ),
                                  ),
                                ),
                              );
                            },
                            childCount: productProvider.products.length,
                          ),
                        ),
                      ),

                      // Loading indicator
                      if (productProvider.isLoading)
                        const SliverToBoxAdapter(
                          child: Padding(
                            padding: EdgeInsets.all(16),
                            child: Center(child: CircularProgressIndicator()),
                          ),
                        ),

                      // Load more indicator
                      if (productProvider.hasMore && !productProvider.isLoading)
                        SliverToBoxAdapter(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: TextButton(
                              onPressed: () => productProvider.loadMore(),
                              child: const Text('Загрузить ещё'),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildHeroSection() {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Theme.of(context).primaryColor.withOpacity(0.1),
            Theme.of(context).secondaryHeaderColor.withOpacity(0.1),
          ],
        ),
      ),
      child: Stack(
        children: [
          Positioned.fill(
            child: Opacity(
              opacity: 0.1,
              child: Image.asset(
                'assets/images/hero_pattern.png',
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(),
              ),
            ),
          ),
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  '🍎 SaqtauFood & 👕 SaqtauKiem',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  'Спасаем еду и одежду от утилизации',
                  style: TextStyle(
                    fontSize: 16,
                    color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7),
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _buildStatItem('25,000+', 'Продуктов спасено', Icons.eco),
          _buildStatItem('150+', 'Партнёров', Icons.business),
          _buildStatItem('8,500+', 'Пользователей', Icons.people),
          _buildStatItem('50 тн', 'CO₂ сэкономлено', Icons.cloud),
        ],
      ),
    );
  }

  Widget _buildStatItem(String value, String label, IconData icon) {
    return Column(
      children: [
        Icon(icon, size: 32, color: Theme.of(context).primaryColor),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Theme.of(context).textTheme.bodySmall?.color,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildRecommendationsSection(ProductProvider productProvider) {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.smart_toy, color: Colors.orange),
              const SizedBox(width: 8),
              Text(
                '🎯 Рекомендации для вас',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 200,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: productProvider.recommendedProducts.length,
              itemBuilder: (context, index) {
                final product = productProvider.recommendedProducts[index];
                return Container(
                  width: 160,
                  margin: const EdgeInsets.only(right: 12),
                  child: ProductCard(
                    product: product,
                    compact: true,
                    onTap: () => _navigateToProductDetail(product),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(ProductProvider productProvider) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 64, color: Colors.red),
          const SizedBox(height: 16),
          Text(
            'Ошибка загрузки',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          Text(
            productProvider.error ?? 'Неизвестная ошибка',
            style: Theme.of(context).textTheme.bodyMedium,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => productProvider.loadProducts(refresh: true),
            child: const Text('Попробовать снова'),
          ),
        ],
      ),
    );
  }

  void _navigateToProductDetail(product) {
    // TODO: Navigate to product detail screen
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Открыть детальную страницу для ${product.title}')),
    );
  }
}

class _CategoryFilterDelegate extends SliverPersistentHeaderDelegate {
  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(
      color: Theme.of(context).scaffoldBackgroundColor,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: const CategoryFilter(),
    );
  }

  @override
  double get maxExtent => 60;

  @override
  double get minExtent => 60;

  @override
  bool shouldRebuild(covariant SliverPersistentHeaderDelegate oldDelegate) => false;
}
