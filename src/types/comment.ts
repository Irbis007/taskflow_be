import { Types } from "mongoose";
import { User } from "./user";

export type Comment = {
  message: string;
  entityId: Types.ObjectId;
  entityType: "Task" | "Project";
  isEdited?: boolean;
  author: User;
  id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateComment = Pick<Comment, "message" | "id">;
export type CreateComment = Pick<
  Comment,
  "message" | "entityId" | "entityType" | "author"
>;
