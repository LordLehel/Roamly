import { Router } from 'express';
import groupsController from './groups.controller';
import { validateData } from '../../middlewares/validate.middleware';
import * as zodSchemas from './groups.validation';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

// all of the enpoints below need authentication
router.use(requireAuth);

router.post('/', validateData(zodSchemas.createGroupSchema), groupsController.createGroup);
router.get(
  '/',
  validateData(zodSchemas.listGroupsSchema, 'query'),
  groupsController.listAllGroupsTheUserIsPartOf,
);
router.post(
  '/:groupUuid/join',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  groupsController.joinAGroupByUuidIfUserIsInvited,
);
router.post(
  '/:groupUuid/invite',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  validateData(zodSchemas.inviteUsersToYourGroupBodySchema, 'body'),
  groupsController.inviteUsersToYourGroup,
);
router.get(
  '/invites',
  validateData(zodSchemas.listGroupsSchema, 'query'),
  groupsController.pendingInvites,
);
router.get(
  '/:groupUuid/preview',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  groupsController.joinGroupInfos,
);
router.get(
  '/:groupUuid',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  groupsController.listAllInfosOfOneGroup,
);
router.delete(
  '/:groupUuid',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  groupsController.deleteGroup,
);
router.patch(
  '/:groupUuid',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  validateData(zodSchemas.updatedGroupSchema, 'body'),
  groupsController.updateGroup,
);
router.delete(
  '/:groupUuid/users/:email',
  validateData(zodSchemas.removeUserFromGroupByEmailSchema, 'params'),
  groupsController.removeUserFromGroupByEmail,
);
router.delete(
  '/:groupUuid/leave',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  groupsController.userLeavingGroup,
);
router.patch(
  '/:groupUuid/promote',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  validateData(zodSchemas.targetUserEmailSchema, 'body'),
  groupsController.promoteUser,
);
router.patch(
  '/:groupUuid/demote',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  validateData(zodSchemas.targetUserEmailSchema, 'body'),
  groupsController.demoteUser,
);

export default router;
