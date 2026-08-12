import { model, Schema, Types } from "mongoose";
import { TaskSchema } from "../types/Task";

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    status: { type: String, required: true },
    priority: {
      type: String,
      enum: ["Low", "Hight", "Medium"],
      required: true,
    },
    deadline: { type: Date },
    assignees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    isCompleted: { type: Boolean, default: false },
    parentTask: { type: Schema.Types.ObjectId, ref: "Task" },
    subtasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    author: { type: Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
    deletedDate: { type: Date },
    timeSpend: { type: Number },
    estimate: { type: Number },
  },
  { timestamps: true },
);

taskSchema.pre(["find", "findOneAndUpdate"], function () {
  this.where({ isDeleted: false });
});

export default model<TaskSchema>("Task", taskSchema);
