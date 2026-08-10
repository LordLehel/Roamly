import { Request, Response } from 'express';
import * as userService from './users.service';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.uuid) {
      res.status(401).json({ message: 'Authorization needed!' });
      return;
    }

    const profile = await userService.getProfile(req.user.uuid);

    res.status(200).json({
      status: 'success',
      data: profile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error! There was an issue with the server during the listing of the asked user!',
    });
  }
};
