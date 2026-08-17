import { Router } from 'express';
import usersController from './users.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validateData } from '../../middlewares/validate.middleware';
import * as zodSchemas from './users.validation';
import { uploadProfilePicture } from '../../middlewares/upload.middleware';

const router = Router();

router.use(requireAuth);

router.get('/me', usersController.getProfile);
router.patch(
  '/me',
  validateData(zodSchemas.updateProfileScheme, 'body'),
  usersController.updateProfile,
);
router.delete('/me', usersController.deleteProfile);
router.patch(
  '/me/password',
  validateData(zodSchemas.changePasswordScheme, 'body'),
  usersController.changePassword,
);
router.post(
  '/profile-picture',
  uploadProfilePicture.single('picture'),
  usersController.uploadProfilePicture,
);

export default router;
