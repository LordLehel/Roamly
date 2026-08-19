import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { ServerError } from '../utils/ServerError';
import { ZodError } from 'zod';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // if we already sent response to the client
  // we give it to the express default error handler
  if (res.headersSent) {
    return next(err);
  }

  // prisma record not found (P2025)
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
    res.status(404).json({
      status: 'error',
      message: 'The requested resource (user, group, profile, etc.) was not found!',
    });

    return;
  }

  // business logic errors
  if (err instanceof ServerError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });

    return;
  }

  // zod errors
  if (err instanceof ZodError) {
    type SimpleZodIssue = {
      path: (string | number)[];
      message: string;
    };

    const issues = err.issues as SimpleZodIssue[];

    res.status(400).json({
      status: 'error',
      message: 'Validation failed!',
      errors: issues.map((e: SimpleZodIssue) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });

    return;
  }

  console.error('Unhandled Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error!',
  });
};
