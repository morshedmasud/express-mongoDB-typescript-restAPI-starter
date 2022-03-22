import { Response } from "express";

type typeResponseObject = {
  data: object | null;
  message: string | null;
  stack: any;
};

const response = (res: Response, status: number, data: any, optional: any) => {
  const returnObject: typeResponseObject = {
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

module.exports = response;
