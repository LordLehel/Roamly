import { Router } from 'express';
import * as groupsRoutes from './groups.controller';
import { validateData } from '../../middlewares/validate.middleware';
import * as zodSchemas from './groups.validation';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

// all of the enpoints below need authentication
router.use(requireAuth);

router.post('/', validateData(zodSchemas.createGroupSchema), groupsRoutes.createGroup);
router.get(
  '/',
  validateData(zodSchemas.listGroupsSchema, 'query'),
  groupsRoutes.listAllGroupsTheUserIsPartOf,
);
router.post(
  '/:groupUuid/join',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  groupsRoutes.joinAGroupByUuidIfUserIsInvited,
);
router.post(
  '/:groupUuid/invite',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  validateData(zodSchemas.inviteUsersToYourGroupBodySchema, 'body'),
  groupsRoutes.inviteUsersToYourGroup,
);
router.get(
  '/invites',
  validateData(zodSchemas.listGroupsSchema, 'query'),
  groupsRoutes.pendingInvites,
);
router.get(
  '/:groupUuid/preview',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  groupsRoutes.joinGroupInfos,
);
router.get(
  '/:groupUuid',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  groupsRoutes.listAllInfosOfOneGroup,
);
router.delete(
  '/:groupUuid',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  groupsRoutes.deleteGroup,
);
router.patch(
  '/:groupUuid',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  validateData(zodSchemas.updatedGroupSchema, 'body'),
  groupsRoutes.updateGroup,
);
router.delete(
  '/:groupUuid/users/:email',
  validateData(zodSchemas.removeUserFromGroupByEmailSchema, 'params'),
  groupsRoutes.removeUserFromGroupByEmail,
);
router.delete(
  '/:groupUuid/leave',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  groupsRoutes.userLeavingGroup,
);

export default router;
