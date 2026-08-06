import prisma from '../../prisma';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { users } from '@prisma/client';

export const registerUser = async (username: string, email: string, password:string): Promise<users> => {
    const saltRounds = 10;

    const hashedPasswd = await bcrypt.hash(password, saltRounds);

    const generatedUuid = crypto.randomUUID();

    const newUser = await prisma.users.create({
        data: {
            uuid: generatedUuid,
            username,
            email,
            password: hashedPasswd,
        },
    });

    return newUser;
}

export const loginUser = async (email: string, password: string): Promise<boolean> => {
    const user = await prisma.users.findUnique({
        where: {
            email: email,
        }
    });

    if (!user) {
        return false;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    return isMatch;
}