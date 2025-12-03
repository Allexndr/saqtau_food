import 'package:flutter/foundation.dart';
import '../models/product.dart';
import '../services/api_service.dart';

// HCI: Cognitive Aspects - Centralized product state management
class ProductProvider with ChangeNotifier {
  List<Product> _products = [];
  List<Product> _recommendedProducts = [];
  bool _isLoading = false;
  String? _error;
  int _currentPage = 1;
  int _totalPages = 1;
  bool _hasMore = true;

  // Filters state
  String _selectedCategory = 'all';
  String _searchQuery = '';
  double? _userLat;
  double? _userLng;
  double _searchRadius = 10.0;

  List<Product> get products => _products;
  List<Product> get recommendedProducts => _recommendedProducts;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get hasMore => _hasMore;
  int get currentPage => _currentPage;

  // Getters for current filters
  String get selectedCategory => _selectedCategory;
  String get searchQuery => _searchQuery;
  double? get userLat => _userLat;
  double? get userLng => _userLng;
  double get searchRadius => _searchRadius;

  // HCI: Interaction Design - Load products with pagination
  Future<void> loadProducts({bool refresh = false}) async {
    if (refresh) {
      _currentPage = 1;
      _products.clear();
      _hasMore = true;
    }

    if (!_hasMore || _isLoading) return;

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await ApiService.getProducts(
        category: _selectedCategory != 'all' ? _selectedCategory : null,
        search: _searchQuery.isNotEmpty ? _searchQuery : null,
        lat: _userLat,
        lng: _userLng,
        radius: _searchRadius,
        page: _currentPage,
        limit: 20,
      );

      final newProducts = result['products'] as List<Product>;
      final pagination = result['pagination'] as Map<String, dynamic>;

      if (refresh) {
        _products = newProducts;
      } else {
        _products.addAll(newProducts);
      }

      _currentPage = pagination['page'];
      _totalPages = pagination['totalPages'];
      _hasMore = pagination['hasNext'];

      _isLoading = false;
      notifyListeners();

      // HCI: Data Gathering - Track product searches
      if (_searchQuery.isNotEmpty || _selectedCategory != 'all') {
        await ApiService.trackEvent('products_search', {
          'category': _selectedCategory,
          'search_query': _searchQuery,
          'has_location': _userLat != null,
          'results_count': newProducts.length,
        });
      }
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  // HCI: Emotional Interaction - Load personalized recommendations
  Future<void> loadRecommendedProducts() async {
    try {
      _recommendedProducts = await ApiService.getRecommendedProducts();
      notifyListeners();

      // HCI: Data Gathering - Track recommendations usage
      await ApiService.trackEvent('recommendations_viewed', {
        'count': _recommendedProducts.length,
      });
    } catch (e) {
      // Recommendations failure shouldn't break the app
      print('Failed to load recommendations: $e');
    }
  }

  // HCI: Interaction Design - Update filters and reload
  void setCategory(String category) {
    if (_selectedCategory != category) {
      _selectedCategory = category;
      loadProducts(refresh: true);
    }
  }

  void setSearchQuery(String query) {
    if (_searchQuery != query) {
      _searchQuery = query;
      loadProducts(refresh: true);
    }
  }

  void setLocation(double lat, double lng, {double radius = 10.0}) {
    _userLat = lat;
    _userLng = lng;
    _searchRadius = radius;
    loadProducts(refresh: true);
  }

  void clearLocation() {
    _userLat = null;
    _userLng = null;
    loadProducts(refresh: true);
  }

  // HCI: Cognitive Aspects - Load more products for infinite scroll
  Future<void> loadMore() async {
    if (_hasMore && !_isLoading) {
      _currentPage++;
      await loadProducts();
    }
  }

  // HCI: Emotional Interaction - Clear error state
  void clearError() {
    _error = null;
    notifyListeners();
  }

  // Get product by ID (useful for deep linking)
  Product? getProductById(String id) {
    return _products.cast<Product?>().firstWhere(
      (product) => product?.id == id,
      orElse: () => null,
    );
  }

  // HCI: Data Gathering - Track product views
  Future<void> trackProductView(Product product) async {
    await ApiService.trackEvent('product_view', {
      'product_id': product.id,
      'category': product.category,
      'partner_id': product.partnerId,
    });
  }
}
