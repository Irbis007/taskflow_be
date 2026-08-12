import { Types } from "mongoose";
import { Project } from "./Project";
import { Activity, ActivityDto, ProjectRole } from ".";

export type User = {
  name: string;
  surname: string;
  id: Types.ObjectId;
  email: string;
  color: string;
  role: "Member" | "Admin";
};

export type FullUser = {
  name: string;
  surname: string;
  id: Types.ObjectId;
  email: string;
  color: string;
  tasksDone: number;
  projectsCount: number;
  completedTasksRate: number;
  role: User["role"];
  location?: string;
  roleTitle?: string;
  timeZone?: string;
  joinedDate: Date;
  lastActivityTime: Date;
  projects: (Pick<Project, "color" | "name"> & {
    projectRole: ProjectRole;
    assignedTasks: number;
    id: Types.ObjectId;
  })[];
  lastActivities: ActivityDto[];
};
