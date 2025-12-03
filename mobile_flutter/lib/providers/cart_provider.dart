import 'package:flutter/foundation.dart';
import '../models/product.dart';
import '../services/api_service.dart';

// HCI: Cognitive Aspects - Cart state management with real-time updates
class CartItem {
  final Product product;
  int quantity;

  CartItem({
    required this.product,
    required this.quantity,
  });

  double get totalPrice => product.discountPrice * quantity;
  double get originalTotalPrice => product.originalPrice * quantity;
}

class CartProvider with ChangeNotifier {
  List<CartItem> _items = [];
  bool _isLoading = false;
  String? _error;
  String? _promoCode;
  double _discount = 0.0;

  List<CartItem> get items => _items;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String? get promoCode => _promoCode;
  double get discount => _discount;

  // Calculated totals
  double get subtotal => _items.fold(0, (sum, item) => sum + item.totalPrice);
  double get commission => subtotal * 0.15; // 15% platform commission
  double get total => subtotal + commission - _discount;
  int get itemCount => _items.fold(0, (sum, item) => sum + item.quantity);

  // HCI: Interaction Design - Load cart from API
  Future<void> loadCart() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final cartData = await ApiService.getCart();

      // Parse cart items from API response
      final items = cartData['items'] as List? ?? [];
      _items = items.map((item) {
        return CartItem(
          product: Product.fromJson(item['product']),
          quantity: item['quantity'],
        );
      }).toList();

      _promoCode = cartData['promo_code'];

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  // HCI: Emotional Interaction - Add to cart with haptic feedback
  Future<bool> addToCart(Product product, {int quantity = 1}) async {
    try {
      // Check if product already in cart
      final existingIndex = _items.indexWhere(
        (item) => item.product.id == product.id
      );

      if (existingIndex >= 0) {
        // Update quantity
        final newQuantity = _items[existingIndex].quantity + quantity;
        if (newQuantity <= product.quantity) {
          await updateQuantity(product.id, newQuantity);
        } else {
          _error = 'Недостаточно товара в наличии';
          notifyListeners();
          return false;
        }
      } else {
        // Add new item
        if (quantity <= product.quantity) {
          await ApiService.addToCart(product.id, quantity);
          _items.add(CartItem(product: product, quantity: quantity));

          // HCI: Data Gathering - Track cart additions
          await ApiService.trackEvent('cart_add', {
            'product_id': product.id,
            'quantity': quantity,
            'category': product.category,
          });
        } else {
          _error = 'Недостаточно товара в наличии';
          notifyListeners();
          return false;
        }
      }

      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // HCI: Interaction Design - Update cart item quantity
  Future<bool> updateQuantity(String productId, int quantity) async {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    try {
      final itemIndex = _items.indexWhere(
        (item) => item.product.id == productId
      );

      if (itemIndex >= 0) {
        final item = _items[itemIndex];
        if (quantity <= item.product.quantity) {
          await ApiService.updateCartItem(item.product.id, quantity);
          _items[itemIndex].quantity = quantity;

          // HCI: Data Gathering - Track quantity changes
          await ApiService.trackEvent('cart_update', {
            'product_id': productId,
            'old_quantity': item.quantity,
            'new_quantity': quantity,
          });

          notifyListeners();
          return true;
        } else {
          _error = 'Недостаточно товара в наличии';
          notifyListeners();
          return false;
        }
      }
      return false;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // HCI: Interaction Design - Remove from cart
  Future<bool> removeFromCart(String productId) async {
    try {
      final itemIndex = _items.indexWhere(
        (item) => item.product.id == productId
      );

      if (itemIndex >= 0) {
        final item = _items[itemIndex];
        await ApiService.removeFromCart(item.product.id);

        _items.removeAt(itemIndex);

        // HCI: Data Gathering - Track cart removals
        await ApiService.trackEvent('cart_remove', {
          'product_id': productId,
          'quantity': item.quantity,
        });

        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // HCI: Emotional Interaction - Clear cart with confirmation
  Future<bool> clearCart() async {
    try {
      // Note: API might not have clear cart endpoint, so we'll remove items one by one
      for (final item in _items) {
        await ApiService.removeFromCart(item.product.id);
      }

      _items.clear();
      _promoCode = null;
      _discount = 0.0;

      // HCI: Data Gathering - Track cart clearance
      await ApiService.trackEvent('cart_clear', {
        'item_count': itemCount,
      });

      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // HCI: Interaction Design - Promo code handling
  Future<bool> applyPromoCode(String code) async {
    // Simple validation (in real app, this would be server-side)
    const validCodes = ['SAVE10', 'FOOD15', 'ECO20'];

    if (validCodes.contains(code.toUpperCase())) {
      _promoCode = code.toUpperCase();
      _discount = subtotal * 0.1; // 10% discount
      notifyListeners();

      // HCI: Data Gathering - Track promo code usage
      await ApiService.trackEvent('promo_applied', {
        'code': code,
        'discount_amount': _discount,
      });

      return true;
    } else {
      _error = 'Недействительный промокод';
      notifyListeners();
      return false;
    }
  }

  void removePromoCode() {
    _promoCode = null;
    _discount = 0.0;

    // HCI: Data Gathering - Track promo removal
    ApiService.trackEvent('promo_removed', {
      'code': _promoCode,
    });

    notifyListeners();
  }

  // HCI: Emotional Interaction - Clear error state
  void clearError() {
    _error = null;
    notifyListeners();
  }

  // Check if product is in cart
  bool isInCart(String productId) {
    return _items.any((item) => item.product.id == productId);
  }

  // Get quantity of product in cart
  int getQuantity(String productId) {
    final item = _items.cast<CartItem?>().firstWhere(
      (item) => item?.product.id == productId,
      orElse: () => null,
    );
    return item?.quantity ?? 0;
  }
}
