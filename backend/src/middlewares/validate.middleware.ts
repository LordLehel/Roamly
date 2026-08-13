import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validateData = (schema: z.ZodType, target: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // we are validating by the target given
    const validation = schema.safeParse(req[target]);

    if (!validation.success) {
      res.status(400).json({
        status: 'error',
        message: validation.error.flatten().fieldErrors,
      });

      return;
    }

    req[target] = validation.data;
    next();
  };
};
