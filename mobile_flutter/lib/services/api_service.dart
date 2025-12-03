import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../models/product.dart';

// HCI: Interaction Design - Centralized API service for consistent communication
class ApiService {
  static const String baseUrl = 'http://localhost:3001/api'; // Change for production

  // HCI: Security - JWT token management
  static String? _authToken;

  // Initialize service with stored token
  static Future<void> initialize() async {
    final prefs = await SharedPreferences.getInstance();
    _authToken = prefs.getString('auth_token');
  }

  // Set authentication token
  static void setAuthToken(String token) {
    _authToken = token;
  }

  // Clear authentication token
  static Future<void> clearAuthToken() async {
    _authToken = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }

  // Helper method to create headers with authentication
  static Map<String, String> _getHeaders({bool includeAuth = true}) {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth && _authToken != null) {
      headers['Authorization'] = 'Bearer $_authToken';
    }

    return headers;
  }

  // HCI: Error Handling - Consistent error handling across all API calls
  static Exception _handleError(http.Response response) {
    try {
      final errorData = json.decode(response.body);
      final message = errorData['error']?['message'] ?? 'Unknown error occurred';
      return Exception(message);
    } catch (e) {
      return Exception('Network error: ${response.statusCode}');
    }
  }

  // Authentication methods
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: _getHeaders(includeAuth: false),
      body: json.encode({
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final token = data['token'];
      setAuthToken(token);

      // Store token locally
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', token);

      return data;
    } else {
      throw _handleError(response);
    }
  }

  static Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String? phone,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: _getHeaders(includeAuth: false),
      body: json.encode({
        'email': email,
        'password': password,
        'first_name': firstName,
        'last_name': lastName,
        'phone': phone,
      }),
    );

    if (response.statusCode == 201) {
      final data = json.decode(response.body);
      final token = data['token'];
      setAuthToken(token);

      // Store token locally
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', token);

      return data;
    } else {
      throw _handleError(response);
    }
  }

  static Future<User> getProfile() async {
    final response = await http.get(
      Uri.parse('$baseUrl/auth/profile'),
      headers: _getHeaders(),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return User.fromJson(data['user']);
    } else {
      throw _handleError(response);
    }
  }

  // Product methods
  static Future<Map<String, dynamic>> getProducts({
    String? category,
    String? search,
    double? lat,
    double? lng,
    double? radius,
    int page = 1,
    int limit = 20,
    String sortBy = 'created_at',
    String sortOrder = 'desc',
  }) async {
    final queryParams = <String, String>{};

    if (category != null) queryParams['category'] = category;
    if (search != null && search.isNotEmpty) queryParams['search'] = search;
    if (lat != null) queryParams['lat'] = lat.toString();
    if (lng != null) queryParams['lng'] = lng.toString();
    if (radius != null) queryParams['radius'] = radius.toString();
    queryParams['page'] = page.toString();
    queryParams['limit'] = limit.toString();
    queryParams['sort_by'] = sortBy;
    queryParams['sort_order'] = sortOrder;

    final uri = Uri.parse('$baseUrl/products').replace(queryParameters: queryParams);

    final response = await http.get(
      uri,
      headers: _getHeaders(includeAuth: false), // Products are public
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return {
        'products': (data['products'] as List).map((item) => Product.fromJson(item)).toList(),
        'pagination': data['pagination'],
        'filters': data['filters'],
      };
    } else {
      throw _handleError(response);
    }
  }

  static Future<Product> getProduct(String id) async {
    final response = await http.get(
      Uri.parse('$baseUrl/products/$id'),
      headers: _getHeaders(includeAuth: false),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return Product.fromJson(data);
    } else {
      throw _handleError(response);
    }
  }

  static Future<List<Product>> getRecommendedProducts() async {
    final response = await http.get(
      Uri.parse('$baseUrl/products/recommended'),
      headers: _getHeaders(includeAuth: false),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return (data['recommendations'] as List).map((item) => Product.fromJson(item)).toList();
    } else {
      throw _handleError(response);
    }
  }

  // Cart methods
  static Future<Map<String, dynamic>> getCart() async {
    final response = await http.get(
      Uri.parse('$baseUrl/cart'),
      headers: _getHeaders(),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw _handleError(response);
    }
  }

  static Future<void> addToCart(String productId, int quantity) async {
    final response = await http.post(
      Uri.parse('$baseUrl/cart/items'),
      headers: _getHeaders(),
      body: json.encode({
        'product_id': productId,
        'quantity': quantity,
      }),
    );

    if (response.statusCode != 201) {
      throw _handleError(response);
    }
  }

  static Future<void> updateCartItem(String itemId, int quantity) async {
    final response = await http.put(
      Uri.parse('$baseUrl/cart/items/$itemId'),
      headers: _getHeaders(),
      body: json.encode({
        'quantity': quantity,
      }),
    );

    if (response.statusCode != 200) {
      throw _handleError(response);
    }
  }

  static Future<void> removeFromCart(String itemId) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/cart/items/$itemId'),
      headers: _getHeaders(),
    );

    if (response.statusCode != 200) {
      throw _handleError(response);
    }
  }

  // Order methods
  static Future<Map<String, dynamic>> createOrder({
    required String paymentMethod,
    String? notes,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/orders'),
      headers: _getHeaders(),
      body: json.encode({
        'payment_method': paymentMethod,
        'notes': notes,
      }),
    );

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw _handleError(response);
    }
  }

  static Future<List<Map<String, dynamic>>> getOrders() async {
    final response = await http.get(
      Uri.parse('$baseUrl/orders'),
      headers: _getHeaders(),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return List<Map<String, dynamic>>.from(data['orders'] ?? []);
    } else {
      throw _handleError(response);
    }
  }

  // Analytics - HCI: Data Gathering
  static Future<void> trackEvent(String event, Map<String, dynamic> data) async {
    try {
      await http.post(
        Uri.parse('$baseUrl/analytics/events'),
        headers: _getHeaders(includeAuth: false),
        body: json.encode({
          'event': event,
          'data': data,
          'timestamp': DateTime.now().toIso8601String(),
          'source': 'mobile',
        }),
      );
    } catch (e) {
      // Analytics failures shouldn't break the app
      print('Analytics tracking failed: $e');
    }
  }
}
