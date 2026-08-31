// frontend/app/services/eventsService.ts
import type { DayOutDto, EventOutDto, EventInDto } from '~/types/events.type';

export const eventsService = {
  // Dummy hálózat szimuláció
  async getDays(_groupUuid: string): Promise<DayOutDto[]> {
    return Promise.resolve([
      { id: '1', date: '12.10', dayOfWeek: 'Sat.' },
      { id: '2', date: '13.10', dayOfWeek: 'Sun.' },
      { id: '3', date: '14.10', dayOfWeek: 'Mon.' },
    ]);
  },

  async getEvents(_groupUuid: string, _dayId: string): Promise<EventOutDto[]> {
    return Promise.resolve([
      {
        id: '1',
        title: 'Morning Hike',
        isPrivate: false,
        timeStart: '08:00',
        timeEnd: '12:00',
        creator: { username: 'sir_real_99', avatar: null },
        description: 'Fun event xd xd',
        location: 'google.maps.coordinate',
      },
      {
        id: '2',
        title: 'Secret Meeting',
        isPrivate: true,
        timeStart: '14:00',
        timeEnd: '15:30',
        creator: { username: 'john_doe', avatar: null },
        description: 'Classified discussion.',
        location: 'google.maps.coordinate',
      },
    ]);
  },

  async addDay(_groupUuid: string, date: string): Promise<DayOutDto> {
    return Promise.resolve({ id: Math.random().toString(), date, dayOfWeek: 'New' });
  },

  async deleteDay(_dayId: string): Promise<void> {
    return Promise.resolve();
  },

  async addEvent(_groupUuid: string, eventData: EventInDto): Promise<EventOutDto> {
    return Promise.resolve({
      id: Math.random().toString(),
      ...eventData,
      creator: { username: 'me', avatar: null },
    });
  },

  async deleteEvent(_eventId: string): Promise<void> {
    return Promise.resolve();
  },
};
