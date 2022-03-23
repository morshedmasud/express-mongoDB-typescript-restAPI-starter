import { Request, Response } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";
// Model
import { UserModel, UserStatus } from "../models/user.model";
// Utilities
import catchAsyncErr from "../utils/catchAsync";
import apiResponse from "../utils/response";
import { modelValidationCheck } from "../utils/validationError";

const userRegister = catchAsyncErr(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Check if User already in database
  const existUser = await UserModel.findOne({ email: email });
  if (existUser)
    return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {
      message: "Email already exist.",
    });

  // Create User
  const newUser = new UserModel({
    name: name,
    email: email,
    password: password,
    status: UserStatus.active,
  });

  // Validate Mongo Model with Data
  const err = newUser.validateSync();
  if (err instanceof mongoose.Error) {
    const valid = await modelValidationCheck(err?.errors);
    return apiResponse(
      res,
      httpStatus.NOT_ACCEPTABLE,
      { message: "Validation Required" },
      valid
    );
  }
  const save = await newUser.save();

  return apiResponse(res, httpStatus.CREATED, { data: save });
});

export { userRegister };
