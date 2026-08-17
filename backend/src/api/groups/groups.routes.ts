import { Router } from 'express';
import * as groupsRoutes from './groups.controller';
import { validateData } from '../../middlewares/validate.middleware';
import * as zodSchemas from './groups.validation';
import { requireAuth } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../middlewares/asyncHandler';

const router = Router();

// all of the enpoints below need authentication
router.use(requireAuth);

router.post(
  '/',
  validateData(zodSchemas.createGroupSchema),
  asyncHandler(groupsRoutes.createGroup),
);
router.get(
  '/',
  validateData(zodSchemas.listGroupsSchema, 'query'),
  asyncHandler(groupsRoutes.listAllGroupsTheUserIsPartOf),
);
router.post(
  '/:groupUuid/join',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  asyncHandler(groupsRoutes.joinAGroupByUuidIfUserIsInvited),
);
router.post(
  '/:groupUuid/invite',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  validateData(zodSchemas.inviteUsersToYourGroupBodySchema, 'body'),
  asyncHandler(groupsRoutes.inviteUsersToYourGroup),
);
router.get(
  '/invites',
  validateData(zodSchemas.listGroupsSchema, 'query'),
  asyncHandler(groupsRoutes.pendingInvites),
);
router.get(
  '/:groupUuid/preview',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  asyncHandler(groupsRoutes.joinGroupInfos),
);
router.get(
  '/:groupUuid',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  asyncHandler(groupsRoutes.listAllInfosOfOneGroup),
);
router.delete(
  '/:groupUuid',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  asyncHandler(groupsRoutes.deleteGroup),
);
router.patch(
  '/:groupUuid',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  validateData(zodSchemas.updatedGroupSchema, 'body'),
  asyncHandler(groupsRoutes.updateGroup),
);
router.delete(
  '/:groupUuid/users/:email',
  validateData(zodSchemas.removeUserFromGroupByEmailSchema, 'params'),
  asyncHandler(groupsRoutes.removeUserFromGroupByEmail),
);
router.delete(
  '/:groupUuid/leave',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  asyncHandler(groupsRoutes.userLeavingGroup),
);

export default router;
