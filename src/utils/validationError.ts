import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";
import { pick } from "lodash";
import apiResponse from "./response";

type typeValidationError = {
  [key: string]: any;
};

const uniqueCheck = async (isUnique: any) => {
  let validationError: typeValidationError = {};
  Object.keys(isUnique).forEach((key) => {
    validationError[key] = `"${isUnique[key]}" is already been taken.`;
  });
  return validationError;
};

const modelValidationCheck = async (errors: any) => {
  let validationError: typeValidationError = {};
  errors &&
    Object.keys(errors).forEach((key) => {
      validationError[errors[key].path] = errors[key].message;
    });
  return validationError;
};

const validateRequest =
  (schema: object) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const validSchema = pick(schema, ["params", "query", "body"]);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: "key" } })
      .validate(object, { abortEarly: false });

    if (error) {
      const err: typeValidationError = {};
      error.details.forEach((e) => {
        err[e.path[1]] = e.message.toString();
      });
      return apiResponse(
        res,
        httpStatus.UNPROCESSABLE_ENTITY,
        { message: "Validation Error" },
        err
      );
    }

    Object.assign(req, value);
    return next();
  };

export { uniqueCheck, modelValidationCheck, validateRequest };
