import { Router } from "express";
// Controller
import { userRegister } from "../controllers/auth.controller";
// Validation
import { registerValidation } from "../validations/auth.validation";

const router = Router();

router.post("/api/auth/register", registerValidation, userRegister);

export default router;
