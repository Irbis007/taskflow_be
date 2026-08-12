import { Types } from "mongoose";
import { ZodType } from "zod/v4";

export type { KanbanTaskDto, CreateTask, SubtaskRow } from "./Task";
export type { Project, ProjectOverview, ProjectEdit } from "./Project";
export type { User, FullUser } from "./user";
export type { Tag } from "./tag";
export type { UpdateComment, Comment, CreateComment } from "./comment";
export type {
  Activity,
  CreateActivity,
  ActivityDto,
  ActivityResponse,
} from "./activity";
export type { Message, MessageOutput } from "./message";

export type ToZodSchema<T extends object> = {
  [K in keyof T]: ZodType<T[K]>;
};

export type ProjectRole = "Member" | "Lead";
export type Entity = "Task" | "Project";
