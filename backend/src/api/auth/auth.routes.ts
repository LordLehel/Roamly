import { Router } from 'express';
import * as authRoutes from './auth.controller';

const router = Router();

router.post('/register', authRoutes.registerUser);
router.post('/login', authRoutes.loginUser);

export default router;