export const EVENT_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
} as const;

export type EventVisibility = (typeof EVENT_VISIBILITY)[keyof typeof EVENT_VISIBILITY];
