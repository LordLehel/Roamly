// frontend/utils/filter.utils.ts
import type { UiEvent } from '~/types/events.type';

/**
 * Filters the list of events based on a search query applied to the title or description.
 */
export const filterEventsByQuery = (events: UiEvent[], query: string): UiEvent[] => {
  const lowerCaseQuery = query.toLowerCase().trim();
  if (!lowerCaseQuery) return events;

  return events.filter(
    (event) =>
      event.title.toLowerCase().includes(lowerCaseQuery) ||
      event.description?.toLowerCase().includes(lowerCaseQuery),
  );
};
