require("dotenv/config");

import bodyParser from "body-parser";
import express, { Request, Response } from "express";

const morgan = require("./config/morgan");

const app = express();
const router = express.Router();

app.use(morgan); // Http logger
app.use(bodyParser.json()); // Json parse

// Mongo DB Connection
require("./config/mongoose");

// Mongo DB Connection
require("./config/mongoose");

// Router Connections
app.use(router);

router.get("/", [], async (req: Request, res: Response) => {
  return res.status(200).send("tst");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
