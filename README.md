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

This is a monorepo containing three packages:

```
local-tcg-marketplace/
├── packages/
│   ├── shared/          # Shared TypeScript types and utilities
│   ├── backend/         # Node.js/Express API server
│   └── frontend/        # React web application
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

**Frontend** (`packages/frontend/.env`):
```bash
cp packages/frontend/.env.example packages/frontend/.env
# Edit packages/frontend/.env with your settings
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
- Frontend app on `http://localhost:3000`

## 📦 Package Details

### Shared (`@local-tcg/shared`)

Contains TypeScript types and interfaces shared between frontend and backend:
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

### Frontend (`@local-tcg/frontend`)

React web application with:
- Card search interface
- Interactive maps (Leaflet)
- Seller directory
- Responsive design
- Geolocation support
- Real-time search results

**Pages:**
- `/` - Search page with filters
- `/sellers` - Seller directory
- `/about` - About the platform

## 🛠️ Development

### Available Scripts

**Root level:**
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build all packages
- `npm run test` - Run tests in all packages
- `npm run lint` - Lint all packages
- `npm run format` - Format code with Prettier

**Individual packages:**
- `npm run dev:backend` - Start backend only
- `npm run dev:frontend` - Start frontend only
- `npm run build:backend` - Build backend only
- `npm run build:frontend` - Build frontend only

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