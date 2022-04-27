// Model
import { UserModel, UserStatus } from "@main/models/user.model";
// Utilities
import catchAsyncErr from "@main/utils/catchAsync";
import { Constants } from "@main/utils/constants";
import { sendMail } from "@main/utils/email";
import apiResponse from "@main/utils/response";
import { accessTokenDetailAndRefreshTokenDetail } from "@main/utils/tokens";
import { modelValidationCheck } from "@main/utils/validationError";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { ObjectId } from "mongoose";

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

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

  // Generate a verification token with the user's ID
  const verificationToken = await save.generateVerificationToken();

  const smsRes = await sendMail({
    to: newUser.email,
    subject: "Email Verification",
    body: `
    Hi ${newUser.name}, Click <a href = '${Constants.BASE_ENDPOINT}/auth/email-verify/${verificationToken}'>here</a> to verify your email.
    `,
  });

  return apiResponse(res, httpStatus.CREATED, {
    data: save,
    message:
      "Registration Completed, We've sent an email verification link to your email address.",
  });
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

const emailTokenVerify = catchAsyncErr(async (req: any, res: Response) => {
  const { token } = req.params;

  // verify the token from the URL
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.USER_VERIFICATION_TOKEN_SECRET);
  } catch (err) {
    return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {
      message: "Invalid Email!",
    });
  }

  // update verified status
  const user = await UserModel.findOne({ _id: payload.ID });
  if (!user)
    return apiResponse(res, httpStatus.BAD_REQUEST, {
      message: "something went wrong!",
    });

  user.isEmailVerified = true;
  await user.save();

  return apiResponse(res, httpStatus.OK, {
    message: "Congratulation! your email is now verified",
  });
});

export { userRegister, userLogin, renewToken, emailTokenVerify };
