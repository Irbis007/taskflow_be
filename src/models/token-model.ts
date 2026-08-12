import { Schema, Types, model } from "mongoose";

const tokenSchema = new Schema({
  refreshToken: { type: String, require: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model("Token", tokenSchema);
