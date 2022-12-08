import { useEffect, useState } from 'react';
import { getLocations } from '../services/location.js';

export function useLocations() {
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations();
        setLocations(data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e.message);
      }
    };
    fetchLocations();
  }, []);
  return { locations, setLocations };
}
