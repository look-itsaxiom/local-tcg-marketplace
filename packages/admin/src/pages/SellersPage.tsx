import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';

const SellersPage: React.FC = () => {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    try {
      const data = await apiService.getSellers({ limit: 100 });
      setSellers(data);
    } catch (error) {
      console.error('Failed to load sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSellers = sellers.filter(
    (seller) =>
      filter === '' ||
      seller.type === filter ||
      (seller.name && seller.name.toLowerCase().includes(filter.toLowerCase()))
  );

  if (loading) {
    return <div style={styles.loading}>Loading sellers...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Local Sellers & Stores</h1>

      <div style={styles.filterBar}>
        <input
          type="text"
          placeholder="Search by name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">All Types</option>
          <option value="STORE">Stores</option>
          <option value="INDIVIDUAL">Individuals</option>
        </select>
      </div>

      <div style={styles.sellersList}>
        {filteredSellers.length === 0 ? (
          <p style={styles.noResults}>No sellers found.</p>
        ) : (
          filteredSellers.map((seller) => (
            <div key={seller.id} style={styles.sellerCard}>
              <div style={styles.sellerHeader}>
                <h3 style={styles.sellerName}>{seller.name}</h3>
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor: seller.type === 'STORE' ? '#007bff' : '#28a745',
                  }}
                >
                  {seller.type}
                </span>
              </div>
              <div style={styles.sellerDetails}>
                {seller.city && seller.state && (
                  <p style={styles.detail}>
                    📍 {seller.city}, {seller.state}
                  </p>
                )}
                {seller.email && (
                  <p style={styles.detail}>
                    ✉️ <a href={`mailto:${seller.email}`}>{seller.email}</a>
                  </p>
                )}
                {seller.phone && (
                  <p style={styles.detail}>
                    📞 <a href={`tel:${seller.phone}`}>{seller.phone}</a>
                  </p>
                )}
                {seller.website && (
                  <p style={styles.detail}>
                    🌐{' '}
                    <a href={seller.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </p>
                )}
                {seller.pickup_hours && (
                  <p style={styles.detail}>
                    🕒 Pickup Hours: {seller.pickup_hours}
                  </p>
                )}
                {seller.rating && (
                  <p style={styles.detail}>⭐ Rating: {seller.rating.toFixed(1)}/5.0</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  title: {
    marginBottom: '30px',
    color: '#333',
  },
  filterBar: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
  },
  searchInput: {
    flex: 1,
    padding: '10px 15px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  filterSelect: {
    padding: '10px 15px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  sellersList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  sellerCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sellerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '2px solid #f0f0f0',
  },
  sellerName: {
    margin: 0,
    fontSize: '20px',
    color: '#333',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white',
  },
  sellerDetails: {
    fontSize: '14px',
  },
  detail: {
    margin: '8px 0',
    color: '#666',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666',
  },
  noResults: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
};

export default SellersPage;
