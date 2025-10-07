import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    getCurrentPosition();
  }, []);

  const getCurrentPosition = async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      setState({
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        error: null,
        loading: false,
      });
    } catch (error: any) {
      setState({
        latitude: null,
        longitude: null,
        error: error.message || 'Failed to get location',
        loading: false,
      });
    }
  };

  return state;
};
