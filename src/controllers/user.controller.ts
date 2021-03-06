import { Request, Response } from "express";
import httpStatus from "http-status";
// Model
import { UserModel, UserStatus } from "@main/models/user.model";
// Services
import { getUserInfoByToken } from "@main/services/user.service";
// Utilities
import catchAsyncErr from "@main/utils/catchAsync";
import apiResponse from "@main/utils/response";

const userInfo = catchAsyncErr(async (req: Request, res: Response) => {
  const user = await getUserInfoByToken(req);

  if (!user)
    return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {
      message: "User Not Found",
    });
  if (user && user.status === UserStatus.inactive)
    return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {
      message: "Inactive Account",
    });

  const userInfo = await UserModel.findOne(
    { _id: user._id },
    { name: true, email: true, isAuthor: true, photo: true }
  );

  return apiResponse(res, httpStatus.OK, { data: userInfo });
});

export { userInfo };
