import { Request, Response } from "express";
import prisma from "../prisma";

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.users.findMany();

        res.status(200).json({
            status: 200,
            data: users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error! There was an issue with the server during the listing of the users!' });
    }
};