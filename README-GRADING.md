# ShopBase - Project Grading Documentation

## Project Overview
**ShopBase** is a full-stack e-commerce platform built with Django (backend) and Next.js (frontend), featuring modern UI design, complete authentication system, and integrated payment processing with Stripe.

## Live Deployments
- **Frontend**: [https://shop-base-xi.vercel.app](https://shop-base-xi.vercel.app)
- **Backend API**: [https://shopbase.onrender.com](https://shopbase.onrender.com)
- **GitHub Repository**: [https://github.com/Jagan-Dev-9/ShopBase](https://github.com/Jagan-Dev-9/ShopBase)

## Key Features Implemented

### 🔐 Authentication System
- **JWT-based authentication** with access/refresh tokens
- **Custom User model** with additional profile fields
- **Role-based access control** (Admin/Regular User)
- **Protected routes** on both frontend and backend
- **Login/Register/Logout** functionality with proper session management

### 🛍️ E-commerce Core Features
- **Product Management**: CRUD operations with admin interface
- **Category System**: Organized product categorization
- **Shopping Cart**: Add/remove/update items with persistent state
- **Product Search & Filtering**: Real-time search with category filters
- **Image Handling**: Product images with fallback placeholders

### 💳 Payment Integration
- **Stripe Integration**: Complete checkout process with Stripe API
- **Cart Checkout**: Create checkout sessions for cart items
- **Payment Processing**: Secure payment handling with webhooks
- **Order Management**: Track payment status and order history

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Modern frosted glass aesthetic
- **Dark/Light Theme**: User preference-based theme switching
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Components**: Smooth animations and transitions
- **Professional Navigation**: Sticky header with cart indicator

### 🏗️ Technical Architecture

#### Backend (Django 5.2.5)
```
backend/
├── accounts/         # User authentication & profiles
├── products/         # Product management system
├── cart/            # Shopping cart functionality
├── payments/        # Stripe payment integration
└── shopbase/        # Main configuration
```

**Key Technologies:**
- Django REST Framework for API endpoints
- JWT authentication with custom user model
- SQLite database with proper migrations
- CORS handling for frontend integration
- Admin interface for content management

#### Frontend (Next.js 15.4.6)
```
frontend/
├── app/             # Next.js 15 app router structure
├── components/      # Reusable UI components
├── contexts/        # Global state management
├── hooks/           # Custom React hooks
└── utils/           # Helper functions
```

**Key Technologies:**
- Next.js 15 with App Router
- Tailwind CSS for styling
- Context API for state management
- Custom hooks for API integration
- Image optimization with fallbacks

## API Endpoints Implemented

### Authentication
- `POST /api/accounts/register/` - User registration
- `POST /api/accounts/login/` - User login
- `POST /api/accounts/logout/` - User logout
- `GET /api/accounts/profile/` - Get user profile
- `PUT /api/accounts/profile/` - Update user profile

### Products
- `GET /api/products/` - List all products with pagination
- `GET /api/products/{id}/` - Get product details
- `GET /api/products/categories/` - List all categories
- `GET /api/products/?category={id}` - Filter by category
- `GET /api/products/?search={query}` - Search products

### Shopping Cart
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/add/` - Add item to cart
- `PUT /api/cart/update/{id}/` - Update cart item quantity
- `DELETE /api/cart/remove/{id}/` - Remove item from cart

### Payments
- `POST /api/payments/create-cart-checkout-session/` - Create Stripe checkout session
- `POST /api/payments/stripe-webhook/` - Handle Stripe webhooks

## Database Schema

### User Model (Extended)
- Custom user model with additional fields
- JWT token management
- Role-based permissions

### Product Model
- Name, description, price, category
- Image handling with media files
- Stock management
- SEO-friendly URLs

### Category Model
- Hierarchical category structure
- Category-based filtering

### Cart Models
- Cart and CartItem models
- User association
- Quantity and pricing calculations

## Security Features
- **CSRF Protection**: Django's built-in CSRF middleware
- **CORS Configuration**: Proper CORS headers for API access
- **JWT Security**: Secure token-based authentication
- **Input Validation**: Comprehensive data validation
- **SQL Injection Prevention**: Django ORM protection

## Testing & Quality Assurance
- **Error Handling**: Comprehensive error handling throughout the application
- **Responsive Testing**: Tested on multiple device sizes
- **Cross-browser Compatibility**: Works on modern browsers
- **API Testing**: All endpoints tested and validated

## Deployment Details

### Frontend (Vercel)
- Automatic deployment from GitHub main branch
- Environment variables properly configured
- Build optimization and caching
- Custom domain support ready

### Backend (Render.com)
- Automatic deployment from GitHub repository
- Database migrations on deployment
- Static file serving configured
- Environment variables secured

## Development Workflow
1. **Version Control**: Git with meaningful commit messages
2. **Branch Management**: Feature branches with main branch protection
3. **Code Quality**: Consistent formatting and structure
4. **Documentation**: Comprehensive README and inline comments

## Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables Required

### Backend (.env)
```
SECRET_KEY=your-django-secret-key
DEBUG=False
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://shopbase.onrender.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Project Highlights
- **Full-stack Development**: Complete frontend and backend implementation
- **Modern Tech Stack**: Latest versions of Django and Next.js
- **Production Ready**: Deployed and accessible online
- **Payment Integration**: Real payment processing with Stripe
- **Professional UI**: Modern design with attention to detail
- **Scalable Architecture**: Well-structured codebase for future expansion

## Future Enhancements
- Order history and tracking
- Product reviews and ratings
- Advanced search with filters
- Email notifications
- Social authentication
- Mobile app development

---

**Developer**: Jagan-Dev-9  
**Repository**: [https://github.com/Jagan-Dev-9/ShopBase](https://github.com/Jagan-Dev-9/ShopBase)  
**Live Demo**: [https://shop-base-xi.vercel.app](https://shop-base-xi.vercel.app)
