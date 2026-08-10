import { Router } from "express";
import * as groupsRoutes from './groups.controller';
import { validateData } from "../../middlewares/validate.middleware";
import { createGroupSchema } from './groups.validation';
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.post('/create', requireAuth, validateData(createGroupSchema), groupsRoutes.createGroup);
router.get('/all', requireAuth, groupsRoutes.listAllGroups);

export default router;