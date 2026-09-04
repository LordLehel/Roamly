// frontend/app/queries/events.query.ts
import { useQuery } from '@pinia/colada';
import type { Ref } from 'vue';
import { eventsService } from '~/services/eventsService';

export const useDatesQuery = (groupUuid: Ref<string | undefined>) => {
  return useQuery({
    key: () => ['events-dates', groupUuid.value ?? null],
    query: () => eventsService.getAvailableDates(groupUuid.value!),
    enabled: () => !!groupUuid.value,
  });
};

export const useEventsQuery = (
  groupUuid: Ref<string | undefined>,
  selectedDateId: Ref<string | undefined>,
) => {
  return useQuery({
    key: () => ['events', groupUuid.value ?? null, selectedDateId.value ?? null],
    query: () => {
      const isAll = !selectedDateId.value || selectedDateId.value === 'ALL';
      const filterDate = isAll ? undefined : selectedDateId.value;
      return eventsService.getEvents(groupUuid.value!, filterDate, filterDate);
    },
    enabled: () => !!groupUuid.value && !!selectedDateId.value,
  });
};
