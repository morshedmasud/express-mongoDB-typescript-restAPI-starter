import { Router } from "express";
// Controller
import { userRegister } from "../controllers/auth.controller";
// Middleware
import { isClientAuthenticated } from "../middleware/auth";
// Validation
import { registerValidation } from "../validations/auth.validation";


const router = Router();

router.post("/api/auth/register", isClientAuthenticated, registerValidation, userRegister);

export default router;
