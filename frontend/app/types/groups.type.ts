export interface GroupInDto {
    name: string;
    role: string;
}

export interface GroupOutDto {
  uuid: string;
  name: string;
  role: string;
  created_at: string;
  current_size: number;
}

export interface RawGroupDto {
  uuid: string;
  name: string;
  current_size: number;
  created_at: string;
  group_profiles?: {
    roles?: {
      type: string;
    };
  }[];
}