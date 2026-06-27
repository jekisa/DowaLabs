import mongoose, { Schema, model, models, type Model } from "mongoose";
import type { MembershipStatus, PackageName } from "@/lib/membership";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  whatsapp: string;
  passwordHash: string;
  role: "user" | "admin";
  membershipStatus: MembershipStatus;
  packageName: PackageName | null;
  membershipStart: Date | null;
  membershipEnd: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    whatsapp: { type: String, required: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },
    membershipStatus: {
      type: String,
      enum: ["pending", "active", "expired", "blocked"],
      default: "pending",
      index: true,
    },
    packageName: {
      type: String,
      enum: ["basic", "pro", null],
      default: null,
    },
    membershipStart: { type: Date, default: null },
    membershipEnd: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  (models.User as Model<IUser>) || model<IUser>("User", UserSchema);
