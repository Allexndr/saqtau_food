# Saqtau Platform Backend

Backend API for the Saqtau Platform - a comprehensive solution for food and fashion waste reduction through smart purchasing.

## Features

- **RESTful API** - Clean, well-documented endpoints
- **PostgreSQL Database** - Robust data storage with advanced querying
- **JWT Authentication** - Secure user authentication and authorization
- **Role-based Access Control** - Support for users, partners, and admins
- **Comprehensive Product Management** - Advanced filtering, search, and recommendations
- **Order & Cart Management** - Full e-commerce functionality
- **Analytics & Logging** - Comprehensive data gathering for insights
- **Error Handling** - User-friendly error responses
- **Rate Limiting** - Protection against abuse
- **CORS Support** - Cross-origin requests for web and mobile clients

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Joi schema validation
- **Logging**: Winston structured logging
- **Security**: Helmet, CORS, rate limiting
- **Testing**: Jest (planned)

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to backend directory: `cd backend`
3. Install dependencies: `npm install`
4. Copy environment file: `cp env.example .env`
5. Configure your `.env` file with database credentials
6. Create database: `npm run db:create`
7. Run migrations: `npm run db:migrate`
8. Seed database (optional): `npm run db:seed`

### Development

```bash
# Start development server with auto-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Database Management

```bash
# Create database
npm run db:create

# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Product Endpoints

- `GET /api/products` - List products with filtering
- `GET /api/products/:id` - Get product details
- `GET /api/products/recommended` - Get AI-powered recommendations
- `POST /api/products` - Create product (partners only)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Partner Endpoints

- `GET /api/partners` - List partners
- `GET /api/partners/:id` - Get partner details
- `POST /api/partners` - Register as partner

### Cart Endpoints

- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove item from cart

### Order Endpoints

- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status

## Database Schema

See `database/schema.sql` for complete database schema with:
- Users, Partners, Products, Carts, Orders, Reviews
- Analytics events for data gathering
- Functions and triggers for automated calculations
- Comprehensive indexing for performance

## HCI Design Principles Applied

This backend implements HCI principles throughout:

### 1. Data Gathering & Data at Scale
- Comprehensive analytics event logging
- Structured data collection for user behavior analysis
- Optimized queries with proper indexing

### 2. Cognitive Aspects
- Clear error messages and validation
- Consistent API responses
- Intuitive endpoint naming and structure

### 3. Social Interaction
- Partner and user relationship management
- Review and rating systems
- Community features support

### 4. Emotional Interaction
- User-friendly error handling
- Success confirmations and feedback
- Secure and trustworthy authentication

### 5. Interaction Design
- RESTful API design
- Proper HTTP status codes
- Comprehensive input validation

### 6. Security & Privacy
- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting and CORS protection

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Follow semantic commit messages

## License

MIT License - see LICENSE file for details.
