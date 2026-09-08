import { Request, Response } from 'express';
import * as authService from './auth.service';
import { generateToken } from '../../utils/jwt.utils';
import { BaseController } from '../../utils/BaseController';
import { UnauthorizedError } from '../../utils/ServerError';

class AuthController extends BaseController {
  public registerUser = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const { username, email, password, phone_number } = req.body;

    await authService.registerUser(username, email, password, phone_number);

    res.status(200).json({
      status: 'success',
      message: 'Registration initiated! Verification code was sent to the user in email!',
    });
  });

  public resendVerificationEmail = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { email } = req.body;

      await authService.resendVerificationEmail(email);

      res.status(200).json({
        status: 'success',
        message: 'A new verification code has been sent to your email!',
      });
    },
  );

  public verifyEmailAndCreateUser = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { email, otp } = req.body;

      const newUser = await authService.verifyEmailAndCreateUser(email, otp);

      res.status(201).json({
        status: 'success',
        message: `Email verified successfully! User created with username: ${newUser.username}!`,
      });
    },
  );

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

  public requestForgottenPasswordReset = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { email } = req.body;

      await authService.requestForgottenPasswordReset(email);

      res.status(200).json({
        status: 'success',
        message: 'Password reset email has been sent!',
      });
    },
  );

  public resetForgottenPassword = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { email, otp, newPassword } = req.body;

      await authService.resetForgottenPassword(email, otp, newPassword);

      res.status(200).json({
        status: 'success',
        message: 'Password has been successfully reset!',
      });
    },
  );
}

export default new AuthController();
