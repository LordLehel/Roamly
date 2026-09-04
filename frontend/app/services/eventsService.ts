// frontend/app/services/events.service.ts
import type { EventInDto, EventsResponseDto } from '~/types/events.type';

export const eventsService = {
  async getEvents(
    groupUuid: string,
    startDate?: string,
    endDate?: string,
  ): Promise<EventsResponseDto> {
    const query = new URLSearchParams();
    if (startDate) query.append('start_date', startDate);
    if (endDate) query.append('end_date', endDate);

    return await $fetch<EventsResponseDto>(`/api/groups/${groupUuid}/events?${query.toString()}`);
  },

  async createEvent(groupUuid: string, payload: EventInDto): Promise<void> {
    return await $fetch(`/api/groups/${groupUuid}/events`, {
      method: 'POST',
      body: payload,
    });
  },

  async deleteEvent(eventUuid: string): Promise<void> {
    return await $fetch(`/api/events/${eventUuid}`, {
      method: 'DELETE',
    });
  },
};
