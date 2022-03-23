import { NextFunction, Request, Response } from "express";
import { createValidator } from "express-joi-validation";
import httpStatus from "http-status";
import Joi from "joi";
import apiResponse from "../utils/response";

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

const registerValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const RegistrationSchema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
  });
  const RegistrationSchemaQuery = Joi.object({
    aggg: Joi.string().min(6).required(),
  });
  const { error } = RegistrationSchema.validate(req.body, {
    abortEarly: false,
  });

  const edf = RegistrationSchemaQuery.validate(req.query, {
    abortEarly: false,
  });
  //   const error = validator.body(RegistrationSchema);
  console.log(error.details);
  console.log("--- ", edf.details);

  if (error) {
    // const message = error && error.details && error.details.length ? error.details[0].message : "Something went wrong!";
    // const err = {};
    // await error.details.forEach(e => err[e.path[0]] = e.message.toString());

    return apiResponse(res, httpStatus.UNPROCESSABLE_ENTITY, {}, error);
  } else next();
};

export { registerValidation };
