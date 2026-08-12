import { model, Schema } from "mongoose";

const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String },
    color: { type: String, required: true },
    deadline: { type: Date },
    status: { type: String, required: true },
    visibility: { type: String },
    members: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["Member", "Lead"],
        },
      },
    ],
    isCompleted: { type: Boolean, default: false },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    isDeleted: { type: Boolean, default: false },
    deletedDate: { type: Date },
  },
  { timestamps: true },
);

projectSchema.pre(["find", "findOneAndUpdate"], function () {
  this.where({ isDeleted: false });
});

export default model("Project", projectSchema);
