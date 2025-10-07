import React from 'react';

interface InventoryItem {
  id: string;
  card_name: string;
  set_name: string;
  set_code: string;
  rarity: string;
  condition: string;
  price: number;
  quantity: number;
  foil: number;
  seller_name: string;
  seller_type: string;
  city?: string;
  state?: string;
  distance?: number;
  image_url?: string;
}

interface SearchResultsProps {
  results: InventoryItem[];
  loading: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, loading }) => {
  if (loading) {
    return <div style={styles.loading}>Searching...</div>;
  }

  if (results.length === 0) {
    return (
      <div style={styles.noResults}>
        <p>No results found. Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Found {results.length} card(s)</h2>
      <div style={styles.resultsList}>
        {results.map((item) => (
          <div key={item.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardName}>{item.card_name}</h3>
              <span style={styles.price}>${item.price.toFixed(2)}</span>
            </div>
            <div style={styles.cardDetails}>
              <p style={styles.detail}>
                <strong>Set:</strong> {item.set_name} ({item.set_code})
              </p>
              <p style={styles.detail}>
                <strong>Condition:</strong> {item.condition}
                {item.foil ? ' (Foil)' : ''}
              </p>
              <p style={styles.detail}>
                <strong>Rarity:</strong> {item.rarity}
              </p>
              <p style={styles.detail}>
                <strong>Quantity:</strong> {item.quantity}
              </p>
            </div>
            <div style={styles.sellerInfo}>
              <p style={styles.seller}>
                <strong>Seller:</strong> {item.seller_name} ({item.seller_type})
              </p>
              {item.city && item.state && (
                <p style={styles.location}>
                  📍 {item.city}, {item.state}
                </p>
              )}
              {item.distance !== undefined && (
                <p style={styles.distance}>🚗 {item.distance.toFixed(1)} miles away</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginTop: '20px',
  },
  title: {
    marginBottom: '20px',
    color: '#333',
  },
  resultsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'box-shadow 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '10px',
  },
  cardName: {
    margin: 0,
    fontSize: '18px',
    color: '#333',
  },
  price: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#28a745',
  },
  cardDetails: {
    marginBottom: '15px',
  },
  detail: {
    margin: '5px 0',
    fontSize: '14px',
    color: '#666',
  },
  sellerInfo: {
    borderTop: '1px solid #f0f0f0',
    paddingTop: '10px',
  },
  seller: {
    margin: '5px 0',
    fontSize: '14px',
    color: '#333',
  },
  location: {
    margin: '5px 0',
    fontSize: '13px',
    color: '#666',
  },
  distance: {
    margin: '5px 0',
    fontSize: '13px',
    color: '#007bff',
    fontWeight: 'bold',
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
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    color: '#666',
  },
};

export default SearchResults;
