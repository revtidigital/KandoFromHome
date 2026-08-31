import { useEffect, useState } from 'react';
import { LOCATIONS } from '../data/locations';

export function useLocationOptions(otherLabel: string, apiBaseUrl: string): string[] {
  const [customLocations, setCustomLocations] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${apiBaseUrl}/api/locations`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (!cancelled && data && Array.isArray(data.locations)) {
          setCustomLocations(data.locations);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [apiBaseUrl]);

  const known = new Set(LOCATIONS.map(loc => loc.toLowerCase()));
  const extra = customLocations.filter(loc => !known.has(loc.toLowerCase()));
  const sorted = [...LOCATIONS, ...extra].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  return [...sorted, otherLabel];
}
