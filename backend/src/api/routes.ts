import { Router } from 'express';
import usersRoutes from './users/users.routes';
import authRoutes from './auth/auth.routes';
import groupsRoutes from './groups/groups.routes';

const rootRouter = Router();

rootRouter.use('/users', usersRoutes);
rootRouter.use('/auth', authRoutes);
rootRouter.use('/groups', groupsRoutes);

export default rootRouter;
