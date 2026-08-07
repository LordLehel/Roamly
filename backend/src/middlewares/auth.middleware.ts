import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";
import { JwtPayload } from "jsonwebtoken";

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            status: 'error',
            message: 'Unauthorized'
        });

        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded: JwtPayload = verifyToken(token);

        // we give the decoded token on the res.locals
        // it is always on the res object
        // this way we don't need to modify the req object
        res.locals.user = decoded;

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({
            status: 'error',
            message: 'Invalid or expired token'
        })
    }
}