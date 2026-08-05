import { Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.users.findMany();

    res.status(200).json({
      status: 200,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        status: 'error',
        message: 'Error! There was an issue with the server during the listing of the users!',
      });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(404).json({ status: 'error', message: 'Error! User not found!' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ status: 'error', message: 'Error! Invalid credentials!' });
      return;
    }

    res
      .status(200)
      .json({ status: 'success', message: `${user.username} logged in successfully!` });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        status: 'error',
        message: 'Error! There was an issue with the server during the login process!',
      });
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
      },
    });

    res
      .status(201)
      .json({ status: 'success', message: `User created with username: ${newUser.username}!` });
  } catch (error) {
    res
      .status(500)
      .json({
        status: 'error',
        message: `Error! There was a problem creating the new User: ${error}`,
      });
  }
};
