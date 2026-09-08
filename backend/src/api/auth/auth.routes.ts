import { Router } from 'express';
import authController from './auth.controller';
import { validateData } from '../../middlewares/validate.middleware';
import * as zodSchemas from './auth.validation';

const router = Router();

router.post(
  '/register',
  validateData(zodSchemas.registerSchema, 'body'),
  authController.registerUser,
);
router.post(
  '/resend-verification',
  validateData(zodSchemas.emailBodySchema, 'body'),
  authController.resendVerificationEmail,
);
router.post(
  '/verify-email',
  validateData(zodSchemas.emailBodySchema.extend(zodSchemas.otpBodySchema.shape), 'body'),
  authController.verifyEmailAndCreateUser,
);

router.post('/login', validateData(zodSchemas.loginSchema, 'body'), authController.loginUser);

router.post(
  '/forgot-password',
  validateData(zodSchemas.emailBodySchema, 'body'),
  authController.requestForgottenPasswordReset,
);
router.post(
  '/reset-password',
  validateData(zodSchemas.emailPasswordBodySchema.extend(zodSchemas.otpBodySchema.shape), 'body'),
  authController.resetForgottenPassword,
);

export default router;
