import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/marketplace.db');
const dbDir = path.dirname(dbPath);

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('📦 Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Create tables
  db.serialize(() => {
    // Sellers table
    db.run(`
      CREATE TABLE IF NOT EXISTS sellers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        website TEXT,
        pickup_hours TEXT,
        rating REAL DEFAULT 0,
        total_sales INTEGER DEFAULT 0,
        pos_system_type TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        address TEXT,
        city TEXT,
        state TEXT,
        zip_code TEXT,
        country TEXT DEFAULT 'US',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Cards table
    db.run(`
      CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        set_name TEXT NOT NULL,
        set_code TEXT NOT NULL,
        number TEXT NOT NULL,
        rarity TEXT NOT NULL,
        condition TEXT NOT NULL,
        foil INTEGER DEFAULT 0,
        language TEXT DEFAULT 'English',
        image_url TEXT,
        tcgplayer_id TEXT,
        scryfall_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Inventory table
    db.run(`
      CREATE TABLE IF NOT EXISTS inventory (
        id TEXT PRIMARY KEY,
        card_id TEXT NOT NULL,
        seller_id TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        price REAL NOT NULL,
        condition TEXT NOT NULL,
        foil INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (card_id) REFERENCES cards(id),
        FOREIGN KEY (seller_id) REFERENCES sellers(id)
      )
    `);

    // POS Integrations table
    db.run(`
      CREATE TABLE IF NOT EXISTS pos_integrations (
        id TEXT PRIMARY KEY,
        seller_id TEXT NOT NULL,
        system_type TEXT NOT NULL,
        api_key TEXT NOT NULL,
        api_secret TEXT,
        store_id TEXT,
        enabled INTEGER DEFAULT 1,
        last_synced_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES sellers(id)
      )
    `);

    // Sync logs table
    db.run(`
      CREATE TABLE IF NOT EXISTS sync_logs (
        id TEXT PRIMARY KEY,
        integration_id TEXT NOT NULL,
        status TEXT NOT NULL,
        items_synced INTEGER,
        error_message TEXT,
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        FOREIGN KEY (integration_id) REFERENCES pos_integrations(id)
      )
    `);

    // Create indexes for performance
    db.run('CREATE INDEX IF NOT EXISTS idx_inventory_seller ON inventory(seller_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_inventory_card ON inventory(card_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_cards_name ON cards(name)');
    db.run('CREATE INDEX IF NOT EXISTS idx_sellers_location ON sellers(latitude, longitude)');

    console.log('✅ Database tables initialized');
  });
}

export default db;
