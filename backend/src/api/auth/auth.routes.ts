import { Router } from 'express';
import authController from './auth.controller';
import { validateData } from '../../middlewares/validate.middleware';
import * as zodSchemas from './auth.validation';
import { otpLimiter } from '../../middlewares/rateLimiter.middleware';

const router = Router();

router.post(
  '/register',
  validateData(zodSchemas.registerSchema, 'body'),
  authController.registerUser,
);
router.post(
  '/resend-verification',
  otpLimiter,
  validateData(zodSchemas.emailBodySchema, 'body'),
  authController.resendVerificationEmail,
);
router.post(
  '/verify-email',
  otpLimiter,
  validateData(zodSchemas.emailBodySchema.extend(zodSchemas.otpBodySchema.shape), 'body'),
  authController.verifyEmailAndCreateUser,
);

router.post('/login', validateData(zodSchemas.loginSchema, 'body'), authController.loginUser);

router.post(
  '/forgot-password',
  otpLimiter,
  validateData(zodSchemas.emailBodySchema, 'body'),
  authController.requestForgottenPasswordReset,
);
router.post(
  '/reset-password',
  otpLimiter,
  validateData(zodSchemas.emailPasswordBodySchema.extend(zodSchemas.otpBodySchema.shape), 'body'),
  authController.resetForgottenPassword,
);

export default router;
