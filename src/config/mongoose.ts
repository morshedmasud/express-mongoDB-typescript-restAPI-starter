const mongoose = require("mongoose");
import logger from "@main/config/logger";

const dbConnect = async () => {
  const dbUrl = process.env.DB_URL as string;

  return mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      logger.info("Database connected");
    })
    .catch((error: any) => {
      logger.error("db error--", error);
      process.exit(1);
    });
};

export default dbConnect;
