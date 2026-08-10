import { Router } from 'express';
import * as usersRoutes from './users.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/profile', requireAuth, usersRoutes.getProfile);

export default router;
