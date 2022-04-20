import { Request, Response } from "express";
import httpStatus from "http-status";
import { ObjectId } from "mongoose";
// Model
import { UserModel, UserStatus } from "@main/models/user.model";
// Utilities
import catchAsyncErr from "@main/utils/catchAsync";
import apiResponse from "@main/utils/response";
import { accessTokenDetailAndRefreshTokenDetail } from "@main/utils/tokens";
import { modelValidationCheck } from "@main/utils/validationError";

const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')

type userT = {
  _id: ObjectId;
  name: string;
  email: string;
};

type headerT = {
  alg: string;
  typ: string;
};

interface jwtI {
  header: headerT;
  payload: {
    user: userT;
    exp: number;
    iat: number;
  };
  signature: string;
}

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

const userLogin = catchAsyncErr(async (req: any, res: Response) => {
  const { email, password } = req.body;

  // Check User by Email
  const user = await UserModel.findOne({ email: email });
  if (!user)
    return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {
      message: "Invalid email or password",
    });

  // User Password Check
  const validPass = await user.comparePassword(password);
  if (!validPass)
    return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {
      message: "Password Not Matched.",
    });

  // Generate Tokens
  const tokens = await accessTokenDetailAndRefreshTokenDetail(
    { _id: user._id, name: user.name, email: user.email },
    req.client.secret
  );

  return apiResponse(res, httpStatus.OK, {
    data: { user, tokens },
  });
});

const renewToken = catchAsyncErr(async (req: any, res: Response) => {
  const { access, refresh } = req.body;

  const accessDetail: jwtI = jwt.decode(access, { complete: true });
  const refreshDetail: jwtI = jwt.decode(refresh, { complete: true });

  if (
    accessDetail &&
    accessDetail?.payload?.user &&
    refreshDetail &&
    refreshDetail?.payload?.user
  ) {
    // Checking Refresh Token Expired Date
    if (new Date(refreshDetail.payload.exp) < new Date())
      return apiResponse(res, httpStatus.UNAUTHORIZED, {
        message: "Session expired. Please login again.",
      });

    const user = await UserModel.findOne({
      _id: refreshDetail.payload.user._id,
    });
    if (!user)
      return apiResponse(res, httpStatus.BAD_REQUEST, {
        message: "something went wrong!",
      });

    // Generate Tokens
    const tokens = await accessTokenDetailAndRefreshTokenDetail(
      { _id: user._id, name: user.name, email: user.email },
      req.client.secret
    );

    return apiResponse(res, httpStatus.CREATED, {
      data: tokens,
      message: "Token Renewed.",
    });
  }

  return apiResponse(res, httpStatus.UNAUTHORIZED, {
    message: "Session expired. Please login again.",
  });
});

export { userRegister, userLogin, renewToken };
