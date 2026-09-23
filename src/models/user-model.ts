import { Schema, model, Types } from "mongoose";
import { User } from "../types";

type FullUser = User & {
  password: string;
  isActivated: boolean;
  activationLink: string;
  timeZone: string;
  location: string;
  joinedDate: Date;
  lastActivityTime: Date;
  roleTitle: string;
  pinnedChats: Types.ObjectId[];
  twoFactor: {
    enabled: boolean;
    secret: string;
    pendingSecret: string | null;
    recoveryCode: string[];
  };
};

const userSchema = new Schema<FullUser>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  color: { type: String, required: true },
  timeZone: { type: String },
  location: { type: String },
  lastActivityTime: { type: Date },
  joinedDate: { type: Date },
  roleTitle: { type: String },
  role: {
    type: String,
    enum: ["Lead", "Member"],
    required: true,
    default: "Member",
  },
  pinnedChats: [
    {
      type: Types.ObjectId,
      ref: "Chat",
      default: [],
    },
  ],
  twoFactor: {
    enabled: {
      type: Boolean,
      default: false,
    },
    secret: {
      type: String,
    },
    pendingSecret: {
      type: String,
    },
    recoveryCodes: [
      {
        type: String,
      },
    ],
  },
});

export default model("User", userSchema);
