// frontend/app/utils/sort.utils.ts
import type { EventOutDto, UiDay, UiEvent } from '~/types/events.type';

export const processAvailableDates = (dates: string[]): UiDay[] => {
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const processed = dates
    .map((dateStr) => {
      const dateObj = new Date(dateStr);
      const isExpired = dateObj < todayMidnight;
      const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' }) + '.';
      const formattedDate = `${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(
        dateObj.getDate(),
      ).padStart(2, '0')}`;

      return { id: dateStr, date: formattedDate, dayOfWeek, dateObj, isExpired };
    })
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  return [
    { id: 'ALL', date: 'All Events', dayOfWeek: 'All', dateObj: new Date(0), isExpired: false },
    ...processed,
  ];
};

export const processAndSortEvents = (events: EventOutDto[]): UiEvent[] => {
  const now = new Date();

  return events
    .map((ev) => {
      const startTime = new Date(ev.start_time);
      const endTime = new Date(ev.end_time);

      const isExpired = endTime < now;
      const timeStartFormatted = startTime.toLocaleTimeString('hu-HU', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const timeEndFormatted = endTime.toLocaleTimeString('hu-HU', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const is_private = ev.visibility === 'private';

      return { ...ev, isExpired, is_private, timeStartFormatted, timeEndFormatted };
    })
    .sort((a, b) => {
      if (a.isExpired !== b.isExpired) {
        return a.isExpired ? 1 : -1;
      }

      return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    });
};
