import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      status: 'error',
      message: 'Unauthorized',
    });

    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);

    // module augmentation in types/express.d.ts

    res.locals.user = decoded;

    // req.user = decoded;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
    });
  }
};
