// frontend/app/queries/events.mutation.ts
import { useMutation, useQueryCache } from '@pinia/colada';
import { eventsService } from '~/services/eventsService';

interface MutationOptions {
  onSuccess?: () => void;
}

export const useAddDayMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  return useMutation({
    mutation: ({ groupUuid, date }: { groupUuid: string; date: string }) =>
      eventsService.addDay(groupUuid, date),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['events', 'days'] });
      options?.onSuccess?.();
    },
  });
};

export const useDeleteDayMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  return useMutation({
    mutation: (dayId: string) => eventsService.deleteDay(dayId),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['events', 'days'] });
      options?.onSuccess?.();
    },
  });
};

export const useDeleteEventMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  return useMutation({
    mutation: (eventId: string) => eventsService.deleteEvent(eventId),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['events', 'list'] });
      options?.onSuccess?.();
    },
  });
};
