import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const InventoryManagementPage: React.FC = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ sellerId: '', cardName: '' });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const data = await apiService.getInventory({ 
        limit: 100,
        ...filter,
      });
      setInventory(data);
    } catch (error) {
      console.error('Failed to load inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inventory item?')) {
      return;
    }
    
    try {
      // In a real implementation, this would call apiService.deleteInventoryItem(id)
      setInventory(inventory.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete inventory item');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading inventory...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Inventory Management</h1>
        <button style={styles.addButton}>➕ Add New Item</button>
      </div>

      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Filter by card name..."
          value={filter.cardName}
          onChange={(e) => setFilter({ ...filter, cardName: e.target.value })}
          style={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Filter by seller ID..."
          value={filter.sellerId}
          onChange={(e) => setFilter({ ...filter, sellerId: e.target.value })}
          style={styles.filterInput}
        />
        <button onClick={loadInventory} style={styles.filterButton}>
          🔍 Search
        </button>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Card Name</th>
              <th style={styles.th}>Set</th>
              <th style={styles.th}>Condition</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Seller</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr>
                <td colSpan={7} style={styles.emptyState}>
                  No inventory items found
                </td>
              </tr>
            ) : (
              inventory.map((item) => (
                <tr key={item.id} style={styles.tr}>
                  <td style={styles.td}>{item.card_name || 'N/A'}</td>
                  <td style={styles.td}>{item.set_name || 'N/A'}</td>
                  <td style={styles.td}>{item.condition}</td>
                  <td style={styles.td}>${item.price?.toFixed(2)}</td>
                  <td style={styles.td}>{item.quantity}</td>
                  <td style={styles.td}>{item.seller_name || 'N/A'}</td>
                  <td style={styles.td}>
                    <button style={styles.editButton}>✏️</button>
                    <button 
                      style={styles.deleteButton}
                      onClick={() => handleDelete(item.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    color: '#333',
    margin: 0,
  },
  addButton: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  filters: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
  },
  filterInput: {
    flex: 1,
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  filterButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '15px',
    textAlign: 'left',
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
    fontWeight: 'bold',
    color: '#495057',
  },
  tr: {
    borderBottom: '1px solid #dee2e6',
  },
  td: {
    padding: '15px',
    color: '#212529',
  },
  editButton: {
    padding: '6px 12px',
    marginRight: '8px',
    backgroundColor: '#ffc107',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666',
  },
};

export default InventoryManagementPage;
