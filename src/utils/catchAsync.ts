import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import apiResponse from "./response";

const catchAsyncErr =
  (fn: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await Promise.resolve(fn(req, res, next));
    } catch (err: any) {
      return apiResponse(res, httpStatus.BAD_REQUEST, {
        message: "message" in err ? err.message : "Something went wrong",
      });
    }
  };

export default catchAsyncErr;
