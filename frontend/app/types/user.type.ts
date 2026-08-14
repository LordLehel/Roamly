export interface UserOutDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInDto {
  name?: string;
  email: string;
  phone: string;
  password?: string;
}
