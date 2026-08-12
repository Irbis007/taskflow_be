import * as z from "zod";
import { actionEnum, entityEnum } from "./helpers";
import { userZodSchema } from "./user";
import { ActivityResponse, ToZodSchema } from "../../types";

export const activityZodSchema = z.object({
  entityId: z.string(),
  entityType: z.lazy(() => entityEnum),
  entityTitle: z.string().optional(),
  action: z.lazy(() => actionEnum),
  id: z.string(),
  author: z.lazy(() => userZodSchema),
  invitedUser: z.lazy(() => userZodSchema),
  metadata: z
    .object({
      to: z.string(),
      from: z.string(),
    })
    .optional(),
  createdAt: z.date(),
} satisfies ToZodSchema<ActivityResponse>);
