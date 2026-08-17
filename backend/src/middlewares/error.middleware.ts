import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

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
  if (err instanceof Error) {
    switch (err.message) {
      // 400 bad request
      case 'INVALID_INVITATION_ROLE':
      case 'LEADERS_CAN_NOT_BE_REMOVED':
      case 'CANNOT_LEAVE_AS_ONLY_LEADER':
        res.status(400).json({
          status: 'error',
          message: err.message,
        });
        return;

      // 403 forbidden
      case 'USER_NOT_INVITED_OR_ALREADY_PART_OF_THE_GROUP':
      case 'NOT_A_LEADER_OF_THE_GROUP':
        res.status(403).json({
          status: 'error',
          message: err.message,
        });
        return;

      // 409 conflict
      case 'USER_ALREADY_IN_GROUP_OR_INVITED':
      case 'USER_ALREADY_JOINED_THE_GROUP':
        res.status(409).json({
          status: 'error',
          message: err.message,
        });
        return;
    }
  }

  console.error('Unhandled Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error!',
  });
};
