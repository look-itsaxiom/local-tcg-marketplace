import { db } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

// Sample sellers across different US cities
const sampleSellers = [
  {
    name: "Magic Emporium NYC",
    type: "STORE",
    email: "contact@magicemporiumnys.com",
    phone: "212-555-0123",
    website: "https://magicemporium.example.com",
    pickupHours: "Mon-Fri 10am-9pm, Sat-Sun 12pm-8pm",
    posSystemType: "SQUARE",
    latitude: 40.7589,
    longitude: -73.9851,
    address: "456 Madison Ave",
    city: "New York",
    state: "NY",
    zipCode: "10022",
  },
  {
    name: "CardQuest LA",
    type: "STORE",
    email: "info@cardquestla.com",
    phone: "323-555-0456",
    website: "https://cardquest.example.com",
    pickupHours: "Daily 11am-8pm",
    posSystemType: "CRYSTAL_COMMERCE",
    latitude: 34.0522,
    longitude: -118.2437,
    address: "789 Sunset Blvd",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90028",
  },
  {
    name: "Chicago Game Haven",
    type: "STORE",
    email: "hello@chicagogamehaven.com",
    phone: "312-555-0789",
    posSystemType: "SHOPIFY",
    latitude: 41.8781,
    longitude: -87.6298,
    address: "321 Michigan Ave",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
  },
  {
    name: "John's Collection",
    type: "INDIVIDUAL",
    email: "john.collector@example.com",
    phone: "415-555-0234",
    pickupHours: "By appointment",
    latitude: 37.7749,
    longitude: -122.4194,
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
  },
  {
    name: "Seattle Card Exchange",
    type: "STORE",
    email: "support@seattlecards.com",
    phone: "206-555-0567",
    website: "https://seattlecardexchange.example.com",
    pickupHours: "Tue-Sat 10am-7pm",
    posSystemType: "TCGPLAYER",
    latitude: 47.6062,
    longitude: -122.3321,
    address: "123 Pike Street",
    city: "Seattle",
    state: "WA",
    zipCode: "98101",
  },
];

// Sample Magic: The Gathering cards
const sampleCards = [
  {
    name: "Lightning Bolt",
    setName: "Revised Edition",
    setCode: "3ED",
    number: "162",
    rarity: "Common",
    language: "English",
  },
  {
    name: "Black Lotus",
    setName: "Limited Edition Alpha",
    setCode: "LEA",
    number: "232",
    rarity: "Rare",
    language: "English",
  },
  {
    name: "Counterspell",
    setName: "Ice Age",
    setCode: "ICE",
    number: "64",
    rarity: "Common",
    language: "English",
  },
  {
    name: "Sol Ring",
    setName: "Commander 2021",
    setCode: "C21",
    number: "263",
    rarity: "Uncommon",
    language: "English",
  },
  {
    name: "Force of Will",
    setName: "Alliances",
    setCode: "ALL",
    number: "28",
    rarity: "Uncommon",
    language: "English",
  },
  {
    name: "Brainstorm",
    setName: "Ice Age",
    setCode: "ICE",
    number: "61",
    rarity: "Common",
    language: "English",
  },
  {
    name: "Birds of Paradise",
    setName: "Ravnica",
    setCode: "RAV",
    number: "149",
    rarity: "Rare",
    language: "English",
  },
  {
    name: "Path to Exile",
    setName: "Modern Masters",
    setCode: "MMA",
    number: "19",
    rarity: "Uncommon",
    language: "English",
  },
];

const conditions = ["MINT", "NEAR_MINT", "EXCELLENT", "LIGHT_PLAYED", "PLAYED"];

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  const sellerIds: string[] = [];
  const cardIds: string[] = [];

  // Insert sellers
  console.log("📦 Inserting sellers...");
  for (const seller of sampleSellers) {
    const id = uuidv4();
    sellerIds.push(id);

    await new Promise<void>((resolve, reject) => {
      db.run(
        `
        INSERT INTO sellers (
          id, name, type, email, phone, website, pickup_hours, pos_system_type,
          latitude, longitude, address, city, state, zip_code, country
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          id,
          seller.name,
          seller.type,
          seller.email,
          seller.phone,
          seller.website || null,
          seller.pickupHours || null,
          seller.posSystemType || null,
          seller.latitude,
          seller.longitude,
          seller.address || null,
          seller.city,
          seller.state,
          seller.zipCode,
          "US",
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
  console.log(`✅ Inserted ${sellerIds.length} sellers`);

  // Insert cards
  console.log("🃏 Inserting cards...");
  for (const card of sampleCards) {
    for (const condition of conditions) {
      const foilVariants = [false, true];
      for (const foil of foilVariants) {
        const id = uuidv4();
        cardIds.push(id);

        await new Promise<void>((resolve, reject) => {
          db.run(
            `
            INSERT INTO cards (
              id, name, set_name, set_code, number, rarity, condition, foil, language
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
              id,
              card.name,
              card.setName,
              card.setCode,
              card.number,
              card.rarity,
              condition,
              foil ? 1 : 0,
              card.language,
            ],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      }
    }
  }
  console.log(`✅ Inserted ${cardIds.length} card variants`);

  // Insert inventory (randomly distribute cards across sellers)
  console.log("📊 Inserting inventory items...");
  let inventoryCount = 0;
  for (const cardId of cardIds) {
    // Each card will be available at 1-3 random sellers
    const numSellers = Math.floor(Math.random() * 3) + 1;
    const shuffledSellerIds = [...sellerIds].sort(() => Math.random() - 0.5);
    const selectedSellerIds = shuffledSellerIds.slice(0, numSellers);

    for (const sellerId of selectedSellerIds) {
      const id = uuidv4();
      const quantity = Math.floor(Math.random() * 10) + 1;
      // Price varies based on rarity and condition (simplified)
      const basePrice = Math.random() * 50 + 0.5;
      const price = Math.round(basePrice * 100) / 100;

      // Get the card info to determine foil status
      const cardInfo = await new Promise<any>((resolve, reject) => {
        db.get("SELECT foil, condition FROM cards WHERE id = ?", [cardId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      await new Promise<void>((resolve, reject) => {
        db.run(
          `
          INSERT INTO inventory (
            id, card_id, seller_id, quantity, price, condition, foil
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [
            id,
            cardId,
            sellerId,
            quantity,
            price,
            cardInfo.condition,
            cardInfo.foil,
          ],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
      inventoryCount++;
    }
  }
  console.log(`✅ Inserted ${inventoryCount} inventory items`);

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\nSummary:");
  console.log(`  - ${sellerIds.length} sellers`);
  console.log(`  - ${cardIds.length} card variants`);
  console.log(`  - ${inventoryCount} inventory items`);
  console.log("\n🚀 You can now start the server and test the application!");
}

// Run the seed function
seedDatabase()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  });
