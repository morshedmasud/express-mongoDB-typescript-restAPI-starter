import bcrypt from "bcrypt";
import config from "config";
import mongoose from "mongoose";

const status = Object.freeze({
  active: "active",
  inactive: "inactive",
  deleted: "deleted",
});

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  photo: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 255,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/],
    },
    photo: {
      type: String,
      required: false,
      default: null,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    status: {
      type: String,
      enum: Object.values(status),
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next: any) {
  let user = this as UserDocument;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // Random additional data
  const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));

  const hash = await bcrypt.hashSync(user.password, salt);

  // Replace the password with the hash
  user.password = hash;

  return next();
});

// Used for logging in
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

UserSchema.methods.toJSON = function () {
  let obj = this.toObject();

  delete obj.password;
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.__v;

  return obj;
};

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;
