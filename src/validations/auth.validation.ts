import Joi from "joi";
import { validateRequest } from "../utils/validationError";

const register = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/^[\w]{6,30}$/)
      .required(),
  }),
};

const login = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/^[\w]{6,30}$/)
      .required(),
  }),
};

const registerValidation = validateRequest(register);
const loginValidation = validateRequest(login);
export { registerValidation, loginValidation };
