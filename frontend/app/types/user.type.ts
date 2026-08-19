export interface UserOutDto {
  id: string;
  username: string;
  email: string;
  phone_number: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInDto {
  username?: string;
  email: string;
  phone_number: string;
  password?: string;
}
