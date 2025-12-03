import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/product_provider.dart';

// HCI: Cognitive Aspects - Clear category filtering with visual feedback
class CategoryFilter extends StatelessWidget {
  const CategoryFilter({super.key});

  @override
  Widget build(BuildContext context) {
    final productProvider = Provider.of<ProductProvider>(context);

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          _buildCategoryChip(
            context,
            'Все',
            'all',
            productProvider.selectedCategory == 'all',
            onTap: () => productProvider.setCategory('all'),
          ),
          const SizedBox(width: 8),
          _buildCategoryChip(
            context,
            '🍎 Еда',
            'food',
            productProvider.selectedCategory == 'food',
            onTap: () => productProvider.setCategory('food'),
          ),
          const SizedBox(width: 8),
          _buildCategoryChip(
            context,
            '👕 Одежда',
            'fashion',
            productProvider.selectedCategory == 'fashion',
            onTap: () => productProvider.setCategory('fashion'),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryChip(
    BuildContext context,
    String label,
    String category,
    bool isSelected, {
    required VoidCallback onTap,
  }) {
    return FilterChip(
      label: Text(
        label,
        style: TextStyle(
          color: isSelected ? Colors.white : Theme.of(context).textTheme.bodyMedium?.color,
          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
        ),
      ),
      selected: isSelected,
      onSelected: (_) => onTap(),
      backgroundColor: Theme.of(context).cardColor,
      selectedColor: category == 'food'
          ? Colors.green
          : category == 'fashion'
              ? Theme.of(context).primaryColor
              : Theme.of(context).primaryColor.withOpacity(0.8),
      checkmarkColor: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(
          color: isSelected
              ? Colors.transparent
              : Theme.of(context).dividerColor,
        ),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
    );
  }
}
