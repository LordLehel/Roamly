import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserPayload } from '../types/express';

export interface CustomTokenPayload extends JwtPayload {
  uuid: string;
}

export const generateToken = (payload: { uuid: string }): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
    algorithm: 'HS256',
  });
};

export const verifyToken = (token: string): UserPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
};
