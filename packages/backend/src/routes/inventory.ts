import { Router, Request, Response } from 'express';
import { db } from '../config/database';
import { ApiError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get all inventory items with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { sellerId, cardName, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT 
        i.*,
        c.name as card_name,
        c.set_name,
        c.set_code,
        c.rarity,
        c.image_url,
        s.name as seller_name,
        s.type as seller_type,
        s.city,
        s.state
      FROM inventory i
      JOIN cards c ON i.card_id = c.id
      JOIN sellers s ON i.seller_id = s.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (sellerId) {
      query += ' AND i.seller_id = ?';
      params.push(sellerId);
    }

    if (cardName) {
      query += ' AND c.name LIKE ?';
      params.push(`%${cardName}%`);
    }

    query += ' ORDER BY i.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    db.all(query, params, (err, rows) => {
      if (err) {
        throw new ApiError('Failed to fetch inventory', 500, err);
      }
      res.json({ success: true, data: rows });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Get single inventory item
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    db.get(
      `
      SELECT 
        i.*,
        c.name as card_name,
        c.set_name,
        c.set_code,
        c.rarity,
        c.image_url,
        s.name as seller_name,
        s.type as seller_type
      FROM inventory i
      JOIN cards c ON i.card_id = c.id
      JOIN sellers s ON i.seller_id = s.id
      WHERE i.id = ?
      `,
      [id],
      (err, row) => {
        if (err) {
          throw new ApiError('Failed to fetch inventory item', 500, err);
        }
        if (!row) {
          return res.status(404).json({ success: false, error: 'Inventory item not found' });
        }
        res.json({ success: true, data: row });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Create inventory item
router.post('/', async (req: Request, res: Response) => {
  try {
    const { cardId, sellerId, quantity, price, condition, foil } = req.body;

    if (!cardId || !sellerId || !quantity || !price || !condition) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: cardId, sellerId, quantity, price, condition',
      });
    }

    const id = uuidv4();

    db.run(
      `
      INSERT INTO inventory (id, card_id, seller_id, quantity, price, condition, foil)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [id, cardId, sellerId, quantity, price, condition, foil ? 1 : 0],
      function (err) {
        if (err) {
          throw new ApiError('Failed to create inventory item', 500, err);
        }
        res.status(201).json({ success: true, data: { id } });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Update inventory item
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity, price, condition, foil } = req.body;

    const updates: string[] = [];
    const params: any[] = [];

    if (quantity !== undefined) {
      updates.push('quantity = ?');
      params.push(quantity);
    }
    if (price !== undefined) {
      updates.push('price = ?');
      params.push(price);
    }
    if (condition !== undefined) {
      updates.push('condition = ?');
      params.push(condition);
    }
    if (foil !== undefined) {
      updates.push('foil = ?');
      params.push(foil ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    db.run(
      `UPDATE inventory SET ${updates.join(', ')} WHERE id = ?`,
      params,
      function (err) {
        if (err) {
          throw new ApiError('Failed to update inventory item', 500, err);
        }
        if (this.changes === 0) {
          return res.status(404).json({ success: false, error: 'Inventory item not found' });
        }
        res.json({ success: true, message: 'Inventory item updated' });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Delete inventory item
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    db.run('DELETE FROM inventory WHERE id = ?', [id], function (err) {
      if (err) {
        throw new ApiError('Failed to delete inventory item', 500, err);
      }
      if (this.changes === 0) {
        return res.status(404).json({ success: false, error: 'Inventory item not found' });
      }
      res.json({ success: true, message: 'Inventory item deleted' });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
