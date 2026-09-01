import { Router } from 'express';
import usersRoutes from './users/users.routes';
import authRoutes from './auth/auth.routes';
import groupsRoutes from './groups/groups.routes';
import filesRoutes from './files/files.routes';

const rootRouter = Router();

rootRouter.use('/users', usersRoutes);
rootRouter.use('/auth', authRoutes);
rootRouter.use('/groups', groupsRoutes);
rootRouter.use('/files', filesRoutes);

export default rootRouter;
