# Quick Reference Guide

## 🚀 Getting Started

### First Time Setup
```bash
# 1. Install dependencies
npm install

# 2. Build shared package
npm run build --workspace=@local-tcg/shared

# 3. Set up environment variables
cp packages/backend/.env.example packages/backend/.env
cp packages/admin/.env.example packages/admin/.env
cp packages/client/.env.example packages/client/.env

# 4. Seed the database with sample data
cd packages/backend && npm run seed && cd ../..

# 5. Start development servers
npm run dev
```

Visit:
- Admin Portal: http://localhost:3000
- Client App: http://localhost:3002
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## 📦 Available Scripts

### Root Level
- `npm run dev` - Start backend, admin portal, and client app
- `npm run build` - Build all packages
- `npm run test` - Run tests in all packages
- `npm run lint` - Lint all packages
- `npm run format` - Format code with Prettier

### Backend Only
- `npm run dev:backend` - Start backend server
- `npm run build:backend` - Build backend
- `npm run seed --workspace=@local-tcg/backend` - Seed database

### Admin Portal Only
- `npm run dev:admin` - Start admin portal dev server
- `npm run build:admin` - Build admin portal for production

### Client App Only
- `npm run dev:client` - Start client app dev server
- `npm run build:client` - Build client app for web/PWA
- `npm run build:android --workspace=@local-tcg/client` - Build for Android
- `npm run build:ios --workspace=@local-tcg/client` - Build for iOS
- `npm run sync --workspace=@local-tcg/client` - Sync to native projects

## 🗂️ Project Structure

```
local-tcg-marketplace/
├── packages/
│   ├── shared/              # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── types.ts     # Core type definitions
│   │   │   └── index.ts     # Exports
│   │   └── package.json
│   │
│   ├── backend/             # Express API Server
│   │   ├── src/
│   │   │   ├── config/      # Database & configuration
│   │   │   ├── middleware/  # Express middleware
│   │   │   ├── routes/      # API route handlers
│   │   │   ├── scripts/     # Utility scripts (seed, etc.)
│   │   │   └── index.ts     # Server entry point
│   │   └── package.json
│   │
│   ├── admin/               # Admin Portal (React + Vite)
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── pages/       # Page components (Dashboard, Inventory, etc.)
│   │   │   ├── services/    # API client
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   └── App.tsx      # Main app component
│   │   └── package.json
│   │
│   └── client/              # Mobile App (Ionic + Capacitor)
│       ├── src/
│       │   ├── pages/       # Ionic pages
│       │   ├── services/    # API client
│       │   ├── hooks/       # Custom hooks (geolocation, etc.)
│       │   ├── theme/       # Ionic theme variables
│       │   └── App.tsx      # Main app with tabs
│       ├── capacitor.config.ts  # Capacitor configuration
│       └── package.json
│
├── docs/                    # Documentation
│   ├── API.md              # API documentation
│   ├── DEPLOYMENT.md       # Deployment guide
│   └── QUICK_START.md      # Quick start guide
│
├── README.md               # Main documentation
├── CONTRIBUTING.md         # Contribution guidelines
└── package.json           # Root package configuration
```

## 🔑 Key Files

### Backend
- `packages/backend/src/index.ts` - Main server file
- `packages/backend/src/config/database.ts` - Database setup
- `packages/backend/src/routes/search.ts` - Geo-search implementation
- `packages/backend/src/scripts/seed.ts` - Sample data generator

### Admin Portal
- `packages/admin/src/App.tsx` - Main app with routing
- `packages/admin/src/pages/DashboardPage.tsx` - Admin dashboard
- `packages/admin/src/pages/InventoryManagementPage.tsx` - Inventory CRUD
- `packages/admin/src/services/api.ts` - API client

### Client App
- `packages/client/src/App.tsx` - Main app with Ionic tabs
- `packages/client/src/pages/SearchPage.tsx` - Card search interface
- `packages/client/src/pages/SellersPage.tsx` - Seller directory
- `packages/client/src/hooks/useGeolocation.ts` - Capacitor geolocation hook
- `packages/client/capacitor.config.ts` - Native app configuration

### Shared
- `packages/shared/src/types.ts` - All TypeScript interfaces

## 🎯 Features Overview

### Search Capabilities
- Card name search (partial match)
- Set name filtering
- Condition filtering (MINT, NEAR_MINT, etc.)
- Price range filtering
- Foil-only option
- Geo-location based distance calculation
- Multiple sort options (price, distance, condition)

### Seller Management
- Store and individual seller types
- Location tracking (latitude/longitude)
- Contact information (email, phone, website)
- Pickup hours
- POS system integration tracking

### POS Integration
Supported systems:
- Square
- Shopify
- Crystal Commerce
- Binding Edge
- TCGPlayer
- Custom integrations

## 📊 Database Schema

### Tables
1. **sellers** - Store and seller information
2. **cards** - Card catalog with variants
3. **inventory** - Available cards for sale
4. **pos_integrations** - POS system configurations
5. **sync_logs** - Synchronization history

## 🧪 Testing the Application

### Test Search
1. Navigate to http://localhost:3000
2. Enter "Lightning Bolt" in the card name field
3. Click Search
4. Results should show cards from multiple sellers

### Test Geo-Search
```bash
# Using curl to test API directly
curl "http://localhost:3001/api/search?latitude=40.7128&longitude=-74.0060&radiusMiles=50&sortBy=distance"
```

### Test Sellers API
```bash
curl "http://localhost:3001/api/sellers"
```

## 🔧 Common Issues

### "Cannot find module '@local-tcg/shared'"
```bash
# Build the shared package first
npm run build --workspace=@local-tcg/shared
```

### Port Already in Use
```bash
# Change ports in environment files:
# Backend: packages/backend/.env (PORT=3001)
# Frontend: packages/frontend/vite.config.ts (port: 3000)
```

### Database Errors
```bash
# Delete and recreate database
rm -rf packages/backend/data/
cd packages/backend && npm run seed
```

## 📚 Next Steps

1. **Add Authentication**
   - User accounts for buyers
   - Seller accounts with permissions
   - JWT token-based auth

2. **Enhance POS Integration**
   - Implement actual API integrations
   - Automated inventory sync
   - Real-time stock updates

3. **Add Payment Processing**
   - Stripe or PayPal integration
   - Shopping cart
   - Order management

4. **Improve Search**
   - Advanced card filters
   - TCG-specific attributes
   - Image search

5. **Mobile App**
   - React Native version
   - Native geolocation
   - Push notifications

## 💡 Tips

- Use `npm run format` before committing
- Check `npm run lint` for code quality
- Always build shared package after modifying types
- Use seed script to reset to clean test data
- Check browser console for frontend errors
- Check terminal for backend errors

## 📞 Support

- Check [README.md](../README.md) for detailed setup
- Review [API.md](docs/API.md) for endpoint documentation
- See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment
- Read [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines
