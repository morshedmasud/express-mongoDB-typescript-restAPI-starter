import { Router } from "express";
// Controller
import { userInfo } from "@main/controllers/user.controller";
// Middleware
import { isUserAuthenticated } from "@main/middleware/auth";
// Validation

const router = Router();

router.get("/info", isUserAuthenticated, userInfo);

export default router;
