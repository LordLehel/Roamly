import jwt, { JwtPayload } from 'jsonwebtoken';

export interface CustomTokenPayload extends JwtPayload {
  uuid: string;
  // leader/member in a group
  role: 'leader' | 'member';
}

export const generateToken = (payload: { uuid: string }): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
    algorithm: 'HS256',
  });
};

export const verifyToken = (token: string): CustomTokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as CustomTokenPayload;
};
