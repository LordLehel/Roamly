// frontend/app/types/user.type.ts
export interface UserOutDto {
  username: string;
  email: string;
  phone_number: string;
  created_at: string | Date;
  updated_at: string | Date;
  profile_image_url?: string | null;
}

export interface UserInDto {
  username?: string;
  email: string;
  phone_number: string;
  password?: string;
}
