// HCI: Conceptualization - Product model with rich metadata for semantic understanding
class Product {
  final String id;
  final String title;
  final String description;
  final String category; // 'food' | 'fashion'
  final String? subcategory;
  final List<String> images;
  final double originalPrice;
  final double discountPrice;
  final double discountPercentage;
  final int quantity;
  final String unit;
  final DateTime? expiryDate;
  final String pickupTimeStart;
  final String pickupTimeEnd;
  final LocationData location;
  final String partnerId;
  final List<String> tags;
  final List<String>? allergens;
  final String condition;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;
  final Partner? partner; // Populated when fetched with partner data

  Product({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    this.subcategory,
    required this.images,
    required this.originalPrice,
    required this.discountPrice,
    required this.discountPercentage,
    required this.quantity,
    required this.unit,
    this.expiryDate,
    required this.pickupTimeStart,
    required this.pickupTimeEnd,
    required this.location,
    required this.partnerId,
    required this.tags,
    this.allergens,
    required this.condition,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
    this.partner,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      title: json['title'],
      description: json['description'] ?? '',
      category: json['category'],
      subcategory: json['subcategory'],
      images: List<String>.from(json['images'] ?? []),
      originalPrice: (json['original_price'] as num?)?.toDouble() ?? 0.0,
      discountPrice: (json['discount_price'] as num?)?.toDouble() ?? 0.0,
      discountPercentage: (json['discount_percentage'] as num?)?.toDouble() ?? 0.0,
      quantity: json['quantity'] ?? 0,
      unit: json['unit'] ?? 'шт',
      expiryDate: json['expiry_date'] != null ? DateTime.parse(json['expiry_date']) : null,
      pickupTimeStart: json['pickup_time_start'] ?? '09:00',
      pickupTimeEnd: json['pickup_time_end'] ?? '18:00',
      location: LocationData.fromJson(json['location'] ?? {}),
      partnerId: json['partner_id'],
      tags: List<String>.from(json['tags'] ?? []),
      allergens: json['allergens'] != null ? List<String>.from(json['allergens']) : null,
      condition: json['condition'] ?? 'new',
      isActive: json['is_active'] ?? true,
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
      partner: json['partner'] != null ? Partner.fromJson(json['partner']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'category': category,
      'subcategory': subcategory,
      'images': images,
      'original_price': originalPrice,
      'discount_price': discountPrice,
      'discount_percentage': discountPercentage,
      'quantity': quantity,
      'unit': unit,
      'expiry_date': expiryDate?.toIso8601String(),
      'pickup_time_start': pickupTimeStart,
      'pickup_time_end': pickupTimeEnd,
      'location': location.toJson(),
      'partner_id': partnerId,
      'tags': tags,
      'allergens': allergens,
      'condition': condition,
      'is_active': isActive,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'partner': partner?.toJson(),
    };
  }

  // HCI: Emotional Interaction - Helper methods for UI display
  bool get isFood => category == 'food';
  bool get isFashion => category == 'fashion';
  String get displayPrice => '${discountPrice.toStringAsFixed(0)} ₸';
  String get originalPriceDisplay => '${originalPrice.toStringAsFixed(0)} ₸';
  String get categoryEmoji => isFood ? '🍎' : '👕';
  String get conditionText {
    switch (condition) {
      case 'new': return 'Новый';
      case 'like_new': return 'Как новый';
      case 'good': return 'Хорошее';
      case 'fair': return 'Удовлетворительное';
      default: return condition;
    }
  }
}

class Partner {
  final String id;
  final String name;
  final String type;
  final String? description;
  final String? logoUrl;
  final List<String> imageUrls;
  final LocationData location;
  final ContactInfo contact;
  final Map<String, BusinessHour> businessHours;
  final double rating;
  final int reviewCount;
  final bool isVerified;
  final bool isActive;

  Partner({
    required this.id,
    required this.name,
    required this.type,
    this.description,
    this.logoUrl,
    required this.imageUrls,
    required this.location,
    required this.contact,
    required this.businessHours,
    required this.rating,
    required this.reviewCount,
    required this.isVerified,
    required this.isActive,
  });

  factory Partner.fromJson(Map<String, dynamic> json) {
    return Partner(
      id: json['id'],
      name: json['name'],
      type: json['type'],
      description: json['description'],
      logoUrl: json['logo_url'],
      imageUrls: List<String>.from(json['image_urls'] ?? []),
      location: LocationData.fromJson(json['location'] ?? {}),
      contact: ContactInfo.fromJson(json['contact'] ?? {}),
      businessHours: (json['business_hours'] as Map<String, dynamic>?)?.map(
        (key, value) => MapEntry(key, BusinessHour.fromJson(value))
      ) ?? {},
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      reviewCount: json['review_count'] ?? 0,
      isVerified: json['is_verified'] ?? false,
      isActive: json['is_active'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'type': type,
      'description': description,
      'logo_url': logoUrl,
      'image_urls': imageUrls,
      'location': location.toJson(),
      'contact': contact.toJson(),
      'business_hours': businessHours.map((key, value) => MapEntry(key, value.toJson())),
      'rating': rating,
      'review_count': reviewCount,
      'is_verified': isVerified,
      'is_active': isActive,
    };
  }
}

class ContactInfo {
  final String phone;
  final String email;
  final String? website;

  ContactInfo({
    required this.phone,
    required this.email,
    this.website,
  });

  factory ContactInfo.fromJson(Map<String, dynamic> json) {
    return ContactInfo(
      phone: json['phone'] ?? '',
      email: json['email'] ?? '',
      website: json['website'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'phone': phone,
      'email': email,
      'website': website,
    };
  }
}

class BusinessHour {
  final String open;
  final String close;
  final bool isOpen;

  BusinessHour({
    required this.open,
    required this.close,
    required this.isOpen,
  });

  factory BusinessHour.fromJson(Map<String, dynamic> json) {
    return BusinessHour(
      open: json['open'] ?? '09:00',
      close: json['close'] ?? '18:00',
      isOpen: json['is_open'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'open': open,
      'close': close,
      'is_open': isOpen,
    };
  }
}

class LocationData {
  final double lat;
  final double lng;
  final String? address;
  final String? city;

  LocationData({
    required this.lat,
    required this.lng,
    this.address,
    this.city,
  });

  factory LocationData.fromJson(Map<String, dynamic> json) {
    return LocationData(
      lat: (json['lat'] as num?)?.toDouble() ?? 0.0,
      lng: (json['lng'] as num?)?.toDouble() ?? 0.0,
      address: json['address'],
      city: json['city'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'lat': lat,
      'lng': lng,
      'address': address,
      'city': city,
    };
  }
}
