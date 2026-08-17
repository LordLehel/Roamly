import { Router } from 'express';
import * as usersRoutes from './users.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validateData } from '../../middlewares/validate.middleware';
import * as zodSchemas from './users.validation';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { uploadProfilePicture } from '../../middlewares/upload.middleware';

const router = Router();

router.use(requireAuth);

router.get('/me', asyncHandler(usersRoutes.getProfile));
router.patch(
  '/me',
  validateData(zodSchemas.updateProfileScheme, 'body'),
  asyncHandler(usersRoutes.updateProfile),
);
router.delete('/me', asyncHandler(usersRoutes.deleteProfile));
router.patch(
  '/me/password',
  validateData(zodSchemas.changePasswordScheme, 'body'),
  asyncHandler(usersRoutes.changePassword),
);
router.post(
  '/profile-picture',
  uploadProfilePicture.single('picture'),
  asyncHandler(usersRoutes.uploadProfilePicture),
);

export default router;
