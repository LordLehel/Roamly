// frontend/app/types/events.type.ts

export interface EventCreatorDto {
  uuid: string;
  username: string;
  profile_image_url: string | null;
}

export interface EventOutDto {
  uuid: string;
  title: string;
  is_private: boolean;
  start_time: string; // ISO 8601
  end_time: string; // ISO 8601
  description: string;
  location: string;
  creator: EventCreatorDto;
  members: EventCreatorDto[];
}

export interface EventInDto {
  title: string;
  is_private: boolean;
  start_time: string;
  end_time: string;
  description: string;
  location: string;
}

export interface EventsResponseDto {
  events: EventOutDto[];
  available_dates: string[]; // pl. ['2026-09-02', '2026-09-03']
}

// Kiterjesztett típusok a UI számára (hogy ne módosítsuk az eredeti DTO-t)
export interface UiDay {
  id: string; // Az eredeti backend string (YYYY-MM-DD)
  date: string; // Formázott dátum (MM.DD)
  dayOfWeek: string; // Hét napja
  dateObj: Date;
  isExpired: boolean;
}

export type UiEvent = EventOutDto & {
  isExpired: boolean;
  timeStartFormatted: string;
  timeEndFormatted: string;
};
