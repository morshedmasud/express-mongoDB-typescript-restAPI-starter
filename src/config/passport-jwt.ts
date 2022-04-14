import { ObjectId } from "mongoose";
import passportJwt from "passport-jwt";
import { UserModel } from "@main/models/user.model";

const passportJwtInit = new passportJwt.Strategy(
  {
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_ACCESS_SECRET,
  },
  async (jwt_payload, done) => {
    if (jwt_payload && jwt_payload.user && jwt_payload.user._id) {
      const accessUser = await UserModel.findOne(
        { _id: jwt_payload.user._id },
        { name: true, email: true }
      );
      if (!accessUser) return done({ message: "Invalid Token" }, null);

      const currentDate = new Date();
      if (currentDate > new Date(jwt_payload.exp))
        return done({ message: "Expired Token" }, null);

      return done(null, jwt_payload);
    } else return done({ message: "Invalid Token" }, null);
  }
);

export default passportJwtInit;
