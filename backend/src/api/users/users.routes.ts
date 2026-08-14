import { Router } from 'express';
import * as usersRoutes from './users.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validateData } from '../../middlewares/validate.middleware';
import * as zodSchemas from './users.validation';

const router = Router();

router.get('/me', requireAuth, usersRoutes.getProfile);
router.patch(
  '/me',
  requireAuth,
  validateData(zodSchemas.updateProfileScheme, 'body'),
  usersRoutes.updateProfile,
);
router.delete('/me', requireAuth, usersRoutes.deleteProfile);
router.patch(
  '/me/password',
  requireAuth,
  validateData(zodSchemas.changePasswordScheme, 'body'),
  usersRoutes.changePassword,
);

export default router;
