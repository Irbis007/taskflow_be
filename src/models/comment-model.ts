import { model, Schema } from "mongoose";

const commentSchema = new Schema(
  {
    message: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    isEdited: { type: Boolean, default: false },
    entityId: {
      type: Schema.Types.ObjectId,
      ref: "entityType",
      required: true,
    },
    entityType: {
      type: String,
      enum: ["Project", "Task"],
      required: true,
    },
  },
  { timestamps: true },
);

export default model("Comment", commentSchema);
