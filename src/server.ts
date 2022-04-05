require("dotenv/config");

import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import mongoSanitize from "express-mongo-sanitize";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import { corsSetup } from "../config/cors";
import expressRateLimit from "../config/express-rate";
import expressSlowDown from "../config/express-slow-down";
import logger from "../config/logger";
import dbConnect from "../config/mongoose";
import { morgarSetup } from "../config/morgan";
import passportHttpInit from "../config/passport-http";
import passportJwtInit from "../config/passport-jwt";
// Import Routes
import authRoute from "./routes/auth.route";
import userRoute from "./routes/user.route";

const xssClean = require("xss-clean");

const swaggerFile: any = "../swagger.json";
const tempyml: any = "../temp.yaml";
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
app.use("/swagger-docs", swaggerUi.serve, swaggerUi.setup(tempyml));
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
