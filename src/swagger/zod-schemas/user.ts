import * as z from "zod/v4";
import { FullUser, ToZodSchema, User } from "../../types";
import { colorsEnum, projectRoleEnum } from "./helpers";
import { activityZodSchema } from "./activity";
import { ObjectIdToString } from "mongoose";
// import { ObjectIdToString } from "mongoose";

export const userZodSchema = z.object({
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  color: z.string(),
  id: z.string(),
  role: z.enum(["Member", "Admin"]),
} as ToZodSchema<ObjectIdToString<User>>);

export const fullUserZodSchema = z.object({
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  color: z.string(),
  id: z.string(),
  role: z.enum(["Member", "Admin"]),
  location: z.string(),
  timeZone: z.string(),
  joinedDate: z.date(),
  lastActivityTime: z.date(),
  tasksDone: z.number(),
  projectsCount: z.number(),
  completedTasksRate: z.number(),
  roleTitle: z.string(),
  projects: z.array(
    z.object({
      id: z.string(),
      color: colorsEnum,
      name: z.string(),
      projectRole: projectRoleEnum,
      assignedTasks: z.number(),
    }),
  ),
  lastActivities: z.lazy(() => z.array(activityZodSchema)),
} satisfies ToZodSchema<ObjectIdToString<FullUser>>);

export const userWithTokensZodSchema = z.object({
  user: userZodSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});
