import { Router } from 'express';
import authController from './auth.controller';
import { validateData } from '../../middlewares/validate.middleware';
import { loginSchema, registerSchema } from './auth.validation';

const router = Router();

router.post('/register', validateData(registerSchema), authController.registerUser);
router.post('/login', validateData(loginSchema), authController.loginUser);

export default router;
