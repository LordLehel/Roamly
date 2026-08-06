import { Request, Response } from "express";
import prisma from "../prisma";
import bcrypt from 'bcrypt'
import crypto from 'crypto'

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

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;

        const saltRounds = 10;

        const hashedPasswd = await bcrypt.hash(password, saltRounds);

        const generatedUuid = crypto.randomUUID();

        const newUser = await prisma.users.create({
            data: {
                uuid: generatedUuid,
                username,
                email,
                password: hashedPasswd,
            }
        });

        res.status(201).json({ status: 'success', message: `User created with username: ${username}!` });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error! There was a problem creating the new User!' })
    }
}