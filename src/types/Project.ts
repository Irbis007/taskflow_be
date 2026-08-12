import { Types } from "mongoose";
import { ProjectTask } from "./Task";
import { User } from "./user";
import { Activity, ActivityDto } from "./activity";
export type Project = {
  name: string;
  icon: string;
  description?: string | null;
  color: string;
  deadline?: NativeDate | null;
  status: string;
  members?: {
    id: Types.ObjectId;
    role?: "Member" | "Lead" | null;
  }[];
  id: Types.ObjectId;
  author: User;
};

export type ProjectCreate = {
  name: string;
  icon: string;
  description?: string | null;
  color: string;
  deadline?: NativeDate | null;
  status: string;
  members?: Types.ObjectId[];
  author: Types.ObjectId;
};

export type ProjectEdit = {
  name: string;
  icon: string;
  description?: string | null;
  color: string;
  deadline?: NativeDate | null;
  status: string;
  members?: Types.ObjectId[];
  author: Types.ObjectId;
};

export type SingleProject = {
  name: string;
  icon: string;
  description?: string | null;
  color: string;
  deadline?: NativeDate | null;
  status: string;
  id: Types.ObjectId;
  totalTasks: number;
  completedTasks: number;
  tasksInProgress: number;
};

export type ProjectOverview = {
  team: (User & {
    projectRole: "Member" | "Lead";
  })[];
  recentActivity: ActivityDto[];
  progressByCategories: Record<
    string,
    {
      total: number;
      completed: number;
    }
  >;
};
