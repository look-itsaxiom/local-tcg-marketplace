# API Documentation

## Base URL

Development: `http://localhost:3001/api`

## Endpoints

### Health Check

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Search

#### Search Inventory

**GET** `/search`

Search for cards with filters and geo-location.

**Query Parameters:**
- `cardName` (string, optional) - Filter by card name (partial match)
- `setName` (string, optional) - Filter by set name (partial match)
- `condition` (string, optional) - Comma-separated conditions (MINT, NEAR_MINT, etc.)
- `foilOnly` (boolean, optional) - Only return foil cards
- `maxPrice` (number, optional) - Maximum price
- `minPrice` (number, optional) - Minimum price
- `latitude` (number, optional) - User's latitude for distance calculation
- `longitude` (number, optional) - User's longitude for distance calculation
- `radiusMiles` (number, optional, default: 25) - Search radius in miles
- `sellerType` (string, optional) - Comma-separated types (STORE, INDIVIDUAL)
- `sortBy` (string, optional) - Sort field (price, distance, condition)
- `sortOrder` (string, optional) - Sort order (asc, desc)
- `limit` (number, optional, default: 50) - Results per page
- `offset` (number, optional, default: 0) - Pagination offset

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "hasMore": true
  }
}
```

#### Search Nearby Sellers

**GET** `/search/sellers`

Find sellers within a radius.

**Query Parameters:**
- `latitude` (number, required) - User's latitude
- `longitude` (number, required) - User's longitude
- `radiusMiles` (number, optional, default: 25) - Search radius
- `type` (string, optional) - Seller type (STORE, INDIVIDUAL)
- `limit` (number, optional, default: 50) - Max results

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 10
  }
}
```

---

### Inventory

#### List Inventory

**GET** `/inventory`

Get all inventory items with optional filters.

**Query Parameters:**
- `sellerId` (string, optional) - Filter by seller ID
- `cardName` (string, optional) - Filter by card name
- `limit` (number, optional, default: 50)
- `offset` (number, optional, default: 0)

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```

#### Get Inventory Item

**GET** `/inventory/:id`

Get a single inventory item by ID.

**Response:**
```json
{
  "success": true,
  "data": {...}
}
```

#### Create Inventory Item

**POST** `/inventory`

Create a new inventory item.

**Request Body:**
```json
{
  "cardId": "uuid",
  "sellerId": "uuid",
  "quantity": 1,
  "price": 10.50,
  "condition": "NEAR_MINT",
  "foil": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid"
  }
}
```

#### Update Inventory Item

**PUT** `/inventory/:id`

Update an existing inventory item.

**Request Body:**
```json
{
  "quantity": 2,
  "price": 12.00,
  "condition": "MINT",
  "foil": true
}
```

#### Delete Inventory Item

**DELETE** `/inventory/:id`

Delete an inventory item.

---

### Sellers

#### List Sellers

**GET** `/sellers`

Get all sellers with optional filters.

**Query Parameters:**
- `type` (string, optional) - Filter by type (STORE, INDIVIDUAL)
- `city` (string, optional) - Filter by city
- `state` (string, optional) - Filter by state
- `limit` (number, optional, default: 50)
- `offset` (number, optional, default: 0)

#### Get Seller

**GET** `/sellers/:id`

Get a single seller by ID.

#### Create Seller

**POST** `/sellers`

Create a new seller.

**Request Body:**
```json
{
  "name": "Magic Cards Plus",
  "type": "STORE",
  "email": "contact@example.com",
  "phone": "555-0123",
  "website": "https://example.com",
  "pickupHours": "Mon-Fri 10am-8pm",
  "posSystemType": "SQUARE",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "US"
}
```

#### Update Seller

**PUT** `/sellers/:id`

Update an existing seller. Only provided fields will be updated.

#### Delete Seller

**DELETE** `/sellers/:id`

Delete a seller.

---

### POS Integration

#### Get POS Integrations

**GET** `/pos/integrations/:sellerId`

Get all POS integrations for a seller.

#### Create POS Integration

**POST** `/pos/integrations`

Create a new POS integration.

**Request Body:**
```json
{
  "sellerId": "uuid",
  "systemType": "SQUARE",
  "apiKey": "your-api-key",
  "apiSecret": "your-api-secret",
  "storeId": "store-id"
}
```

#### Update POS Integration

**PUT** `/pos/integrations/:id`

Update a POS integration (enable/disable).

**Request Body:**
```json
{
  "enabled": true
}
```

#### Trigger Sync

**POST** `/pos/sync/:integrationId`

Trigger an inventory sync for a POS integration.

**Response:**
```json
{
  "success": true,
  "message": "Sync started",
  "data": {
    "syncLogId": "uuid"
  }
}
```

#### Get Sync Logs

**GET** `/pos/sync-logs/:integrationId`

Get sync history for an integration.

**Query Parameters:**
- `limit` (number, optional, default: 20)
- `offset` (number, optional, default: 0)

#### Delete POS Integration

**DELETE** `/pos/integrations/:id`

Delete a POS integration.

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "success": false,
  "error": "Error message",
  "details": {...}  // Only in development
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error
