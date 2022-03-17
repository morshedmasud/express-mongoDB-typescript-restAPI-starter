import { Request, Response } from "express";

const mongoose = require("mongoose");
const httpStatus = require("http-status");

const { catchAsyncErr } = require("../utils/catchAsync");
const response = require("../utils/response");

// Model
const { UserStatus, UserModel } = require("../models/user.model");

const register = catchAsyncErr(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Check if User already in database
  // const existUser = await UserModel.findOne({email: email})
  // if (existUser) return response(res, httpStatus.NOT_ACCEPTABLE, {message: "Email already exist."})

  // // Hash Password
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);

  // // Create User
  // const newUser = new UserModel({
  // 	name: name,
  // 	email: email,
  // 	password: hashedPassword,
  //     status: UserStatus.active
  // });

  // // Validate Mongo Model with Data
  // const err = newUser.validateSync();
  // if (err instanceof mongoose.Error) {
  //     console.log(err);
  //     return response(res, httpStatus.NOT_ACCEPTABLE, {}, err)
  // }
  // const save = await newUser.save();

  return response(res, httpStatus.CREATED, { data: "save" });
});

module.exports = {
  userRegister: register,
};
