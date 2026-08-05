import { Router } from "express";
import { getAllUsers } from "../controllers/users.controller";

const router = Router();

// the / will get the rout from the server.ts
router.get('/', getAllUsers);

export default router;