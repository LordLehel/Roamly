import { Request, Response } from 'express';
import * as authService from './auth.service';
import * as validationSchemas from './auth.validation';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = validationSchemas.registerSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        status: 'error',
        errors: validation.error.flatten().fieldErrors,
      });

      return;
    }

    const { username, email, password } = validation.data;

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
    const validation = validationSchemas.loginSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid email or password!',
      });

      return;
    }

    const { email, password } = validation.data;

    const validLogin = await authService.loginUser(email, password);

    if (validLogin) {
      res.status(200).json({ status: 'success', message: `Logged in succesfully as: ${validLogin.username}!` });
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
