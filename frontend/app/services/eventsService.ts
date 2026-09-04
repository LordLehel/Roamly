// frontend/app/services/events.service.ts
import type { EventInDto, EventOutDto, RawEventDto } from '~/types/events.type';
import type { ApiResponse } from '~/types/api.type';

/* --- MAPPER (UTILS) --- */
const mapRawEventToDto = (raw: RawEventDto): EventOutDto => ({
  uuid: raw.uuid,
  title: raw.title,
  visibility: raw.visibility?.name || 'public',
  start_time: raw.start_time,
  end_time: raw.end_time,
  description: raw.description,
  creator: raw.creator,
  members: raw.event_participants?.map((ep) => ep.users) || [],
});

/* --- SERVICE --- */
export const eventsService = {
  async getAvailableDates(groupUuid: string): Promise<string[]> {
    const api = useApi();
    const res = await api<ApiResponse<string[]>>(`/events/${groupUuid}/dates`);
    return res.data || [];
  },

  async getEvents(groupUuid: string, startDate?: string, endDate?: string): Promise<EventOutDto[]> {
    const query = new URLSearchParams();
    if (startDate) query.append('start_date', startDate);
    if (endDate) query.append('end_date', endDate);

    const qStr = query.toString();
    const queryPart = qStr ? `?${qStr}` : '';

    const api = useApi();
    const res = await api<ApiResponse<RawEventDto[]>>(`/events/${groupUuid}${queryPart}`);

    return (res.data || []).map(mapRawEventToDto);
  },

  async createEvent(groupUuid: string, payload: EventInDto): Promise<void> {
    const api = useApi();
    return await api(`/events/${groupUuid}`, {
      method: 'POST',
      body: payload,
    });
  },

  async deleteEvent(groupUuid: string, eventUuid: string): Promise<void> {
    const api = useApi();
    return await api(`/events/${groupUuid}/${eventUuid}`, {
      method: 'DELETE',
    });
  },
};
