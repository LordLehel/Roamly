// frontend/utils/filter.utils.ts
import type { UiEvent } from '~/types/events.type';
import type { GroupFile } from '~/types/files.type';

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

/**
 * Filters the list of group documents based on document type and search query (file name).
 */
export const filterGroupDocuments = (
  documents: GroupFile[],
  query?: string,
  filterType?: string,
): GroupFile[] => {
  if (!documents || !Array.isArray(documents)) return [];

  let filtered = documents;

  const safeFilterType = (filterType || 'ALL').toUpperCase();
  if (safeFilterType !== 'ALL') {
    filtered = filtered.filter(
      (doc) => doc.documents?.document_type?.toUpperCase() === safeFilterType,
    );
  }

  const safeQuery = (query || '').toLowerCase().trim();
  if (safeQuery) {
    filtered = filtered.filter((doc) => doc.file_name?.toLowerCase().includes(safeQuery));
  }

  return filtered;
};
