import jsonwebtoken from "jsonwebtoken";
import { ObjectId } from "mongoose";
import { UserModel } from "../models/user.model";

type typeUserObject = {
  _id: ObjectId;
  name: string;
  email: string;
};

const generateToken = (user: typeUserObject, exp: string, secret: string) => {
  return jsonwebtoken.sign(
    {
      user: { _id: user._id, name: user.name, email: user.email },
      exp: new Date(exp).getTime(),
    },
    secret
  );
};

const accessTokenDetailAndRefreshTokenDetail = async (
  user: typeUserObject,
  clientId: string
) => {
  let accessDate = new Date();
  let refreshDate = new Date();

  const exp = accessDate.setMinutes(
    accessDate.getMinutes() +
      parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES)
  );
  const accessToken = await generateToken(
    user,
    exp,
    process.env.JWT_ACCESS_SECRET
  );
  const exp2 = refreshDate.setMinutes(
    refreshDate.getMinutes() +
      parseInt(process.env.JWT_REFRESH_EXPIRATION_MINUTES)
  );
  const refreshToken = await generateToken(
    user,
    exp2,
    process.env.JWT_REFRESH_SECRET
  );

  const tokens = {
    access: {
      token: accessToken,
      expiredAt: new Date(exp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        hour12: true,
        minute: "2-digit",
      }),
    },
    refresh: {
      token: refreshToken,
      expiredAt: new Date(exp2).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        hour12: true,
        minute: "2-digit",
      }),
    },
  };
  return tokens;
};

const getUserInfoByToken = async (req) => {
  const accessToken = req.headers["authorization"].split(" ")[1];
  const decoded = jsonwebtoken.decode(accessToken, { complete: true });

  const user = await UserModel.findOne({ _id: decoded.payload.user._id });

  if (user) return user;

  return null;
};

export { accessTokenDetailAndRefreshTokenDetail, getUserInfoByToken };
