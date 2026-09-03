// frontend/utils/filter.utils.ts
import type { ClientEvent } from './sort.utils';

/**
 * Filters the list of events based on a search query applied to the title or description.
 */
export const filterEventsByQuery = (events: ClientEvent[], query: string): ClientEvent[] => {
  const lowerCaseQuery = query.toLowerCase().trim();
  if (!lowerCaseQuery) return events;

  return events.filter(
    (event) =>
      event.title.toLowerCase().includes(lowerCaseQuery) ||
      event.description.toLowerCase().includes(lowerCaseQuery),
  );
};
