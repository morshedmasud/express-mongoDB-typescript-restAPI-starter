import { Router } from "express";
// Controller
import { userRegister } from "../controllers/auth.controller";

const router = Router();

router.post("/api/auth/register", userRegister);

export default router;
