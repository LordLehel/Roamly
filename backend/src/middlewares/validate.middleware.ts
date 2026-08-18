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

    if (target === 'query') {
      // we are overwriting the Express built in getter with the data formatted by Zod
      Object.defineProperty(req, 'query', {
        value: validation.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } else {
      req[target] = validation.data;
    }

    next();
  };
};
