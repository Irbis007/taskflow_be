import { model, Schema, Types } from "mongoose";

const messageScheme = new Schema(
  {
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      required: true,
    },
    author: { type: Types.ObjectId, required: true },
    chat: { type: Types.ObjectId, required: true, ref: "Chat" },
  },
  { timestamps: true },
);

export default model("Message", messageScheme);
