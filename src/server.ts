require("dotenv/config");

import { corsSetup } from "@main/config/cors";
import expressRateLimit from "@main/config/express-rate";
import expressSlowDown from "@main/config/express-slow-down";
import logger from "@main/config/logger";
import dbConnect from "@main/config/mongoose";
import { morgarSetup } from "@main/config/morgan";
import passportHttpInit from "@main/config/passport-http";
import passportJwtInit from "@main/config/passport-jwt";
import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import mongoSanitize from "express-mongo-sanitize";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
// Import Routes
import authRoute from "@main/routes/auth.route";
import userRoute from "@main/routes/user.route";

const xssClean = require("xss-clean");

const swaggerFile = require("../swagger");
const app = express();

app.use(morgarSetup); // Http logger
app.use(bodyParser.json()); // Json parse
app.use(corsSetup); // Cors set
app.use(xssClean()); // sanitize request data
app.use(mongoSanitize()); // sanitize mongoose data

app.use(passport.initialize()); // passport authentication initialize
passport.use("basic", passportHttpInit); // passport http authentication initialize
passport.use("jwt", passportJwtInit); // passport jwt authentication initialize

const indexRouter = express.Router();
indexRouter.get("/", [], async (req: Request, res: Response) => {
  return res.status(200).send("Express MongoDB Typescript Boilerplate");
});

// Router Connections
app.use(indexRouter);
app.use("/swagger-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile)); // Swagger Routing
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

if (process.env.NODE_ENVIRONMENT === "production") {
  app.use(expressRateLimit); // per window rate limit
  app.use(expressSlowDown); // slow down rather then block
}

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  await dbConnect(); // Mongo DB Connection
  logger.info(`server is listening on port ${port}`);
});
