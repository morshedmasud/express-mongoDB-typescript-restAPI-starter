import passportHttp from "passport-http";

// const passportHttpInit = new passportHttp.BasicStrategy(
//   catchAsyncErr(async (name: string, secret: string, done: any) => {
//     const client =
//       name === process.env.JWT_BASIC_USER &&
//       secret === process.env.JWT_BASIC_SECRET
//         ? { name, secret }
//         : null;
//     if (!client) return done("invalid client", client);
//     return done(null, client);
//   })
// );

const passportHttpInit = new passportHttp.BasicStrategy(
  async (name: string, secret: string, done) => {
    const client =
      name === process.env.JWT_BASIC_USER &&
      secret === process.env.JWT_BASIC_SECRET
        ? { name, secret }
        : null;
    if (!client) return done("invalid client", client);
    return done(null, client);
  }
);

export default passportHttpInit;
