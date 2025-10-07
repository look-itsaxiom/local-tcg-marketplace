import { Router, Request, Response } from 'express';
import { db } from '../config/database';
import { ApiError } from '../middleware/errorHandler';

const router = Router();

// Haversine formula to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

// Search inventory with geo-location and filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      cardName,
      setName,
      condition,
      foilOnly,
      maxPrice,
      minPrice,
      latitude,
      longitude,
      radiusMiles = 25,
      sellerType,
      sortBy = 'price',
      sortOrder = 'asc',
      limit = 50,
      offset = 0,
    } = req.query;

    let query = `
      SELECT 
        i.*,
        c.name as card_name,
        c.set_name,
        c.set_code,
        c.number,
        c.rarity,
        c.image_url,
        c.foil as card_foil,
        s.id as seller_id,
        s.name as seller_name,
        s.type as seller_type,
        s.latitude as seller_latitude,
        s.longitude as seller_longitude,
        s.address,
        s.city,
        s.state,
        s.zip_code,
        s.phone,
        s.pickup_hours,
        s.rating
      FROM inventory i
      JOIN cards c ON i.card_id = c.id
      JOIN sellers s ON i.seller_id = s.id
      WHERE i.quantity > 0
    `;

    const params: any[] = [];

    if (cardName) {
      query += ' AND c.name LIKE ?';
      params.push(`%${cardName}%`);
    }

    if (setName) {
      query += ' AND c.set_name LIKE ?';
      params.push(`%${setName}%`);
    }

    if (condition) {
      const conditions = (condition as string).split(',');
      query += ` AND i.condition IN (${conditions.map(() => '?').join(',')})`;
      params.push(...conditions);
    }

    if (foilOnly === 'true') {
      query += ' AND i.foil = 1';
    }

    if (maxPrice) {
      query += ' AND i.price <= ?';
      params.push(Number(maxPrice));
    }

    if (minPrice) {
      query += ' AND i.price >= ?';
      params.push(Number(minPrice));
    }

    if (sellerType) {
      const types = (sellerType as string).split(',');
      query += ` AND s.type IN (${types.map(() => '?').join(',')})`;
      params.push(...types);
    }

    // Execute query
    db.all(query, params, (err, rows: any[]) => {
      if (err) {
        throw new ApiError('Failed to search inventory', 500, err);
      }

      let results = rows;

      // Filter by distance if location is provided
      if (latitude && longitude) {
        const userLat = Number(latitude);
        const userLon = Number(longitude);
        const maxRadius = Number(radiusMiles);

        results = results
          .map((row) => ({
            ...row,
            distance: calculateDistance(
              userLat,
              userLon,
              row.seller_latitude,
              row.seller_longitude
            ),
          }))
          .filter((row) => row.distance <= maxRadius);
      }

      // Sort results
      if (sortBy === 'distance' && latitude && longitude) {
        results.sort((a: any, b: any) => {
          return sortOrder === 'asc' ? a.distance - b.distance : b.distance - a.distance;
        });
      } else if (sortBy === 'price') {
        results.sort((a: any, b: any) => {
          return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        });
      }

      // Paginate
      const total = results.length;
      const paginatedResults = results.slice(Number(offset), Number(offset) + Number(limit));

      res.json({
        success: true,
        data: {
          items: paginatedResults,
          total,
          hasMore: Number(offset) + Number(limit) < total,
        },
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Search nearby sellers
router.get('/sellers', async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radiusMiles = 25, type, limit = 50 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required',
      });
    }

    let query = 'SELECT * FROM sellers WHERE 1=1';
    const params: any[] = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    db.all(query, params, (err, rows: any[]) => {
      if (err) {
        throw new ApiError('Failed to search sellers', 500, err);
      }

      const userLat = Number(latitude);
      const userLon = Number(longitude);
      const maxRadius = Number(radiusMiles);

      const results = rows
        .map((row) => ({
          ...row,
          distance: calculateDistance(userLat, userLon, row.latitude, row.longitude),
        }))
        .filter((row) => row.distance <= maxRadius)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, Number(limit));

      res.json({
        success: true,
        data: {
          items: results,
          total: results.length,
        },
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
