import { LOCATIONS } from '../data/locations';

// Only the static, curated list — a user's typed "Other" location is never
// added back into this dropdown for the next person to see.
export function useLocationOptions(otherLabel: string): string[] {
  return [...LOCATIONS, otherLabel];
}
