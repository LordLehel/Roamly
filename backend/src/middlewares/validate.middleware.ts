import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validateData = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) : void => {
        const validation = schema.safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({
                status: 'error',
                message: validation.error.flatten().fieldErrors,
            });

            return;
        }

        req.body = validation.data;
        next();
    }
}