import { Router, Request, Response } from 'express';
import { db } from '../config/database';
import { ApiError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get all POS integrations for a seller
router.get('/integrations/:sellerId', async (req: Request, res: Response) => {
  try {
    const { sellerId } = req.params;

    db.all(
      'SELECT id, seller_id, system_type, store_id, enabled, last_synced_at, created_at FROM pos_integrations WHERE seller_id = ?',
      [sellerId],
      (err, rows) => {
        if (err) {
          throw new ApiError('Failed to fetch POS integrations', 500, err);
        }
        res.json({ success: true, data: rows });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Create POS integration
router.post('/integrations', async (req: Request, res: Response) => {
  try {
    const { sellerId, systemType, apiKey, apiSecret, storeId } = req.body;

    if (!sellerId || !systemType || !apiKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: sellerId, systemType, apiKey',
      });
    }

    const id = uuidv4();

    db.run(
      `
      INSERT INTO pos_integrations (id, seller_id, system_type, api_key, api_secret, store_id, enabled)
      VALUES (?, ?, ?, ?, ?, ?, 1)
      `,
      [id, sellerId, systemType, apiKey, apiSecret, storeId],
      function (err) {
        if (err) {
          throw new ApiError('Failed to create POS integration', 500, err);
        }
        res.status(201).json({ success: true, data: { id } });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Update POS integration
router.put('/integrations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { enabled } = req.body;

    db.run(
      'UPDATE pos_integrations SET enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [enabled ? 1 : 0, id],
      function (err) {
        if (err) {
          throw new ApiError('Failed to update POS integration', 500, err);
        }
        if (this.changes === 0) {
          return res.status(404).json({ success: false, error: 'POS integration not found' });
        }
        res.json({ success: true, message: 'POS integration updated' });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Trigger sync for a POS integration
router.post('/sync/:integrationId', async (req: Request, res: Response) => {
  try {
    const { integrationId } = req.params;

    // Get integration details
    db.get(
      'SELECT * FROM pos_integrations WHERE id = ? AND enabled = 1',
      [integrationId],
      (err, integration: any) => {
        if (err) {
          throw new ApiError('Failed to fetch integration', 500, err);
        }
        if (!integration) {
          return res.status(404).json({
            success: false,
            error: 'Integration not found or disabled',
          });
        }

        // Create sync log
        const logId = uuidv4();
        db.run(
          'INSERT INTO sync_logs (id, integration_id, status) VALUES (?, ?, ?)',
          [logId, integrationId, 'IN_PROGRESS'],
          function (err) {
            if (err) {
              throw new ApiError('Failed to create sync log', 500, err);
            }

            // In a real implementation, this would call the actual POS API
            // For now, we'll just simulate a successful sync
            setTimeout(() => {
              db.run(
                `
                UPDATE sync_logs 
                SET status = ?, items_synced = ?, completed_at = CURRENT_TIMESTAMP 
                WHERE id = ?
                `,
                ['SUCCESS', 0, logId],
                (err) => {
                  if (err) console.error('Failed to update sync log:', err);
                }
              );

              db.run(
                'UPDATE pos_integrations SET last_synced_at = CURRENT_TIMESTAMP WHERE id = ?',
                [integrationId],
                (err) => {
                  if (err) console.error('Failed to update integration sync time:', err);
                }
              );
            }, 1000);

            res.json({
              success: true,
              message: 'Sync started',
              data: { syncLogId: logId },
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Get sync logs for an integration
router.get('/sync-logs/:integrationId', async (req: Request, res: Response) => {
  try {
    const { integrationId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    db.all(
      `
      SELECT * FROM sync_logs 
      WHERE integration_id = ? 
      ORDER BY started_at DESC 
      LIMIT ? OFFSET ?
      `,
      [integrationId, Number(limit), Number(offset)],
      (err, rows) => {
        if (err) {
          throw new ApiError('Failed to fetch sync logs', 500, err);
        }
        res.json({ success: true, data: rows });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Delete POS integration
router.delete('/integrations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    db.run('DELETE FROM pos_integrations WHERE id = ?', [id], function (err) {
      if (err) {
        throw new ApiError('Failed to delete POS integration', 500, err);
      }
      if (this.changes === 0) {
        return res.status(404).json({ success: false, error: 'POS integration not found' });
      }
      res.json({ success: true, message: 'POS integration deleted' });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
