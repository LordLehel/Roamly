import { Request, Response } from 'express';
import * as authService from './auth.service';
import { generateToken } from '../../utils/jwt.utils';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const newUser = await authService.registerUser(username, email, password);

    res.status(201).json({
      status: 'success',
      message: `User created with username: ${newUser.username}!`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error! There was a problem creating the new User!',
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const validLogin = await authService.loginUser(email, password);

    if (validLogin) {
      const token = generateToken({ uuid: validLogin.uuid });

      res
        .status(200)
        .json({
          status: 'success',
          message: `Logged in succesfully as: ${validLogin.username}!`,
          token: token,
        });
    } else {
      res.status(500).json({ status: 'error', message: 'Incorrect email or password!' });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 'error', message: 'Error! There was an issue during the login process!' });
  }
};
