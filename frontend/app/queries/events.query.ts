// frontend/app/queries/events.query.ts
import { useQuery } from '@pinia/colada';
import { unref, type Ref, computed } from 'vue'; // <-- computed importálva
import { eventsService } from '~/services/eventsService';

export const useGroupDaysQuery = (groupUuid: Ref<string | undefined> | string | undefined) => {
  return useQuery({
    // JAVÍTVA a ts hiba miatt: Biztosítjuk, hogy az unref mindig stringet ad
    key: () => ['events', 'days', unref(groupUuid) || ''] as const,
    query: () => eventsService.getDays(unref(groupUuid)!),
    enabled: computed(() => !!unref(groupUuid)),
  });
};

export const useGroupEventsQuery = (
  groupUuid: Ref<string | undefined> | string | undefined,
  dayId: Ref<string | undefined> | string | undefined,
) => {
  return useQuery({
    // JAVÍTVA a ts hiba miatt
    key: () => ['events', 'list', unref(groupUuid) || '', unref(dayId) || ''] as const,
    query: () => eventsService.getEvents(unref(groupUuid)!, unref(dayId)!),
    enabled: computed(() => !!unref(groupUuid) && !!unref(dayId)),
  });
};
