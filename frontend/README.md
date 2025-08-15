# ShopBase Frontend

Modern e-commerce frontend built with Next.js 15 and glassmorphism design.

## Features

- JWT Authentication with role-based access
- Product browsing and filtering
- Shopping cart management
- Dark/Light theme switching
- Responsive glassmorphism UI
- Admin panel integration

## Tech Stack

- Next.js 15.4.6
- React 19
- Tailwind CSS
- Heroicons
- Context API for state management

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Access at http://localhost:3000

## API Integration

Backend API: http://localhost:8000/api/
- Authentication: JWT Bearer tokens
- Products: CRUD operations
- Cart: Session-based management
- User profiles and admin features

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Update API URLs in contexts for production
3. Configure environment variables
4. Deploy to Vercel, Netlify, or preferred platform
