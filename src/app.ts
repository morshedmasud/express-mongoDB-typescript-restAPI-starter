import logger from "@main/config/logger";
import { createServer } from "@main/config/server";

const port = process.env.PORT || 3000;
// server.listen(port, async () => {
//   //await dbConnect(); // Mongo DB Connection
//   logger.info(`server is listening on port ${port}`);
// });

createServer()
  .then((server) => {
    server.listen(port, () => {
      logger.info(`server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    logger.error(`Error: ${err}`);
  });
