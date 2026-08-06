import { Router } from 'express';
import * as usersRoutes from './users.controller';

const router = Router();

router.get('/', usersRoutes.getAllUsers);
// nem ide kell
// router.post('/register', usersRoutes.registerUser);
// router.post('/login', usersRoutes.loginUser);

export default router;
