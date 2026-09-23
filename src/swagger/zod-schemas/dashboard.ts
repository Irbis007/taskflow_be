import * as z from "zod";
import { ToZodSchema } from "../../types";
import { DashboardData } from "../../types/dashboard";
import { priorityEnum } from "./helpers";
import { activityZodSchema } from "./activity";
import { ObjectIdToString } from "mongoose";

export const dashboardZodSchema = z.object({
  projects: z.object({
    total: z.number(),
    difference: z.number(),
  }),
  taskActivity: z.object({
    total: z.number(),
    difference: z.number(),
  }),
  inProgress: z.object({
    total: z.number(),
    difference: z.number(),
  }),
  members: z.object({
    total: z.number(),
    difference: z.number(),
  }),
  tasksByStatus: z.object({
    backlog: z.number().optional(),
    todo: z.number().optional(),
    inProgress: z.number().optional(),
    review: z.number().optional(),
    done: z.number().optional(),
  }),
  weekActivity: z.object({
    Mon: z.number(),
    Tue: z.number(),
    Wed: z.number(),
    Tho: z.number(),
    Fri: z.number(),
    Sun: z.number(),
    Sat: z.number(),
  }),
  recentTask: z.array(
    z.object({
      title: z.string(),
      priority: priorityEnum,
      id: z.string(),
    }),
  ),
  lastActivity: z.array(activityZodSchema),
} as ToZodSchema<ObjectIdToString<DashboardData>>);
