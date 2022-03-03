require("dotenv/config");

import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import mongoSanitize from "express-mongo-sanitize";
import expressRateLimit from "../config/express-rate";
import expressSlowDown from "../config/express-slow-down";
import logger from "../config/logger";
import dbConnect from "../config/mongoose";

const morgan = require("../config/morgan");
const cors = require("../config/cors");

const app = express();
const router = express.Router();

app.use(morgan); // Http logger
app.use(bodyParser.json()); // Json parse
app.use(cors); // Cors set
app.use(mongoSanitize); // sanitize mongoose data

router.get("/", [], async (req: Request, res: Response) => {
  return res.status(200).send("tst");
});

// Router Connections
app.use(router);

if (process.env.NODE_ENVIRONMENT === "production") {
  app.use(expressRateLimit); // per window rate limit
  app.use(expressSlowDown); // slow down rather then block
}

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  await dbConnect(); // Mongo DB Connection
  logger.info(`server is listening on port ${port}`);
});
