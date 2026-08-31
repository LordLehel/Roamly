// frontend/app/types/events.type.ts

export interface DayOutDto {
  id: string;
  date: string;
  dayOfWeek: string;
}

export interface DayInDto {
  date: string;
}

export interface EventCreatorDto {
  username: string;
  avatar: string | null;
}

export interface EventOutDto {
  id: string;
  title: string;
  isPrivate: boolean;
  timeStart: string;
  timeEnd: string;
  creator: EventCreatorDto;
  description: string;
  location: string;
}

export interface EventInDto {
  title: string;
  isPrivate: boolean;
  timeStart: string;
  timeEnd: string;
  description: string;
  location: string;
}
