import { Types } from "mongoose";
import { User } from "./user";
import { Project } from "./Project";
import { Tag } from "./tag";

export type Task = {
  title: string;
  status: "Backlog" | "To Do" | "In progress" | "Review" | "Done";
  priority: string;
  deadline?: NativeDate | null;
  assignees?: Types.ObjectId[];
  tags?: Types.ObjectId[];
  id: Types.ObjectId;
  parentTask?: Types.ObjectId;
  description?: string;
  project: Types.ObjectId;
  estimate?: number;
  timeSpend?: number;
  subtasks: Types.ObjectId[];
  isCompleted: boolean;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskSchema = Task & {
  isDeleted: boolean;
  deletedDate?: Date;
};
export type CreateTask = Omit<
  Task,
  "id" | "author" | "subtasks" | "isCompleted"
>;

export type KanbanTaskDto = Omit<
  Task,
  "parentTask" | "subtasks" | "author" | "tags"
> & {
  completedSubtasks: number;
  totalSubtasks: number;
  author: User;
  tags: Tag[];
};

export type ProjectTask = {
  title: string;
  priority: string;
  deadline?: NativeDate | null;
  isCompleted: boolean;
  assignees?: Types.ObjectId[];
  tags?: Types.ObjectId[];
  id: Types.ObjectId;
};
export type SingleTask = Omit<
  Task,
  "project" | "author" | "subtasks" | "estimate" | "timeSpend" | "tags"
> & {
  project: Pick<Project, "id" | "color" | "icon" | "name">;
  author: User;
  subtasks: SubtaskRow[];
  estimate: string;
  timeSpend: string;
  tags: Tag[];
};

export type SubtaskRow = {
  title: string;
  isCompleted: boolean;
  author: User;
  id: Types.ObjectId;
};

// {
//   title: string;
//   status: string;
//   priority: string;
//   deadline?: NativeDate | null;
//   assignees?: Types.ObjectId[];
//   tags?: Types.ObjectId[];
//   id: Types.ObjectId;
//   parentTask?: Types.ObjectId;
//   description?: string;

//   estimate?: string;
//   subtasks: Task;
//   isCompleted: boolean;
//   author: User;
// };
