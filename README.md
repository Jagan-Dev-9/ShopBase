# ShopBase - E-commerce Platform

Full-stack e-commerce platform with Django backend and Next.js frontend.

## Features

### Backend (Django)
- JWT Authentication with custom User model
- Product management with categories
- Shopping cart functionality
- Admin interface
- REST API with pagination
- Role-based access (Admin/User)

### Frontend (Next.js)
- Modern glassmorphism UI design
- Dark/Light theme switching
- Responsive design
- Cart management
- User authentication
- Product browsing with filtering

## Architecture

```
ShopBase/
├── backend/          # Django API server
│   ├── accounts/     # User authentication
│   ├── products/     # Product management
│   ├── cart/         # Shopping cart
│   └── shopbase/     # Main settings
└── frontend/         # Next.js client
    ├── app/          # Pages and layouts
    ├── components/   # Reusable components
    └── contexts/     # State management
```

## Quick Start

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Admin Panel: http://localhost:8000/admin/

## Technology Stack

### Backend
- Django 5.2.5
- Django REST Framework
- Simple JWT
- SQLite (development) / PostgreSQL (production)
- Django CORS Headers

### Frontend
- Next.js 15.4.6
- React 19
- Tailwind CSS
- Heroicons
- Context API

## Production Deployment

### Backend
1. Update `SECRET_KEY` and database settings
2. Configure static/media file serving
3. Set `DEBUG = False`
4. Deploy to Heroku, Railway, or VPS

### Frontend
1. Update API URLs for production
2. Build: `npm run build`
3. Deploy to Vercel, Netlify, or CDN

## API Documentation

### Authentication
- `POST /api/accounts/register/` - User registration
- `POST /api/accounts/login/` - Login
- `GET /api/accounts/profile/` - User profile

### Products
- `GET /api/products/` - List products
- `GET /api/products/{id}/` - Product details
- `GET /api/products/categories/` - Categories

### Cart
- `GET /api/cart/` - View cart
- `POST /api/cart/add/` - Add to cart
- `PUT /api/cart/update/{id}/` - Update quantity
- `DELETE /api/cart/remove/{id}/` - Remove item

## License

MIT License
