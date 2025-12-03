-- Saqtau Platform Database Schema
-- HCI Design: Data at Scale - Structured storage for analytics and personalization

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
-- HCI: Social Interaction - User profiles with preferences for personalization
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'partner', 'admin')),
    preferences JSONB DEFAULT '{
        "language": "ru",
        "notifications": true,
        "location": null
    }',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Partners table
-- HCI: Social Interaction - Partner profiles for collaborative ecosystem
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('restaurant', 'store', 'cafe', 'bakery', 'fashion_store')),
    description TEXT,
    logo_url VARCHAR(500),
    image_urls JSONB DEFAULT '[]',
    location JSONB NOT NULL,
    contact JSONB NOT NULL,
    business_hours JSONB DEFAULT '{}',
    rating DECIMAL(3,2) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products table
-- HCI: Conceptualization - Product entities with metadata for semantic search
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(20) NOT NULL CHECK (category IN ('food', 'fashion')),
    subcategory VARCHAR(100),
    images JSONB DEFAULT '[]',
    original_price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE
            WHEN original_price > 0 THEN
                ROUND(((original_price - discount_price) / original_price) * 100, 2)
            ELSE 0
        END
    ) STORED,
    quantity INTEGER NOT NULL DEFAULT 0,
    unit VARCHAR(20) DEFAULT 'шт',
    expiry_date TIMESTAMP WITH TIME ZONE,
    pickup_time_start TIME,
    pickup_time_end TIME,
    location JSONB NOT NULL,
    partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
    tags JSONB DEFAULT '[]',
    allergens JSONB DEFAULT '[]',
    condition VARCHAR(20) DEFAULT 'new' CHECK (condition IN ('new', 'like_new', 'good', 'fair')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- HCI: Cognitive Aspects - Constraints for better UX
    CONSTRAINT valid_price CHECK (discount_price <= original_price),
    CONSTRAINT valid_quantity CHECK (quantity >= 0),
    CONSTRAINT valid_times CHECK (pickup_time_start < pickup_time_end)
);

-- Carts table
-- HCI: Interaction Design - Shopping cart state management
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    commission DECIMAL(10,2) DEFAULT 0,
    final_total DECIMAL(10,2) DEFAULT 0,
    promo_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- HCI: Emotional Interaction - Clear pricing transparency
    CONSTRAINT valid_totals CHECK (final_total >= 0)
);

-- Cart items table
-- HCI: Cognitive Aspects - Simplified cart management
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_cart_quantity CHECK (quantity > 0),
    UNIQUE(cart_id, product_id)
);

-- Orders table
-- HCI: Interaction Design - Order lifecycle management
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cart_snapshot JSONB NOT NULL, -- Store complete cart state
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'ready', 'picked_up', 'cancelled', 'refunded')),
    payment_method VARCHAR(20) CHECK (payment_method IN ('kaspi', 'halyk', 'card', 'cash')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    pickup_code VARCHAR(20) UNIQUE,
    pickup_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
-- HCI: Social Interaction - User feedback and community building
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- HCI: Emotional Interaction - Balanced feedback system
    CONSTRAINT review_target CHECK (product_id IS NOT NULL OR partner_id IS NOT NULL)
);

-- Notifications table
-- HCI: Emotional Interaction - User engagement through notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('order', 'product', 'system', 'promotion')),
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- HCI: Cognitive Aspects - Efficient notification queries
  INDEX idx_notifications_user_read (user_id, is_read),
  INDEX idx_notifications_user_created (user_id, created_at),
  INDEX idx_notifications_type (type),
  INDEX idx_notifications_priority (priority)
);

-- Analytics events table
-- HCI: Data Gathering & Data at Scale - Comprehensive user behavior tracking
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event VARCHAR(100) NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  data JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(20) DEFAULT 'web' CHECK (source IN ('web', 'mobile', 'api')),
  user_agent TEXT,
  ip_address INET,

  -- HCI: Data at Scale - Optimized for analytics queries
  INDEX idx_analytics_user_event (user_id, event),
  INDEX idx_analytics_timestamp (timestamp),
  INDEX idx_analytics_event (event)
);

-- Indexes for performance
-- HCI: Cognitive Aspects - Fast search and filtering
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_subcategory ON products(subcategory);
CREATE INDEX idx_products_location ON products USING GIN(location);
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_price ON products(discount_price);
CREATE INDEX idx_partners_verified ON partners(is_verified) WHERE is_verified = true;
CREATE INDEX idx_partners_active ON partners(is_active) WHERE is_active = true;
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_partner ON reviews(partner_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate cart totals
-- HCI: Interaction Design - Automated pricing calculations
CREATE OR REPLACE FUNCTION calculate_cart_total(cart_uuid UUID)
RETURNS TABLE(total DECIMAL, commission DECIMAL, final_total DECIMAL) AS $$
DECLARE
    cart_total DECIMAL := 0;
    cart_commission DECIMAL := 0;
    cart_discount DECIMAL := 0;
    final DECIMAL := 0;
BEGIN
    -- Calculate base total
    SELECT COALESCE(SUM(ci.quantity * p.discount_price), 0)
    INTO cart_total
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = cart_uuid;

    -- Calculate commission (15%)
    cart_commission := cart_total * 0.15;

    -- Calculate discount (example: 10% for promo codes)
    -- In real implementation, this would check promo code validity
    cart_discount := CASE WHEN cart_total > 0 THEN cart_total * 0.1 ELSE 0 END;

    -- Final total
    final := cart_total + cart_commission - cart_discount;

    RETURN QUERY SELECT cart_total, cart_commission, final;
END;
$$ LANGUAGE plpgsql;

-- Function to update partner ratings
-- HCI: Social Interaction - Dynamic rating system
CREATE OR REPLACE FUNCTION update_partner_rating(partner_uuid UUID)
RETURNS VOID AS $$
DECLARE
    avg_rating DECIMAL;
    review_count INTEGER;
BEGIN
    SELECT AVG(rating), COUNT(*)
    INTO avg_rating, review_count
    FROM reviews
    WHERE partner_id = partner_uuid;

    UPDATE partners
    SET rating = COALESCE(avg_rating, 0),
        review_count = review_count
    WHERE id = partner_uuid;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update partner rating when review is added/updated
CREATE OR REPLACE FUNCTION trigger_update_partner_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        PERFORM update_partner_rating(NEW.partner_id);
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM update_partner_rating(OLD.partner_id);
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_partner_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION trigger_update_partner_rating();
