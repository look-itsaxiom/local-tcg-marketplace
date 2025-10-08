import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonCheckbox,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonText,
  IonSpinner,
} from '@ionic/react';
import { searchOutline, locationOutline } from 'ionicons/icons';
import { SearchQuery } from '@local-tcg/shared';
import { apiService } from '../services/api';
import { useGeolocation } from '../hooks/useGeolocation';

const SearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cardName, setCardName] = useState('');
  const [setName, setSetName] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [radiusMiles, setRadiusMiles] = useState('25');
  const [foilOnly, setFoilOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'distance' | 'condition'>('price');
  
  const { latitude, longitude } = useGeolocation();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const query: SearchQuery = {
        cardName: cardName || undefined,
        setName: setName || undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        radiusMiles: Number(radiusMiles),
        foilOnly,
        sortBy,
        sortOrder: 'asc',
      };

      if (latitude && longitude) {
        query.latitude = latitude;
        query.longitude = longitude;
      }

      const results = await apiService.searchInventory(query);
      setSearchResults(results.items);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>🃏 Find Cards</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Find Cards</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="ion-padding">
          <IonSearchbar
            value={cardName}
            onIonInput={(e) => setCardName(e.detail.value!)}
            placeholder="Search card name..."
            animated
          />

          <IonList>
            <IonItem>
              <IonLabel position="stacked">Set Name</IonLabel>
              <IonInput
                value={setName}
                onIonInput={(e) => setSetName(e.detail.value!)}
                placeholder="e.g., Alpha, Beta"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Max Price ($)</IonLabel>
              <IonInput
                type="number"
                value={maxPrice}
                onIonInput={(e) => setMaxPrice(e.detail.value!)}
                placeholder="Any"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Search Radius (miles)</IonLabel>
              <IonInput
                type="number"
                value={radiusMiles}
                onIonInput={(e) => setRadiusMiles(e.detail.value!)}
              />
            </IonItem>

            <IonItem>
              <IonLabel>Sort By</IonLabel>
              <IonSelect
                value={sortBy}
                onIonChange={(e) => setSortBy(e.detail.value)}
              >
                <IonSelectOption value="price">Price</IonSelectOption>
                <IonSelectOption value="distance">Distance</IonSelectOption>
                <IonSelectOption value="condition">Condition</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel>Foil Only</IonLabel>
              <IonCheckbox
                checked={foilOnly}
                onIonChange={(e) => setFoilOnly(e.detail.checked)}
              />
            </IonItem>
          </IonList>

          <IonButton
            expand="block"
            onClick={handleSearch}
            disabled={loading}
            className="ion-margin-top"
          >
            <IonIcon slot="start" icon={searchOutline} />
            {loading ? 'Searching...' : 'Search'}
          </IonButton>

          {loading && (
            <div className="ion-text-center ion-margin-top">
              <IonSpinner />
            </div>
          )}

          {!loading && searchResults.length > 0 && (
            <>
              <IonText color="medium" className="ion-margin-top">
                <h3>Found {searchResults.length} card(s)</h3>
              </IonText>
              {searchResults.map((item) => (
                <IonCard key={item.id}>
                  <IonCardHeader>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <IonCardTitle>{item.card_name}</IonCardTitle>
                      <IonBadge color="success">${item.price?.toFixed(2)}</IonBadge>
                    </div>
                  </IonCardHeader>
                  <IonCardContent>
                    <p><strong>Set:</strong> {item.set_name} ({item.set_code})</p>
                    <p><strong>Condition:</strong> {item.condition} {item.foil ? '(Foil)' : ''}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p>
                      <IonIcon icon={locationOutline} />
                      <strong> Seller:</strong> {item.seller_name}
                    </p>
                    {item.city && item.state && (
                      <p className="ion-text-wrap">
                        📍 {item.city}, {item.state}
                      </p>
                    )}
                    {item.distance !== undefined && (
                      <IonBadge color="primary">
                        {item.distance.toFixed(1)} miles away
                      </IonBadge>
                    )}
                  </IonCardContent>
                </IonCard>
              ))}
            </>
          )}

          {!loading && searchResults.length === 0 && cardName && (
            <IonText color="medium" className="ion-text-center ion-margin-top">
              <p>No results found. Try adjusting your search.</p>
            </IonText>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SearchPage;
