import { Router } from 'express';
import * as groupsRoutes from './groups.controller';
import { validateData } from '../../middlewares/validate.middleware';
import * as zodSchemas from './groups.validation';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', requireAuth, validateData(zodSchemas.createGroupSchema), groupsRoutes.createGroup);
router.get(
  '/',
  requireAuth,
  validateData(zodSchemas.listGroupsSchema, 'query'),
  groupsRoutes.listAllGroupsTheUserIsPartOf,
);
router.post(
  '/:groupUuid/join',
  requireAuth,
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  groupsRoutes.joinAGroupByUuidIfUserIsInvited,
);
router.post(
  '/:groupUuid/invite',
  requireAuth,
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  validateData(zodSchemas.inviteUsersToYourGroupBodySchema, 'body'),
  groupsRoutes.inviteUsersToYourGroup,
);
router.get(
  '/invites',
  requireAuth,
  validateData(zodSchemas.listGroupsSchema, 'query'),
  groupsRoutes.pendingInvites,
);
router.get(
  '/:groupUuid/preview',
  requireAuth,
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  groupsRoutes.joinGroupInfos,
);
router.get(
  '/:groupUuid',
  requireAuth,
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  groupsRoutes.listAllInfosOfOneGroup,
);
router.delete(
  '/:groupUuid',
  requireAuth,
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  groupsRoutes.deleteGroup,
);
router.patch(
  '/:groupUuid',
  requireAuth,
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  validateData(zodSchemas.updatedGroupSchema, 'body'),
  groupsRoutes.updateGroup,
);
router.delete(
  '/:groupUuid/users/:email',
  requireAuth,
  validateData(zodSchemas.removeUserFromGroupByEmailSchema, 'params'),
  groupsRoutes.removeUserFromGroupByEmail,
);
router.delete(
  '/:groupUuid/leave',
  requireAuth,
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  groupsRoutes.userLeavingGroup,
);

export default router;
