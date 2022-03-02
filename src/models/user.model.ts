// import mongoose from "mongoose";

// export interface UserDocument extends mongoose.Document {
//   email: string;
//   name: string;
//   password: string;
//   createdAt: Date;
//   updatedAt: Date;
//   comparePassword(candidatePassword: string): Promise<boolean>;
// }

// const status = Object.freeze({
//   active: "active",
//   inactive: "inactive",
//   deleted: "deleted",
// });

// const UserSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       min: 6,
//       max: 255,
//     },
//     email: {
//       type: String,
//       required: true,
//       min: 6,
//       max: 255,
//       unique: true,
//       trim: true,
//       lowercase: true,
//       match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/],
//     },
//     photo: {
//       type: String,
//       required: false,
//       default: null,
//     },
//     password: {
//       type: String,
//       required: true,
//       min: 6,
//       max: 255,
//     },
//     isAuthor: {
//       type: Boolean,
//       required: false,
//       default: false,
//     },
//     status: {
//       type: String,
//       enum: Object.values(status),
//       required: true,
//     },
//   },
//   { timestamps: true }
// );
