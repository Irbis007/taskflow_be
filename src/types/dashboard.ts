import { Types } from "mongoose";
import { ActivityDto, Priority } from ".";

export type WeekActivity = {
  Mon: number;
  Tue: number;
  Wed: number;
  Tho: number;
  Fri: number;
  Sat: number;
  Sun: number;
};

export type DashboardData = {
  projects: {
    total: number;
    difference: number;
  };
  taskActivity: {
    total: number;
    difference: number;
  };
  inProgress: {
    total: number;
    difference: number;
  };
  members: {
    total: number;
    difference: number;
  };
  weekActivity: WeekActivity;
  tasksByStatus: {
    backlog?: number;
    todo?: number;
    inProgress?: number;
    review?: number;
    done?: number;
  };
  recentTask: {
    id: Types.ObjectId;
    priority: Priority;
    title: string;
  }[];
  lastActivity: ActivityDto[];
};
