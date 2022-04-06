const cors = require("cors");

export const corsSetup = cors({
  origin: (origin: string, callback: (arg0: null, arg1: boolean) => void) => {
    let string = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.trim() : "*";
    string = string.split(" ").join("");
    const whiteListURIs = string.split(",");
    if (whiteListURIs.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      // callback(new Error("Not allowed by CORS"))
      callback(null, true);
    }
  },
});
