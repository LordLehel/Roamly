import { Request, Response } from 'express';
import * as authService from './auth.service';
import { generateToken } from '../../utils/jwt.utils';
import { BaseController } from '../../utils/BaseController';
import { UnauthorizedError } from '../../utils/ServerError';

class AuthController extends BaseController {
  public registerUser = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const { username, email, password, phone_number } = req.body;

    const newUser = await authService.registerUser(username, email, password, phone_number);

    res.status(201).json({
      status: 'success',
      message: `User created with username: ${newUser.username}!`,
    });
  });

  public loginUser = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const validLogin = await authService.loginUser(email, password);

    if (validLogin) {
      const token = generateToken({ uuid: validLogin.uuid });

      res.status(200).json({
        status: 'success',
        message: `Logged in succesfully as: ${validLogin.username}!`,
        token: token,
      });
    } else {
      throw new UnauthorizedError('Incorrect email or password!');
    }
  });
}

export default new AuthController();
