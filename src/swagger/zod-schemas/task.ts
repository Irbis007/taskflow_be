import * as z from "zod/v4";
import {
  colorsEnum,
  iconsEnum,
  priorityEnum,
  taskStatusEnum,
} from "./helpers/enums";
import { userZodSchema } from "./user";
import { tagZodSchema } from "./helpers/tag";

export const taskZodSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: taskStatusEnum,
  priority: priorityEnum,
  deadline: z.date().optional().nullable(),
  assignees: z.array(userZodSchema),
  tags: z.array(tagZodSchema),
  author: userZodSchema,
  isCompleted: z.boolean(),
  project: z.string(),
  estimate: z.string().optional(),
});

export const kanbanTaskZodSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: taskStatusEnum,
  priority: priorityEnum,
  deadline: z.date().optional().nullable(),
  tags: z.array(tagZodSchema),
  author: userZodSchema,
  completedSubtasks: z.number(),
  totalSubtasks: z.number(),
});

export const subtaskRowZodSchema = z.object({
  title: z.string(),
  id: z.string(),
  isCompleted: z.boolean(),
  author: userZodSchema,
});

export const singleTaskZodSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: taskStatusEnum,
  priority: priorityEnum,
  deadline: z.date().optional().nullable(),
  assignees: z.array(z.string()),
  tags: z.array(tagZodSchema),
  author: userZodSchema,
  isCompleted: z.boolean(),
  project: z.object({
    id: z.string(),
    name: z.string(),
    color: colorsEnum,
    icon: iconsEnum,
  }),
  subtasks: z.array(subtaskRowZodSchema).optional(),
  estimate: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const updateTaskZodSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: taskStatusEnum,
  priority: priorityEnum,
  deadline: z.date().optional().nullable(),
  assignees: z.array(z.string()),
  tags: z.array(z.string()),
  isCompleted: z.boolean(),
  project: z.string(),
  estimate: z.string().optional(),
});
