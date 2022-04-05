import { Router } from "express";
// Controller
import { userLogin, userRegister } from "../controllers/auth.controller";
// Middleware
import { isClientAuthenticated } from "../middleware/auth";
// Validation
import { loginValidation, registerValidation } from "../validations/auth.validation";

const router = Router();

router.post("/register", isClientAuthenticated, registerValidation, userRegister);
router.post("/login", isClientAuthenticated, loginValidation, userLogin);

export default router;
