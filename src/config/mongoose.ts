
const mongoose = require("mongoose");

const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(process.env.MONGODB_URL, MONGO_OPTIONS)
  .catch((err: string) => {
    console.log("Mongoose connection error: " + err);
  });

mongoose.connection.once("open", () => {
  console.log("Mongoose connected.");

  mongoose.connection.on("connected", () => {
    console.log("Mongoose event connected");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose event disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("Mongoose event reconnected");
  });

  mongoose.connection.on("error", (error: any) => {
    console.log("Mongoose event error");
    console.log(error);
  });
});

module.exports = mongoose;
