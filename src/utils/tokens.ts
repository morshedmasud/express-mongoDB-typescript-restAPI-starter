import jsonwebtoken from "jsonwebtoken";
import { ObjectId } from "mongoose";

type typeUserObject = {
  _id: ObjectId;
  name: string;
  email: string;
};

const generateToken = async (
  user: typeUserObject,
  expiredAt: number,
  secret: string
) => {
  return jsonwebtoken.sign(
    {
      user: { _id: user._id, name: user.name, email: user.email },
      exp: new Date(expiredAt).getTime(),
    },
    secret
  );
};

const accessTokenDetailAndRefreshTokenDetail = async (
  user: typeUserObject,
  clientSecret: string
) => {
  let accessDate = new Date();
  let refreshDate = new Date();

  const accessTokenExpiredAt = accessDate.setMinutes(
    accessDate.getMinutes() +
      parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES as string)
  );

  const accessToken = await generateToken(
    user,
    accessTokenExpiredAt,
    process.env.JWT_ACCESS_SECRET as string
  );

  const refreshTokenExpiredAt = refreshDate.setMinutes(
    refreshDate.getMinutes() +
      parseInt(process.env.JWT_REFRESH_EXPIRATION_MINUTES as string)
  );

  const refreshToken = await generateToken(
    user,
    refreshTokenExpiredAt,
    process.env.JWT_REFRESH_SECRET as string
  );

  const tokens = {
    access: {
      token: accessToken,
      expiredAt: new Date(accessTokenExpiredAt).toLocaleDateString("en-US", {
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
      expiredAt: new Date(refreshTokenExpiredAt).toLocaleDateString("en-US", {
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

export { accessTokenDetailAndRefreshTokenDetail };
