import { Request, Response, NextFunction, RequestHandler } from 'express';

export abstract class BaseController {
  protected handleAsync(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown,
  ): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}
