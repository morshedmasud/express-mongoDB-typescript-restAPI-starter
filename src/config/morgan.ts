const morgan = require("morgan");

export const morgarSetup =
  process.env.NODE_ENVIRONMENT === "production"
    ? morgan(":method :url :status")
    : morgan(":method :url :status :res[content-length] - :response-time ms");
