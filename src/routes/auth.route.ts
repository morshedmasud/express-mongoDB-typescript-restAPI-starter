import { Router } from "express";
// Controller
import { userLogin, userRegister, renewToken } from "../controllers/auth.controller";
// Middleware
import { isClientAuthenticated } from "../middleware/auth";
// Validation
import { loginValidation, registerValidation, renewValidation } from "../validations/auth.validation";

const router = Router();

router.post("/register", isClientAuthenticated, registerValidation, userRegister);
router.post("/login", isClientAuthenticated, loginValidation, userLogin);
router.post("/renew-token", isClientAuthenticated, renewValidation, renewToken);

export default router;
