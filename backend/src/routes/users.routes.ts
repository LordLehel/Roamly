import { Router } from "express";
import * as usersRoutes from "../controllers/users.controller";

const router = Router();

// the / will get the rout from the server.ts
router.get('/', usersRoutes.getAllUsers);

router.post('/register', usersRoutes.registerUser);



export default router;