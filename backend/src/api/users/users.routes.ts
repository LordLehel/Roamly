import { Router } from 'express';
import * as usersRoutes from './users.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', requireAuth, usersRoutes.getAllUsers);
router.get('/profile', requireAuth, usersRoutes.getProfile);

export default router;
