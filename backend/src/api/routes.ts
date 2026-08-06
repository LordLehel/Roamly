import { Router } from 'express';
import usersRoutes from './users/users.routes';
import authRoutes from './auth/auth.routes';

const rootRouter = Router();

rootRouter.use('/users', usersRoutes);
rootRouter.use('/auth', authRoutes);

export default rootRouter;
