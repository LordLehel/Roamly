import { Router } from 'express';
import * as groupsRoutes from './groups.controller';
import { validateData } from '../../middlewares/validate.middleware';
import { createGroupSchema } from './groups.validation';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/create', requireAuth, validateData(createGroupSchema), groupsRoutes.createGroup);
router.get('/all', requireAuth, groupsRoutes.listAllGroupsTheUserIsPartOf);
router.post('/:groupUuid/join', requireAuth, groupsRoutes.joinAGroupByUuidIfUserIsInvited);
router.post('/:groupUuid/invite', requireAuth, groupsRoutes.inviteUsersToYourGroup);
router.get('/invites', requireAuth, groupsRoutes.pendingInvites);
router.get('/:groupUuid/join/infos/', requireAuth, groupsRoutes.joinGroupInfos);
router.get('/:groupUuid/infos', requireAuth, groupsRoutes.listAllInfosOfOneGroup);
router.delete('/:groupUuid', requireAuth, groupsRoutes.deleteGroup);
router.patch('/:groupUuid', requireAuth, groupsRoutes.updateGroup);

// adot user torlese a group-bol
// zod-os validacio mindenhova
// zod error-ok lekezelese
// tobbi error rendes lekezelese

export default router;
