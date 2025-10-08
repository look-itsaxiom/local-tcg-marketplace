# 🃏 Local TCG Marketplace

A fullstack TypeScript-based SaaS starter for building a local-first TCG (Trading Card Game) singles marketplace. Helps players instantly find and pick up individual cards from nearby stores or community sellers.

## 🎯 Features

- **🔍 Advanced Search** - Find specific cards by name, set, condition, price, and more
- **📍 Geo-Location Search** - Discover sellers within your desired radius
- **🏪 POS Integration** - Seamless integration with popular shop management systems
  - Square
  - Shopify
  - Crystal Commerce
  - Binding Edge
  - TCGPlayer
  - Custom integrations
- **📊 Real-time Inventory Sync** - Automated inventory synchronization
- **🃏 Singles-Only Focus** - Exclusively for individual card sales
- **🗺️ Interactive Maps** - Visualize seller locations with Leaflet maps
- **⚡ Fast & Efficient** - Built with modern TypeScript and React

## 🏗️ Project Structure

This is a monorepo containing four packages:

```
local-tcg-marketplace/
├── packages/
│   ├── shared/          # Shared TypeScript types and utilities
│   ├── backend/         # Node.js/Express API server
│   ├── admin/           # Admin portal (React + Vite)
│   └── client/          # Mobile app (Ionic + Capacitor)
├── package.json         # Root package configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Clone the repository:
```bash
git clone https://github.com/look-itsaxiom/local-tcg-marketplace.git
cd local-tcg-marketplace
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

**Backend** (`packages/backend/.env`):
```bash
cp packages/backend/.env.example packages/backend/.env
# Edit packages/backend/.env with your settings
```

**Admin Portal** (`packages/admin/.env`):
```bash
cp packages/admin/.env.example packages/admin/.env
# Edit packages/admin/.env with your settings
```

**Client App** (`packages/client/.env`):
```bash
cp packages/client/.env.example packages/client/.env
# Edit packages/client/.env with your settings
```

4. Build the shared package:
```bash
npm run build --workspace=@local-tcg/shared
```

5. Start the development servers:
```bash
npm run dev
```

This will start:
- Backend API on `http://localhost:3001`
- Admin Portal on `http://localhost:3000`
- Client App on `http://localhost:3002`

## 📦 Package Details

### Shared (`@local-tcg/shared`)

Contains TypeScript types and interfaces shared between all packages:
- Card types
- Inventory models
- Seller information
- Search query types
- API response types
- POS integration types

### Backend (`@local-tcg/backend`)

Node.js/Express API server with:
- RESTful API endpoints
- SQLite database
- Geo-search functionality (Haversine formula)
- POS integration framework
- Inventory management
- Seller management

**API Endpoints:**
- `GET /api/health` - Health check
- `GET /api/search` - Search inventory with filters
- `GET /api/search/sellers` - Search nearby sellers
- `GET /api/inventory` - List inventory items
- `GET /api/inventory/:id` - Get single inventory item
- `POST /api/inventory` - Create inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item
- `GET /api/sellers` - List sellers
- `GET /api/sellers/:id` - Get single seller
- `POST /api/sellers` - Create seller
- `PUT /api/sellers/:id` - Update seller
- `DELETE /api/sellers/:id` - Delete seller
- `GET /api/pos/integrations/:sellerId` - Get POS integrations
- `POST /api/pos/integrations` - Create POS integration
- `PUT /api/pos/integrations/:id` - Update POS integration
- `POST /api/pos/sync/:integrationId` - Trigger inventory sync
- `GET /api/pos/sync-logs/:integrationId` - Get sync logs

### Admin Portal (`@local-tcg/admin`)

React web application for sellers and administrators:
- Dashboard with statistics and quick actions
- Inventory management (CRUD operations)
- Seller management
- POS integration configuration
- Real-time sync monitoring
- Admin-focused UI with management controls

**Pages:**
- `/` - Admin dashboard
- `/inventory` - Inventory management
- `/sellers` - Seller management
- `/pos-integrations` - POS integration settings

### Client App (`@local-tcg/client`)

Ionic/Capacitor mobile application for end users:
- Card search interface with filters
- Nearby seller discovery
- Interactive maps (Leaflet)
- Native mobile capabilities (geolocation, camera, etc.)
- Tab-based navigation
- Cross-platform support (PWA, Android, iOS)

**Features:**
- Native geolocation via Capacitor
- Optimized for mobile screens
- Offline-capable PWA
- Push notification support (via plugins)
- Camera and photo library access

## 🛠️ Development

### Available Scripts

**Root level:**
- `npm run dev` - Start backend, admin portal, and client app in development mode
- `npm run build` - Build all packages
- `npm run test` - Run tests in all packages
- `npm run lint` - Lint all packages
- `npm run format` - Format code with Prettier

**Individual packages:**
- `npm run dev:backend` - Start backend only
- `npm run dev:admin` - Start admin portal only  
- `npm run dev:client` - Start client app only
- `npm run build:backend` - Build backend only
- `npm run build:admin` - Build admin portal only
- `npm run build:client` - Build client app only

**Mobile app specific:**
- `npm run build:android --workspace=@local-tcg/client` - Build for Android
- `npm run build:ios --workspace=@local-tcg/client` - Build for iOS
- `npm run sync --workspace=@local-tcg/client` - Sync web assets to native projects

### Database

The backend uses SQLite for data storage. The database file is created automatically at `packages/backend/data/marketplace.db` on first run.

**Tables:**
- `sellers` - Store and seller information
- `cards` - Card catalog
- `inventory` - Available cards for sale
- `pos_integrations` - POS system configurations
- `sync_logs` - Synchronization history

### Adding Sample Data

To test the application with sample data, you can use the API endpoints or create a seed script. Example:

```bash
# Create a seller
curl -X POST http://localhost:3001/api/sellers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Magic Cards Plus",
    "type": "STORE",
    "email": "contact@magiccards.com",
    "phone": "555-0123",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }'
```

## 🔌 POS Integration

The platform supports integration with popular POS systems. To add a POS integration:

1. Create a seller account
2. Use the `/api/pos/integrations` endpoint to register the integration
3. Configure API credentials
4. Trigger sync with `/api/pos/sync/:integrationId`

Currently supported systems:
- Square
- Shopify
- Crystal Commerce
- Binding Edge
- TCGPlayer
- Custom (webhook-based)

## 🌍 Deployment

### Backend Deployment

The backend can be deployed to any Node.js hosting platform:

1. Build the backend:
```bash
npm run build:backend
```

2. Set environment variables in your hosting platform

3. Start the server:
```bash
cd packages/backend && npm start
```

### Frontend Deployment

The frontend can be deployed to static hosting platforms (Vercel, Netlify, etc.):

1. Build the frontend:
```bash
npm run build:frontend
```

2. Deploy the `packages/frontend/dist` directory

3. Configure the `VITE_API_BASE_URL` environment variable to point to your backend

## 🧪 Testing

Run tests for all packages:
```bash
npm run test
```

Run tests for a specific package:
```bash
npm run test --workspace=@local-tcg/backend
npm run test --workspace=@local-tcg/frontend
```

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or support, please open an issue on GitHub.

---

Built with ❤️ for the TCG community