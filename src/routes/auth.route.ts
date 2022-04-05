import { Router } from "express";
// Controller
import { userLogin, userRegister } from "../controllers/auth.controller";
// Middleware
import { isClientAuthenticated } from "../middleware/auth";
// Validation
import { loginValidation, registerValidation } from "../validations/auth.validation";


const router = Router();

router.post("/api/auth/register", isClientAuthenticated, registerValidation, userRegister);
router.post("/api/auth/login", isClientAuthenticated, loginValidation, userLogin);

export default router;
