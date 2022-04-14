require("dotenv/config");
import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import mongoSanitize from "express-mongo-sanitize";
import morganBody from "morgan-body";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import { corsSetup } from "./cors";
import expressRateLimit from "./express-rate";
import expressSlowDown from "./express-slow-down";
import dbConnect from "./mongoose";
import { expressDevLogger } from "./morgan";
import passportHttpInit from "./passport-http";
import passportJwtInit from "./passport-jwt";
// Import Routes
import authRoute from "@main/routes/auth.route";
import userRoute from "@main/routes/user.route";

const xssClean = require("xss-clean");
const swaggerFile = require("../../swagger");

export const createServer = async () => {
  const server = express();

  server.use(bodyParser.json()); // Json parse
  server.use(corsSetup); // Cors set
  server.use(xssClean()); // sanitize request data
  server.use(mongoSanitize()); // sanitize mongoose data

  // morganBody(server);
  // server.use(expressDevLogger); // Custome logger

  server.use(passport.initialize()); // passport authentication initialize
  passport.use("basic", passportHttpInit); // passport http authentication initialize
  passport.use("jwt", passportJwtInit); // passport jwt authentication initialize

  const indexRouter = express.Router();
  indexRouter.get("/", [], async (req: Request, res: Response) => {
    return res.status(200).send("Express MongoDB Typescript Boilerplate");
  });

  // Router Connections
  server.use(indexRouter);
  server.use("/swagger-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile)); // Swagger Routing
  server.use("/api/auth", authRoute);
  server.use("/api/user", userRoute);

  if (process.env.NODE_ENVIRONMENT === "production") {
    server.use(expressRateLimit); // per window rate limit
    server.use(expressSlowDown); // slow down rather then block
  }
  await dbConnect(); // Mongo DB Connection

  return server;
};
