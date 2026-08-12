import { id } from "zod/v4/locales";
import { ObjectIdToString, Types } from "mongoose";
import { User } from "./user";

export type Activity = {
  entityId: Types.ObjectId;
  entityType: "Task" | "Project";
  entityTitle?: string;
  author: Types.ObjectId;
  invitedUser?: Types.ObjectId;
  action:
    | "created"
    | "moved"
    | "invited"
    | "edited"
    | "commented"
    | "completed";
  id: Types.ObjectId;
  metadata?: {
    to: string;
    from: string;
  };
  createdAt: Date;
};

export type ActivityResponse = Omit<
  Activity,
  "entityId" | "author" | "invitedUser" | "id"
> & {
  author: ObjectIdToString<User>;
  invitedUser?: ObjectIdToString<User>;
  entityId: string;
  id: string;
};

export type CreateActivity = Omit<Activity, "id" | "createdAt">;
export type ActivityDto = Omit<Activity, "author" | "invitedUser"> & {
  author: User;
  invitedUser?: User;
};
