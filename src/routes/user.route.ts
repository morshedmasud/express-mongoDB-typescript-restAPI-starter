import { Router } from "express";
// Controller
import { userInfo } from "../controllers/user.controller";
// Middleware
import { isUserAuthenticated } from "../middleware/auth";
// Validation

const router = Router();

router.get("/info", isUserAuthenticated, userInfo);

export default router;
