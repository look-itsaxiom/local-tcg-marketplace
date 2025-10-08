import { Router, Request, Response } from 'express';
import { db } from '../config/database';
import { ApiError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get all sellers with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type, city, state, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM sellers WHERE 1=1';
    const params: any[] = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    if (city) {
      query += ' AND city LIKE ?';
      params.push(`%${city}%`);
    }
    if (state) {
      query += ' AND state = ?';
      params.push(state);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    db.all(query, params, (err, rows) => {
      if (err) {
        throw new ApiError('Failed to fetch sellers', 500, err);
      }
      res.json({ success: true, data: rows });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Get single seller
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    db.get('SELECT * FROM sellers WHERE id = ?', [id], (err, row) => {
      if (err) {
        throw new ApiError('Failed to fetch seller', 500, err);
      }
      if (!row) {
        return res.status(404).json({ success: false, error: 'Seller not found' });
      }
      res.json({ success: true, data: row });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Create seller
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name,
      type,
      email,
      phone,
      website,
      pickupHours,
      posSystemType,
      latitude,
      longitude,
      address,
      city,
      state,
      zipCode,
      country,
    } = req.body;

    if (!name || !type || !email || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, type, email, latitude, longitude',
      });
    }

    const id = uuidv4();

    db.run(
      `
      INSERT INTO sellers (
        id, name, type, email, phone, website, pickup_hours, pos_system_type,
        latitude, longitude, address, city, state, zip_code, country
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        name,
        type,
        email,
        phone,
        website,
        pickupHours,
        posSystemType,
        latitude,
        longitude,
        address,
        city,
        state,
        zipCode,
        country || 'US',
      ],
      function (err) {
        if (err) {
          throw new ApiError('Failed to create seller', 500, err);
        }
        res.status(201).json({ success: true, data: { id } });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Update seller
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const allowedFields = [
      'name',
      'phone',
      'website',
      'pickup_hours',
      'pos_system_type',
      'address',
      'city',
      'state',
      'zip_code',
    ];

    const updates: string[] = [];
    const params: any[] = [];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(req.body[field]);
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    db.run(`UPDATE sellers SET ${updates.join(', ')} WHERE id = ?`, params, function (err) {
      if (err) {
        throw new ApiError('Failed to update seller', 500, err);
      }
      if (this.changes === 0) {
        return res.status(404).json({ success: false, error: 'Seller not found' });
      }
      res.json({ success: true, message: 'Seller updated' });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Delete seller
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    db.run('DELETE FROM sellers WHERE id = ?', [id], function (err) {
      if (err) {
        throw new ApiError('Failed to delete seller', 500, err);
      }
      if (this.changes === 0) {
        return res.status(404).json({ success: false, error: 'Seller not found' });
      }
      res.json({ success: true, message: 'Seller deleted' });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
