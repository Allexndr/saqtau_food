import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/product.dart';
import '../providers/cart_provider.dart';
import '../providers/auth_provider.dart';

// HCI: Interaction Design - Product card with rich interactions
class ProductCard extends StatelessWidget {
  final Product product;
  final bool compact;
  final VoidCallback? onTap;

  const ProductCard({
    super.key,
    required this.product,
    this.compact = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final cartProvider = Provider.of<CartProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);
    final isInCart = cartProvider.isInCart(product.id);

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product Image with Badge
            Stack(
              children: [
                AspectRatio(
                  aspectRatio: compact ? 1.2 : 1.0,
                  child: ClipRRect(
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                    child: product.images.isNotEmpty
                        ? CachedNetworkImage(
                            imageUrl: product.images[0],
                            fit: BoxFit.cover,
                            placeholder: (context, url) => Container(
                              color: Colors.grey[200],
                              child: const Center(
                                child: CircularProgressIndicator(),
                              ),
                            ),
                            errorWidget: (context, url, error) => Container(
                              color: Colors.grey[200],
                              child: Center(
                                child: Text(
                                  product.categoryEmoji,
                                  style: const TextStyle(fontSize: 32),
                                ),
                              ),
                            ),
                          )
                        : Container(
                            color: Colors.grey[200],
                            child: Center(
                              child: Text(
                                product.categoryEmoji,
                                style: const TextStyle(fontSize: 32),
                              ),
                            ),
                          ),
                  ),
                ),

                // Discount Badge
                if (product.discountPercentage > 0)
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: product.isFood
                            ? Colors.green
                            : Theme.of(context).primaryColor,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '-${product.discountPercentage}%',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),

                // Favorite Button (if authenticated)
                if (authProvider.isAuthenticated)
                  Positioned(
                    top: 8,
                    right: 8,
                    child: IconButton(
                      onPressed: () {
                        // TODO: Implement favorites
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Избранное скоро будет доступно')),
                        );
                      },
                      icon: const Icon(Icons.favorite_border),
                      style: IconButton.styleFrom(
                        backgroundColor: Colors.white.withOpacity(0.9),
                        padding: const EdgeInsets.all(8),
                      ),
                      iconSize: 16,
                    ),
                  ),
              ],
            ),

            // Product Info
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Category Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: product.isFood
                          ? Colors.green.withOpacity(0.1)
                          : Theme.of(context).primaryColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      product.category == 'food' ? '🍎 Еда' : '👕 Одежда',
                      style: TextStyle(
                        fontSize: 10,
                        color: product.isFood
                            ? Colors.green[700]
                            : Theme.of(context).primaryColor,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),

                  const SizedBox(height: 6),

                  // Title
                  Text(
                    product.title,
                    style: TextStyle(
                      fontSize: compact ? 12 : 14,
                      fontWeight: FontWeight.w600,
                      height: 1.2,
                    ),
                    maxLines: compact ? 2 : 3,
                    overflow: TextOverflow.ellipsis,
                  ),

                  if (!compact) ...[
                    const SizedBox(height: 4),

                    // Partner
                    Text(
                      product.partner?.name ?? 'Партнёр',
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],

                  const SizedBox(height: 6),

                  // Price
                  Row(
                    children: [
                      Text(
                        product.displayPrice,
                        style: TextStyle(
                          fontSize: compact ? 14 : 16,
                          fontWeight: FontWeight.bold,
                          color: product.isFood
                              ? Colors.green[700]
                              : Theme.of(context).primaryColor,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        product.originalPriceDisplay,
                        style: TextStyle(
                          fontSize: compact ? 10 : 12,
                          color: Colors.grey[500],
                          decoration: TextDecoration.lineThrough,
                        ),
                      ),
                    ],
                  ),

                  if (!compact) ...[
                    const SizedBox(height: 4),

                    // Stock and Location
                    Row(
                      children: [
                        Icon(
                          Icons.inventory_2,
                          size: 12,
                          color: Colors.grey[500],
                        ),
                        const SizedBox(width: 2),
                        Text(
                          '${product.quantity} ${product.unit}',
                          style: TextStyle(
                            fontSize: 10,
                            color: Colors.grey[600],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Icon(
                          Icons.location_on,
                          size: 12,
                          color: Colors.grey[500],
                        ),
                        const SizedBox(width: 2),
                        Expanded(
                          child: Text(
                            product.location.address?.split(',')[0] ?? 'Адрес',
                            style: TextStyle(
                              fontSize: 10,
                              color: Colors.grey[600],
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],

                  const SizedBox(height: 8),

                  // Add to Cart Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () async {
                        if (authProvider.isAuthenticated) {
                          final success = await cartProvider.addToCart(product);
                          if (success && context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('${product.title} добавлен в корзину'),
                                action: SnackBarAction(
                                  label: 'Корзина',
                                  onPressed: () {
                                    // TODO: Navigate to cart
                                  },
                                ),
                              ),
                            );
                          }
                        } else {
                          // Prompt to login
                          _showLoginPrompt(context);
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: product.isFood
                            ? Colors.green
                            : Theme.of(context).primaryColor,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        textStyle: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      child: isInCart
                          ? const Text('В корзине')
                          : const Text('В корзину'),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showLoginPrompt(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Требуется авторизация'),
        content: const Text(
          'Чтобы добавить товары в корзину, пожалуйста, войдите в аккаунт.'
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Отмена'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              // TODO: Navigate to login screen
            },
            child: const Text('Войти'),
          ),
        ],
      ),
    );
  }
}
