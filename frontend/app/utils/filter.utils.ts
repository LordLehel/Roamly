// frontend/app/utils/filter.utils.ts

export interface PaginatedFetchResult<T, C = string> {
  items: T[];
  nextCursor: C | null;
  hasNextPage: boolean;
}

/**
 * Fetches data from a paginated endpoint and filters it based on a condition.
 * It fetches data until either the target count is reached or the maximum number of pages to fetch is exceeded.
 */
export async function fetchWithFrontendFilter<T, C = string>(
  fetchFn: (cursor: C | null) => Promise<PaginatedFetchResult<T, C>>,
  filterFn: (item: T) => boolean,
  initialCursor: C | null = null,
  targetCount: number = 15,
  maxPagesToFetch: number = 5,
): Promise<PaginatedFetchResult<T, C>> {
  let accumulatedItems: T[] = [];
  let currentCursor = initialCursor;
  let pagesFetched = 0;
  let hasNext = true;

  while (accumulatedItems.length < targetCount && pagesFetched < maxPagesToFetch && hasNext) {
    const response = await fetchFn(currentCursor);
    pagesFetched++;

    const matchedItems = response.items.filter(filterFn);
    accumulatedItems = [...accumulatedItems, ...matchedItems];

    currentCursor = response.nextCursor;
    hasNext = response.hasNextPage;
  }

  return {
    items: accumulatedItems,
    nextCursor: currentCursor,
    hasNextPage: hasNext,
  };
}
