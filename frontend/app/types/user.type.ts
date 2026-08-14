export interface UserOutDto {
  id: string;
  username: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInDto {
  username?: string;
  email: string;
  phone: string;
  password?: string;
}
