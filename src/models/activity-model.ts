import { model, Schema, Types } from "mongoose";
const activitySchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["created", "commented", "edited", "invited", "moved", "completed"],
      required: true,
    },
    entityType: {
      type: String,
      enum: ["Task", "Project"],
      required: true,
    },

    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "entityType",
    },

    metadata: {
      type: Schema.Types.Mixed,
    },
    invitedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);
export default model("Activity", activitySchema);
