import { Router } from 'express';
import * as usersRoutes from '../controllers/users.controller';

const router = Router();

router.get('/', usersRoutes.getAllUsers);
router.post('/register', usersRoutes.registerUser);
router.post('/login', usersRoutes.loginUser);

export default router;
