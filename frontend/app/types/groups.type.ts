// frontend/app/types/groups.type.ts
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

export interface GroupProfileDto {
  users: {
    email: string;
    username: string;
    profile_image_url?: string | null;
  };
  roles: {
    type: string;
  };
  nickname: string | null;
  description: string | null;
}

export interface GroupInfosOutDto {
  name: string;
  current_size: number;
  created_at: string;
  group_profiles: GroupProfileDto[];
}

export interface RawGroupInvitesDto {
  uuid: string;
  name: string;
  current_size: number;
  created_at: string;
  group_profiles?: {
    users?: {
      username: string;
      email: string;
      profile_image_url?: string | null;
    };
    roles?: {
      type: string;
    };
  }[];
}

export interface GroupInvitesOutDto {
  uuid: string;
  name: string;
  leaders: string[];
  created_at: string;
  current_size: number;
}
