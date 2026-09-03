// frontend/utils/sort.utils.ts
import type { MockDay, MockEvent } from '~/utils/apiMock.utils';

export type ProcessedDay = MockDay & { dayDate: Date; isExpired: boolean };
export type ClientEvent = MockEvent & { isExpired?: boolean };

/**
 * Returns the current date and the midnight time for accurate comparison.
 */
export const getCurrentParsedDate = () => {
  const now = new Date();
  return {
    now,
    todayMidnight: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
  };
};

/**
 * Processes a list of days, determining if they are expired based on the current date,
 * and sorts them (active days first, then expired days).
 */
export const processAndSortDays = (daysList: MockDay[]): ProcessedDay[] => {
  const { todayMidnight } = getCurrentParsedDate();
  const currentYear = todayMidnight.getFullYear();

  const processed = daysList.map((day) => {
    const [month, dayOfMonth] = day.date.split('.').map(Number);
    const dayDate = new Date(currentYear, (month ?? 1) - 1, dayOfMonth ?? 1);
    const isExpired = dayDate < todayMidnight;

    return { ...day, dayDate, isExpired };
  });

  const active = processed
    .filter((d) => !d.isExpired)
    .sort((a, b) => a.dayDate.getTime() - b.dayDate.getTime());

  const expired = processed
    .filter((d) => d.isExpired)
    .sort((a, b) => a.dayDate.getTime() - b.dayDate.getTime());

  return [...active, ...expired];
};

/**
 * Processes a list of events for a specific day, determining their expiration status
 * based on the end time, and sorts them chronologically.
 */
export const processAndSortEvents = (
  eventsList: MockEvent[],
  dayDetails?: ProcessedDay,
): ClientEvent[] => {
  if (!dayDetails) return [];

  const { now } = getCurrentParsedDate();

  const processed = eventsList.map((event) => {
    let isExpired = dayDetails.isExpired;

    if (!isExpired) {
      const [endHours, endMinutes] = event.timeEnd.split(':').map(Number);
      const eventEndDate = new Date(dayDetails.dayDate);
      eventEndDate.setHours(endHours ?? 0, endMinutes ?? 0, 0, 0);

      if (eventEndDate < now) {
        isExpired = true;
      }
    }

    return { ...event, isExpired };
  });

  const active = processed
    .filter((e) => !e.isExpired)
    .sort((a, b) => a.timeStart.localeCompare(b.timeStart));

  const expired = processed
    .filter((e) => e.isExpired)
    .sort((a, b) => a.timeStart.localeCompare(b.timeStart));

  return [...active, ...expired];
};
