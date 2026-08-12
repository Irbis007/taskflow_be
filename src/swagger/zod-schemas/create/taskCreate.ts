import * as z from "zod/v4";
import { priorityEnum, taskStatusEnum } from "../";

export const taskCreateZodSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: taskStatusEnum,
  priority: priorityEnum,
  deadline: z.date().optional().nullable(),
  assignees: z.array(z.string()),
  tags: z.array(z.string()),
  project: z.string(),
  parentTask: z.string().optional(),
  estimate: z.string().optional(),
});
