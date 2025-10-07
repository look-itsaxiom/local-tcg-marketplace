import React, { useState } from 'react';
import { SearchQuery } from '@local-tcg/shared';
import SearchFilters from '../components/SearchFilters';
import SearchResults from '../components/SearchResults';
import MapView from '../components/MapView';
import { apiService } from '../services/api';
import { useGeolocation } from '../hooks/useGeolocation';

const SearchPage: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { latitude, longitude, error: geoError } = useGeolocation();

  const handleSearch = async (query: SearchQuery) => {
    setLoading(true);
    setError(null);

    try {
      const searchResults = await apiService.searchInventory(query);
      setResults(searchResults.items);
    } catch (err) {
      setError('Failed to search inventory. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const userLocation =
    latitude !== null && longitude !== null ? { latitude, longitude } : null;

  // Extract unique sellers from results
  const sellersInResults = results
    .filter((item) => item.seller_latitude && item.seller_longitude)
    .reduce((acc, item) => {
      if (!acc.find((s: any) => s.id === item.seller_id)) {
        acc.push({
          id: item.seller_id,
          name: item.seller_name,
          type: item.seller_type,
          seller_latitude: item.seller_latitude,
          seller_longitude: item.seller_longitude,
          city: item.city,
          state: item.state,
          distance: item.distance,
        });
      }
      return acc;
    }, []);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.sidebar}>
          <SearchFilters onSearch={handleSearch} userLocation={userLocation} />
          {geoError && (
            <div style={styles.geoError}>
              <p>⚠️ Location access denied. Distance-based search may not work properly.</p>
            </div>
          )}
        </div>
        <div style={styles.mainContent}>
          {error && <div style={styles.error}>{error}</div>}
          <SearchResults results={results} loading={loading} />
          {sellersInResults.length > 0 && userLocation && (
            <MapView
              sellers={sellersInResults}
              center={[userLocation.latitude, userLocation.longitude]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '350px 1fr',
    gap: '30px',
  },
  sidebar: {
    position: 'sticky',
    top: '20px',
    alignSelf: 'flex-start',
  },
  mainContent: {
    minHeight: '400px',
  },
  geoError: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#856404',
  },
  error: {
    padding: '15px',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
    color: '#721c24',
    marginBottom: '20px',
  },
};

export default SearchPage;
