// frontend/app/types/events.type.ts

/* --- RAW BACKEND TYPES --- */
export interface RawEventParticipant {
  users: {
    uuid: string;
    username: string;
    email: string;
    profile_image_url?: string | null;
  };
}

export interface RawEventDto {
  uuid: string;
  title: string;
  visibility?: { name: string };
  start_time: string;
  end_time: string;
  description: string | null;
  creator: {
    uuid: string;
    username: string;
    email: string;
    profile_image_url?: string | null;
  };
  event_participants?: RawEventParticipant[];
}

export interface EventCreatorDto {
  uuid: string;
  username: string;
  email: string;
  profile_image_url?: string | null;
}

export interface EventOutDto {
  uuid: string;
  title: string;
  visibility: string; // 'public' or 'private'
  start_time: string;
  end_time: string;
  description: string | null;
  creator: EventCreatorDto;
  members: EventCreatorDto[];
}

export interface EventInDto {
  title: string;
  visibility: string; // 'public' or 'private'
  start_time: string;
  end_time?: string;
  description?: string;
  participant_emails?: string[];
}

export interface EventsResponseDto {
  events: EventOutDto[];
  available_dates: string[];
}

export interface UiDay {
  id: string;
  date: string;
  dayOfWeek: string;
  dateObj: Date;
  isExpired: boolean;
}

export type UiEvent = EventOutDto & {
  isExpired: boolean;
  is_private: boolean; // UI flag to determine if the event is private
  timeStartFormatted: string;
  timeEndFormatted: string;
};
