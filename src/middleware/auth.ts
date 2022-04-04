import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import passport from "passport";
import catchAsyncErr from "../utils/catchAsync";
import response from "../utils/response";

const isClientAuthenticated = catchAsyncErr(
  async (req: Request, res: Response, next: NextFunction) => {
    const clientToken = req.headers["authorization"];
    if (!clientToken)
      return response(res, httpStatus.UNAUTHORIZED, {
        message: "Basic Client Required",
      });

    passport.authenticate("basic", (err, user, info) => {
      if (err || info || !user)
        return response(res, httpStatus.UNAUTHORIZED, {
          message: "Invalid Client",
        });

      return next();
    })(req, res, next);
  }
);

const isUserAuthenticated = catchAsyncErr(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers["authorization"];
    if (!accessToken)
      return response(res, httpStatus.UNAUTHORIZED, {
        message: "Token Required",
      });

    passport.authenticate("jwt", (err, jwt_payload) => {
      if (err || !jwt_payload) {
        return response(res, httpStatus.UNAUTHORIZED, {
          message: err?.message ? err.message : "Invalid Token",
        });
      }

      return next();
    })(req, res, next);
  }
);

export { isClientAuthenticated, isUserAuthenticated };
