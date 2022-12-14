import { useEffect, useState } from 'react';
import { getJournals } from '../services/journal.js';

export function useJournals() {
  const [journals, setJournals] = useState([]);
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const data = await getJournals();
        console.log('data', data);
        setJournals(data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e.message);
      }
    };
    fetchJournals();
  }, []);
  return { journals, setJournals };
}
