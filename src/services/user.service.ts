import { Request } from "express";
import jsonwebtoken from "jsonwebtoken";
import { UserModel } from "../models/user.model";

const getUserInfoByToken = async (req: Request) => {
  const accessToken = req.headers["authorization"].split(" ")[1];
  const decoded = jsonwebtoken.decode(accessToken, { complete: true });

  const user = await UserModel.findOne({ _id: decoded?.payload.user?._id });

  if (user) return user;

  return null;
};

export { getUserInfoByToken };
