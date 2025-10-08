import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { callOutline, mailOutline, globeOutline, timeOutline, starOutline } from 'ionicons/icons';

const SellersPage: React.FC = () => {
  const [sellers, setSellers] = useState<any[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    loadSellers();
  }, []);

  useEffect(() => {
    filterSellers();
  }, [searchText, typeFilter, sellers]);

  const loadSellers = async () => {
    try {
      const response = await fetch('/api/sellers?limit=100');
      const data = await response.json();
      setSellers(data.data || []);
    } catch (error) {
      console.error('Failed to load sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSellers = () => {
    let filtered = sellers;

    if (typeFilter) {
      filtered = filtered.filter((s) => s.type === typeFilter);
    }

    if (searchText) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredSellers(filtered);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>🏪 Nearby Sellers</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Nearby Sellers</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="ion-padding">
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value!)}
            placeholder="Search sellers..."
            animated
          />

          <IonItem>
            <IonLabel>Filter by Type</IonLabel>
            <IonSelect
              value={typeFilter}
              onIonChange={(e) => setTypeFilter(e.detail.value)}
              placeholder="All Types"
            >
              <IonSelectOption value="">All Types</IonSelectOption>
              <IonSelectOption value="STORE">Stores</IonSelectOption>
              <IonSelectOption value="INDIVIDUAL">Individuals</IonSelectOption>
            </IonSelect>
          </IonItem>

          {loading && (
            <div className="ion-text-center ion-margin-top">
              <IonSpinner />
            </div>
          )}

          {!loading && filteredSellers.length === 0 && (
            <IonText color="medium" className="ion-text-center ion-margin-top">
              <p>No sellers found</p>
            </IonText>
          )}

          <IonList>
            {filteredSellers.map((seller) => (
              <IonCard key={seller.id}>
                <IonCardHeader>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <IonCardTitle>{seller.name}</IonCardTitle>
                    <IonBadge color={seller.type === 'STORE' ? 'primary' : 'success'}>
                      {seller.type}
                    </IonBadge>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  {seller.city && seller.state && (
                    <p>
                      <strong>📍 Location:</strong> {seller.city}, {seller.state}
                    </p>
                  )}
                  
                  {seller.email && (
                    <p>
                      <IonIcon icon={mailOutline} />{' '}
                      <a href={`mailto:${seller.email}`}>{seller.email}</a>
                    </p>
                  )}
                  
                  {seller.phone && (
                    <p>
                      <IonIcon icon={callOutline} />{' '}
                      <a href={`tel:${seller.phone}`}>{seller.phone}</a>
                    </p>
                  )}
                  
                  {seller.website && (
                    <p>
                      <IonIcon icon={globeOutline} />{' '}
                      <a href={seller.website} target="_blank" rel="noopener noreferrer">
                        Visit Website
                      </a>
                    </p>
                  )}
                  
                  {seller.pickup_hours && (
                    <p>
                      <IonIcon icon={timeOutline} />{' '}
                      <strong>Pickup:</strong> {seller.pickup_hours}
                    </p>
                  )}
                  
                  {seller.rating > 0 && (
                    <p>
                      <IonIcon icon={starOutline} color="warning" />{' '}
                      <strong>Rating:</strong> {seller.rating.toFixed(1)}/5.0
                    </p>
                  )}
                </IonCardContent>
              </IonCard>
            ))}
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SellersPage;
