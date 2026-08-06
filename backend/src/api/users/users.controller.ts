import { Request, Response } from 'express';
import * as userService from './users.service';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      status: 200,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error! There was an issue with the server during the listing of the users!',
    });
  }
};