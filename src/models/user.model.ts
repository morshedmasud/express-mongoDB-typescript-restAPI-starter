import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
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
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateVerificationToken(): Promise<string>;
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
    isEmailVerified: {
      type: Boolean,
      required: false,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(status),
      required: true,
      default: status.active,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next: any) {
  let user = this as UserDocument;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // Random additional data
  const salt = await bcrypt.genSalt(10);

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

// User for generate email verification token
UserSchema.methods.generateVerificationToken = async function () {
  const user = this;
  const verificationToken = jsonwebtoken.sign(
    { ID: user._id },
    process.env.USER_VERIFICATION_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );
  return verificationToken;
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

export { User as UserModel, status as UserStatus };
