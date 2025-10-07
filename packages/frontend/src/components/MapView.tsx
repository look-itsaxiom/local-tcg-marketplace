import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Seller {
  id: string;
  name: string;
  type: string;
  seller_latitude: number;
  seller_longitude: number;
  city?: string;
  state?: string;
  distance?: number;
}

interface MapViewProps {
  sellers: Seller[];
  center?: LatLngExpression;
}

const MapView: React.FC<MapViewProps> = ({ sellers, center }) => {
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(
    center || [40.7128, -74.006]
  );

  useEffect(() => {
    if (center) {
      setMapCenter(center);
    }
  }, [center]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Seller Locations</h2>
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={styles.map}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sellers.map((seller) => (
          <Marker
            key={seller.id}
            position={[seller.seller_latitude, seller.seller_longitude]}
          >
            <Popup>
              <div>
                <strong>{seller.name}</strong>
                <br />
                Type: {seller.type}
                <br />
                {seller.city && seller.state && (
                  <>
                    Location: {seller.city}, {seller.state}
                    <br />
                  </>
                )}
                {seller.distance !== undefined && (
                  <>Distance: {seller.distance.toFixed(1)} miles</>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginTop: '20px',
  },
  title: {
    marginBottom: '10px',
    color: '#333',
  },
  map: {
    height: '400px',
    width: '100%',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
};

export default MapView;
