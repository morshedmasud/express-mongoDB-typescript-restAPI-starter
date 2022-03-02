// const mongoose = require("mongoose");
// const MONGO_OPTIONS = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };
// mongoose
//   .connect(process.env.MONGODB_URL, MONGO_OPTIONS)
//   .catch((err: string) => {
//     logger.error("Mongoose connection error: " + err);
//   });
// mongoose.connection.once("open", () => {
//   logger.info("Mongoose connected.");
//   mongoose.connection.on("connected", () => {
//     logger.error("Mongoose event connected");
//   });
//   mongoose.connection.on("disconnected", () => {
//     logger.error("Mongoose event disconnected");
//   });
//   mongoose.connection.on("reconnected", () => {
//     logger.info("Mongoose event reconnected");
//   });
//   mongoose.connection.on("error", (error: any) => {
//     logger.error("Mongoose event error");
//     logger.error(error);
//     module.exports = mongoose;
//   });
// });
// module.exports = mongoose;
import mongoose from "mongoose";
import logger from "../config/logger";

function dbConnect() {
  const dbUri = process.env.MONGODB_URL as string;

  return mongoose
    .connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      logger.info("Database connected");
    })
    .catch((error: any) => {
      logger.error("db error", error);
      process.exit(1);
    });
}

export default dbConnect;
