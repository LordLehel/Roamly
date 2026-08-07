export interface UserOutDto {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInDto {
  name?: string;
  email: string;
  password?: string;
}
