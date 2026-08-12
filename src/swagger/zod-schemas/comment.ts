import * as z from "zod";
import { userZodSchema } from "./user";
import { entityEnum } from "./helpers";

export const commentZodSchema = z.object({
  message: z.string(),
  id: z.string(),
  author: userZodSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  isEdited: z.boolean(),
});

export const commentCreateZodSchema = z.object({
  message: z.string(),
  entityType: entityEnum,
  entityId: z.string(),
});
export const commentUpdateZodSchema = z.object({
  message: z.string(),
});
