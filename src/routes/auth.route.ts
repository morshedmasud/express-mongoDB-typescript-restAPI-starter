// Controller
import {
  emailTokenVerify, renewToken,
  userLogin,
  userRegister
} from "@main/controllers/auth.controller";
// Middleware
import { isClientAuthenticated } from "@main/middleware/auth";
// Validation
import {
  loginValidation,
  registerValidation,
  renewValidation
} from "@main/validations/auth.validation";
import { Router } from "express";

const router = Router();

router.post("/register", isClientAuthenticated, registerValidation, userRegister);
router.post("/login", isClientAuthenticated, loginValidation, userLogin);
router.post("/renew-token", isClientAuthenticated, renewValidation, renewToken);
router.get("/email-verify/:token", emailTokenVerify);

export default router;
