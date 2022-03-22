import mongoose from "mongoose";
import logger from "../config/logger";

const dbConnect = () => {
  const dbUrl = process.env.MONGODB_URL as string;

  console.log(dbUrl);

  return mongoose
    .connect(dbUrl, {
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
};

export default dbConnect;
