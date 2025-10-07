import React, { useState } from 'react';
import { SearchQuery } from '@local-tcg/shared';

interface SearchFiltersProps {
  onSearch: (query: SearchQuery) => void;
  userLocation: { latitude: number; longitude: number } | null;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, userLocation }) => {
  const [cardName, setCardName] = useState('');
  const [setName, setSetName] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [radiusMiles, setRadiusMiles] = useState('25');
  const [foilOnly, setFoilOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'distance' | 'condition'>('price');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const query: SearchQuery = {
      cardName: cardName || undefined,
      setName: setName || undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      radiusMiles: Number(radiusMiles),
      foilOnly,
      sortBy,
      sortOrder: 'asc',
    };

    if (userLocation) {
      query.latitude = userLocation.latitude;
      query.longitude = userLocation.longitude;
    }

    onSearch(query);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Search TCG Singles</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Card Name:</label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="e.g., Lightning Bolt"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Set Name:</label>
          <input
            type="text"
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            placeholder="e.g., Alpha"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Max Price ($):</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Any"
            step="0.01"
            min="0"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Radius (miles):</label>
          <input
            type="number"
            value={radiusMiles}
            onChange={(e) => setRadiusMiles(e.target.value)}
            min="1"
            max="500"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={foilOnly}
              onChange={(e) => setFoilOnly(e.target.checked)}
              style={styles.checkbox}
            />
            Foil Only
          </label>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={styles.select}
          >
            <option value="price">Price</option>
            <option value="distance">Distance</option>
            <option value="condition">Condition</option>
          </select>
        </div>

        <button type="submit" style={styles.button}>
          Search
        </button>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  title: {
    marginTop: 0,
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '8px',
    cursor: 'pointer',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default SearchFilters;
