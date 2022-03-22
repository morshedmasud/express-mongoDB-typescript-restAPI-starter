import { Request, Response } from "express";

const mongoose = require("mongoose");
const httpStatus = require("http-status");

const catchAsyncErr = require("../utils/catchAsync");
const response = require("../utils/response");
const validationError = require("../utils/validationError");

// Model
const { UserStatus, UserModel } = require("../models/user.model");

const register = catchAsyncErr(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Check if User already in database
  const existUser = await UserModel.findOne({ email: email });
  if (existUser)
    return response(res, httpStatus.NOT_ACCEPTABLE, {
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
    console.log(err);
    const valid = await validationError.requiredCheck(err.errors);
    return response(res, httpStatus.NOT_ACCEPTABLE, {}, err);
  }
  const save = await newUser.save();

  return response(res, httpStatus.CREATED, { data: save });
});

module.exports = {
  userRegister: register,
};
