import bcrypt from 'bcrypt';
import { sequelize } from '../utils/database';
import { User } from '../models/User';
import { Partner } from '../models/Partner';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { Notification } from '../models/Notification';

// HCI: Data Gathering - Seed database with test data for demonstration
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Sync database
    await sequelize.sync({ force: true });
    console.log('✅ Database synchronized');

    // Create test users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await User.bulkCreate([
      {
        email: 'buyer@example.com',
        password_hash: hashedPassword,
        first_name: 'Иван',
        last_name: 'Петров',
        phone: '+7 (777) 123-45-67',
        role: 'user',
        preferences: {
          language: 'ru',
          notifications: true,
        },
        is_verified: true,
      },
      {
        email: 'customer@test.com',
        password_hash: await bcrypt.hash('testpass', 10),
        first_name: 'Анна',
        last_name: 'Сидорова',
        phone: '+7 (777) 987-65-43',
        role: 'user',
        preferences: {
          language: 'ru',
          notifications: true,
        },
        is_verified: true,
      },
      {
        email: 'seller@saqtau.kz',
        password_hash: await bcrypt.hash('seller123', 10),
        first_name: 'Максим',
        last_name: 'Кузнецов',
        phone: '+7 (727) 123-45-67',
        role: 'partner',
        preferences: {
          language: 'ru',
          notifications: true,
        },
        is_verified: true,
      },
      {
        email: 'partner@food.kz',
        password_hash: await bcrypt.hash('partner123', 10),
        first_name: 'Елена',
        last_name: 'Васильева',
        phone: '+7 (727) 987-65-43',
        role: 'partner',
        preferences: {
          language: 'ru',
          notifications: true,
        },
        is_verified: true,
      },
      {
        email: 'admin@saqtau.kz',
        password_hash: await bcrypt.hash('admin123', 10),
        first_name: 'Администратор',
        last_name: 'Системы',
        role: 'admin',
        preferences: {
          language: 'ru',
          notifications: true,
        },
        is_verified: true,
      },
    ]);
    console.log('✅ Created test users');

    // Create test partners
    const partners = await Partner.bulkCreate([
      {
        name: 'Ферма "Зеленый сад"',
        type: 'restaurant',
        description: 'Органические продукты из собственного хозяйства',
        logo_url: 'https://via.placeholder.com/150x150/4CAF50/FFFFFF?text=🍎',
        image_urls: ['https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Farm'],
        location: {
          lat: 43.238949,
          lng: 76.889709,
          address: 'ул. Абая, 45, Алматы',
          city: 'Алматы',
        },
        contact: {
          phone: '+7 (727) 123-45-67',
          email: 'info@zelenyysad.kz',
          website: 'https://zelenyysad.kz',
        },
        business_hours: {
          monday: { open: '08:00', close: '18:00', is_open: true },
          tuesday: { open: '08:00', close: '18:00', is_open: true },
          wednesday: { open: '08:00', close: '18:00', is_open: true },
          thursday: { open: '08:00', close: '18:00', is_open: true },
          friday: { open: '08:00', close: '18:00', is_open: true },
          saturday: { open: '09:00', close: '16:00', is_open: true },
          sunday: { open: '10:00', close: '14:00', is_open: true },
        },
        rating: 4.5,
        review_count: 23,
        is_verified: true,
        is_active: true,
        owner_name: 'Максим Кузнецов',
        tax_id: '123456789012',
        bank_details: {
          bank_name: 'Kaspi Bank',
          account_number: 'KZ123456789012345678',
          bik: 'CASPKZKA',
        },
        settings: {
          auto_confirm_orders: false,
          notification_preferences: {
            new_orders: true,
            low_stock: true,
            reviews: true,
          },
          commission_rate: 15,
        },
      },
      {
        name: 'Магазин "Эко стиль"',
        type: 'fashion_store',
        description: 'Устойчивые бренды одежды и аксессуаров',
        logo_url: 'https://via.placeholder.com/150x150/2196F3/FFFFFF?text=👕',
        image_urls: ['https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Store'],
        location: {
          lat: 51.169392,
          lng: 71.449074,
          address: 'пр. Абая, 12, Астана',
          city: 'Астана',
        },
        contact: {
          phone: '+7 (7172) 123-45-67',
          email: 'info@ecostyle.kz',
          website: 'https://ecostyle.kz',
        },
        business_hours: {
          monday: { open: '10:00', close: '20:00', is_open: true },
          tuesday: { open: '10:00', close: '20:00', is_open: true },
          wednesday: { open: '10:00', close: '20:00', is_open: true },
          thursday: { open: '10:00', close: '20:00', is_open: true },
          friday: { open: '10:00', close: '20:00', is_open: true },
          saturday: { open: '11:00', close: '19:00', is_open: true },
          sunday: { open: '12:00', close: '17:00', is_open: true },
        },
        rating: 4.2,
        review_count: 15,
        is_verified: true,
        is_active: true,
        owner_name: 'Елена Васильева',
        tax_id: '987654321098',
        bank_details: {
          bank_name: 'Halyk Bank',
          account_number: 'KZ987654321098765432',
          bik: 'HSBKKZKX',
        },
        settings: {
          auto_confirm_orders: true,
          notification_preferences: {
            new_orders: true,
            low_stock: true,
            reviews: true,
          },
          commission_rate: 15,
        },
      },
    ]);
    console.log('✅ Created test partners');

    // Create test products
    const products = await Product.bulkCreate([
      // Food products from first partner
      {
        title: 'Свежие красные яблоки',
        description: 'Органические яблоки из собственного сада. Без химикатов и ГМО.',
        category: 'food',
        subcategory: 'fruits',
        images: [
          'https://via.placeholder.com/400x300/FF5722/FFFFFF?text=🍎+Apples',
          'https://via.placeholder.com/400x300/FF5722/FFFFFF?text=🍎+Organic'
        ],
        original_price: 1500,
        discount_price: 1200,
        quantity: 50,
        unit: 'кг',
        expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        pickup_time_start: '09:00',
        pickup_time_end: '18:00',
        location: {
          lat: 43.238949,
          lng: 76.889709,
          address: 'ул. Абая, 45, Алматы',
        },
        partner_id: partners[0].id,
        tags: ['органика', 'свежие', 'фрукты', 'без_гмо'],
        allergens: [],
        condition: 'new',
        is_active: true,
      },
      {
        title: 'Домашний мёд из акации',
        description: 'Натуральный мёд из цветков акации. Полезен для иммунитета.',
        category: 'food',
        subcategory: 'honey',
        images: [
          'https://via.placeholder.com/400x300/FFC107/000000?text=🍯+Honey',
          'https://via.placeholder.com/400x300/FFC107/000000?text=🍯+Organic'
        ],
        original_price: 4000,
        discount_price: 3500,
        quantity: 25,
        unit: 'банка',
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        pickup_time_start: '09:00',
        pickup_time_end: '18:00',
        location: {
          lat: 43.238949,
          lng: 76.889709,
          address: 'ул. Абая, 45, Алматы',
        },
        partner_id: partners[0].id,
        tags: ['мёд', 'натуральный', 'акация', 'полезный'],
        allergens: ['мёд'],
        condition: 'new',
        is_active: true,
      },
      // Fashion products from second partner
      {
        title: 'Эко-футболка из органического хлопка',
        description: 'Удобная футболка из 100% органического хлопка. Экологичная и стильная.',
        category: 'fashion',
        subcategory: 't-shirts',
        images: [
          'https://via.placeholder.com/400x300/2196F3/FFFFFF?text=👕+T-Shirt',
          'https://via.placeholder.com/400x300/2196F3/FFFFFF?text=👕+Organic'
        ],
        original_price: 8000,
        discount_price: 6500,
        quantity: 20,
        unit: 'шт',
        pickup_time_start: '10:00',
        pickup_time_end: '20:00',
        location: {
          lat: 51.169392,
          lng: 71.449074,
          address: 'пр. Абая, 12, Астана',
        },
        partner_id: partners[1].id,
        tags: ['эко', 'хлопок', 'органика', 'комфорт'],
        allergens: [],
        condition: 'new',
        is_active: true,
      },
      {
        title: 'Переработанная сумка из пластика',
        description: 'Стильная сумка, сделанная из переработанного океанического пластика.',
        category: 'fashion',
        subcategory: 'bags',
        images: [
          'https://via.placeholder.com/400x300/FF9800/FFFFFF?text=👜+Bag',
          'https://via.placeholder.com/400x300/FF9800/FFFFFF?text=👜+Recycled'
        ],
        original_price: 12000,
        discount_price: 9500,
        quantity: 15,
        unit: 'шт',
        pickup_time_start: '10:00',
        pickup_time_end: '20:00',
        location: {
          lat: 51.169392,
          lng: 71.449074,
          address: 'пр. Абая, 12, Астана',
        },
        partner_id: partners[1].id,
        tags: ['эко', 'переработка', 'пластик', 'стиль'],
        allergens: [],
        condition: 'new',
        is_active: true,
      },
    ]);
    console.log('✅ Created test products');

    // Create test notifications
    await Notification.bulkCreate([
      {
        user_id: users[2].id, // seller
        title: '🛒 Новый заказ',
        message: 'Поступил новый заказ от Ивана Петрова',
        type: 'order',
        is_read: false,
        priority: 'high',
        data: { order_id: 'ORD-001' },
      },
      {
        user_id: users[2].id, // seller
        title: '⚠️ Малый остаток',
        message: 'У товара "Органический мёд" осталось 5 банок',
        type: 'product',
        is_read: false,
        priority: 'medium',
        data: { product_id: products[1].id },
      },
      {
        user_id: users[0].id, // buyer
        title: '📦 Заказ готов',
        message: 'Ваш заказ ORD-001 готов к выдаче',
        type: 'order',
        is_read: false,
        priority: 'high',
        data: { order_id: 'ORD-001' },
      },
    ]);
    console.log('✅ Created test notifications');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Created:');
    console.log(`   ${users.length} users`);
    console.log(`   ${partners.length} partners`);
    console.log(`   ${products.length} products`);
    console.log(`   3 notifications`);

    console.log('\n🔑 Test login credentials:');
    console.log('Buyer: buyer@example.com / password123');
    console.log('Seller: seller@saqtau.kz / seller123');
    console.log('Admin: admin@saqtau.kz / admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };
