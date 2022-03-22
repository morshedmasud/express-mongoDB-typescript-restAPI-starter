import { NextFunction, Request, Response } from "express";

const response = require("./response");
const httpStatus = require("http-status");

const catchAsyncErr =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch((err) =>
      response(res, httpStatus.BAD_REQUEST, {
        message: "message" in err ? err.message : "Something went wrong",
      })
    );
  };
module.exports = catchAsyncErr;
