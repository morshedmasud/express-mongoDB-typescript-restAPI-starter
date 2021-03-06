import Joi from "joi";
import { validateRequest } from "@main/utils/validationError";

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

const renew = {
  body: Joi.object({
    access: Joi.string().required(),
    refresh: Joi.string().required()
  }),
};

const registerValidation = validateRequest(register);
const loginValidation = validateRequest(login);
const renewValidation = validateRequest(renew);
export { registerValidation, loginValidation, renewValidation };
