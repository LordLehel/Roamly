// frontend/app/queries/events.query.ts
import { useQuery } from '@pinia/colada';
import type { Ref } from 'vue';
import { eventsService } from '~/services/eventsService';

export const useEventsQuery = (
  groupUuid: Ref<string | undefined>,
  startDate: Ref<string>,
  endDate: Ref<string>,
) => {
  return useQuery({
    key: () => ['events', groupUuid.value ?? null, startDate.value, endDate.value],
    query: () => eventsService.getEvents(groupUuid.value!, startDate.value, endDate.value),
    enabled: () => !!groupUuid.value,
  });
};
