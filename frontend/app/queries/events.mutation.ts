// frontend/app/queries/events.mutation.ts
import { useMutation, useQueryCache } from '@pinia/colada';
import type { Ref } from 'vue';
import { eventsService } from '~/services/eventsService';
import type { EventInDto } from '~/types/events.type';

interface MutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useCreateEventMutation = (
  groupUuid: Ref<string | undefined>,
  options?: MutationOptions,
) => {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (data: EventInDto) => {
      if (!groupUuid.value) throw new Error('Group UUID is required.');
      return eventsService.createEvent(groupUuid.value, data);
    },
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['events', groupUuid.value ?? null] });
      queryCache.invalidateQueries({ key: ['events-dates', groupUuid.value ?? null] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

export const useDeleteEventMutation = (
  groupUuid: Ref<string | undefined>,
  options?: MutationOptions,
) => {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (eventUuid: string) => {
      if (!groupUuid.value) throw new Error('Group UUID is required.');
      return eventsService.deleteEvent(groupUuid.value, eventUuid);
    },
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['events', groupUuid.value ?? null] });
      queryCache.invalidateQueries({ key: ['events-dates', groupUuid.value ?? null] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};
