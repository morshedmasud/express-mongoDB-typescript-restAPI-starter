require("dotenv/config");

import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import mongoSanitize from "express-mongo-sanitize";
import { corsSetup } from "../config/cors";
import expressRateLimit from "../config/express-rate";
import expressSlowDown from "../config/express-slow-down";
import logger from "../config/logger";
import dbConnect from "../config/mongoose";
import { morgarSetup } from "../config/morgan";
// Import Routes
import authRoute from "./routes/auth.route";

const xssClean = require("xss-clean");
const app = express();

const mainRouter = express.Router();

app.use(morgarSetup); // Http logger
app.use(bodyParser.json()); // Json parse
app.use(corsSetup); // Cors set
app.use(xssClean()); // sanitize request data
app.use(mongoSanitize()); // sanitize mongoose data

mainRouter.get("/", [], async (req: Request, res: Response) => {
  return res.status(200).send("express-mongo-typescript boilerplate");
});

// Router Connections
app.use(mainRouter);
app.use(authRoute);

if (process.env.NODE_ENVIRONMENT === "production") {
  app.use(expressRateLimit); // per window rate limit
  app.use(expressSlowDown); // slow down rather then block
}

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  await dbConnect(); // Mongo DB Connection
  logger.info(`server is listening on port ${port}`);
});
