import { Schema, model } from "mongoose";
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
});

export default model("User", userSchema);
