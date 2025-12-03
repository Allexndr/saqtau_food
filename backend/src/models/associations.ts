import { User } from './User';
import { Partner } from './Partner';
import { Product } from './Product';
import { Order } from './Order';
import { AnalyticsEvent } from './AnalyticsEvent';
import { Notification } from './Notification';

// HCI: Data at Scale - Define model relationships
// User associations
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
User.hasMany(AnalyticsEvent, { foreignKey: 'user_id', as: 'analytics' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });

// Partner associations (partners can also be users)
Partner.hasMany(Product, { foreignKey: 'partner_id', as: 'products' });
Partner.hasMany(Order, { foreignKey: 'user_id', as: 'orders' }); // Through user relationship
Partner.hasMany(AnalyticsEvent, { foreignKey: 'user_id', as: 'analytics' });
Partner.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });

// Product associations
Product.belongsTo(Partner, { foreignKey: 'partner_id', as: 'partner' });
Product.hasMany(AnalyticsEvent, { foreignKey: 'product_id', as: 'analytics' });
Product.hasMany(Order, { foreignKey: 'id', as: 'orders' }); // Through cart items

// Order associations
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Order.hasMany(AnalyticsEvent, { foreignKey: 'order_id', as: 'analytics' });

// Analytics associations
AnalyticsEvent.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
AnalyticsEvent.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
AnalyticsEvent.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
