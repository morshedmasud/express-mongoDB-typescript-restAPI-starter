import { NextFunction, Request, Response } from "express";
const morgan = require("morgan");

export const morgarSetup =
  process.env.NODE_ENVIRONMENT === "production"
    ? morgan(":method :url :status")
    : morgan(":method :url :status :res[content-length] - :response-time ms");

export const expressDevLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startHrTime = process.hrtime();

  // console.log(
  //   `Request: ${req.method} ${
  //     req.url
  //   } at ${new Date().toUTCString()}, User-Agent: ${req.get("User-Agent")}`
  // );
  // console.log(`Request Body: ${JSON.stringify(req.body)}`);

  const [oldWrite, oldEnd] = [res.write, res.end];
  const chunks: Buffer[] = [];
  (res.write as unknown) = function (chunk: any): void {
    chunks.push(Buffer.from(chunk));
    (oldWrite as Function).apply(res, arguments);
  };

  res._final = function (chunk: any): void {
    if (chunk) {
      chunks.push(Buffer.from(chunk));
    }

    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

    // console.log(`Response ${res.statusCode} ${elapsedTimeInMs.toFixed(3)} ms`);

    const body = Buffer.concat(chunks).toString("utf8");
    // console.log(`Response Body: ${body}`);
    (oldEnd as Function).apply(res, arguments);
  };

  next();
};
