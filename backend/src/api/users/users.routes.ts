import { Router } from 'express';
import * as usersRoutes from './users.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validateData } from '../../middlewares/validate.middleware';
import * as zodSchemas from './users.validation';

const router = Router();

router.use(requireAuth)

router.get('/me', usersRoutes.getProfile);
router.patch(
  '/me',
  validateData(zodSchemas.updateProfileScheme, 'body'),
  usersRoutes.updateProfile,
);
router.delete('/me', usersRoutes.deleteProfile);
router.patch(
  '/me/password',
  validateData(zodSchemas.changePasswordScheme, 'body'),
  usersRoutes.changePassword,
);

export default router;
