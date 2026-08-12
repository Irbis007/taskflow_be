import { taskZodSchema } from "./task";
import * as z from "zod/v4";
import { colorsEnum, iconsEnum, projectStatusEnum } from "./helpers/enums";
import { userZodSchema } from "./user";
import { activityZodSchema } from "./activity";

export const projectZodSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  icon: iconsEnum,
  color: colorsEnum,
  deadline: z.date().optional().nullable(),
  status: projectStatusEnum,
  members: z.array(userZodSchema),
});
export const projectOverviewZodSchema = z.object({
  progressByCategories: z.record(
    z.string(),
    z.object({
      total: z.number(),
      completed: z.number(),
    }),
  ),
  team: z.array(userZodSchema),
  recentActivity: z.array(activityZodSchema),
});

export const singleProjectZodSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  icon: iconsEnum,
  color: colorsEnum,
  deadline: z.date().optional().nullable(),
  status: projectStatusEnum,
  members: z.array(userZodSchema),
  totalTasks: z.number(),
  completedTasks: z.number(),
  tasksInProgress: z.number(),
  tasks: z.array(taskZodSchema),
});

export const editProjectZodSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  icon: iconsEnum,
  color: colorsEnum,
  deadline: z.date().optional().nullable(),
  status: projectStatusEnum,
  members: z.array(z.string()),
});
