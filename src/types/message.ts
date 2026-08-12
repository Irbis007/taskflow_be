import { Types, ObjectIdToString } from "mongoose";
import { User } from "./user";

export type Message = {
  id: Types.ObjectId;
  message: string;
  status: "sent" | "delivered" | "read";
  author: Types.ObjectId;
  chatId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type MessageCreate = Pick<Message, "message" | "author" | "chatId">;

export type MessageOutput = Omit<Message, "author"> & {
  author: User;
};
