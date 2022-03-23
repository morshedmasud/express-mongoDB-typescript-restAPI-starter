import { Router } from "express";
import {
  // Creates a validator that generates middlewares
  createValidator,
} from "express-joi-validation";
import * as Joi from "joi";
// Controller
import { userRegister } from "../controllers/auth.controller";
// Validation
import { registerValidation } from "../validations/auth.validation";

const router = Router();

const validator = createValidator();

const querySchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  p: Joi.string().required(),
});

const register: any = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().length(11).required(),
    gender: Joi.string().required(),
    password: Joi.string()
      .regex(/^[\w]{6,30}$/)
      .required(),
  }),
};

router.post("/api/auth/register", registerValidation, userRegister);

export default router;
