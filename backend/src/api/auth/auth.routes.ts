import { Router } from 'express';
import * as authRoutes from './auth.controller';
import { validateData } from '../../middlewares/validate.middleware';
import { loginSchema, registerSchema } from './auth.validation';

const router = Router();

router.post('/register', validateData(registerSchema), authRoutes.registerUser);
router.post('/login', validateData(loginSchema), authRoutes.loginUser);

export default router;
