import { Response } from "express";

const httpStatus = require("http-status");

type typeReturnObject = {
  data: any;
  message: string | null;
  stack: any;
};

module.exports = (res: Response, status: number, data: any, optional: any) => {
  const returnObject: typeReturnObject = {
    data: null,
    message: null,
    stack: null,
  };

  returnObject["data"] = data && data?.data ? data?.data : null;
  returnObject["message"] = data && data?.message ? data?.message : null;
  returnObject["stack"] =
    typeof optional !== "undefined" && Object.keys(optional).length > 0
      ? optional
      : null;

  res.status(status);
  return res.json(returnObject);
};
