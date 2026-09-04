// frontend/app/utils/sort.utils.ts
import type { EventOutDto, UiDay, UiEvent } from '~/types/events.type';

export const processAvailableDates = (dates: string[]): UiDay[] => {
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return dates
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
};

export const processAndSortEvents = (events: EventOutDto[], selectedDay?: UiDay): UiEvent[] => {
  if (!selectedDay) return [];

  const now = new Date();
  // const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return events
    .filter((ev) => {
      // Csak a kiválasztott naphoz tartozó eseményeket tartjuk meg
      const evDate = new Date(ev.start_time);
      const evMidnight = new Date(evDate.getFullYear(), evDate.getMonth(), evDate.getDate());
      return evMidnight.getTime() === selectedDay.dateObj.getTime();
    })
    .map((ev) => {
      const startTime = new Date(ev.start_time);
      const endTime = new Date(ev.end_time);

      // Kiszámoljuk a lejárati státuszt és formázzuk az időpontokat
      const isExpired = selectedDay.isExpired || endTime < now;
      const timeStartFormatted = startTime.toLocaleTimeString('hu-HU', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const timeEndFormatted = endTime.toLocaleTimeString('hu-HU', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return { ...ev, isExpired, timeStartFormatted, timeEndFormatted };
    })
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
};
