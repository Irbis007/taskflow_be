import * as z from "zod/v4";
import { FullUser, ToZodSchema, User } from "../../types";
import { colorsEnum, projectRoleEnum } from "./helpers";
import { activityZodSchema } from "./activity";
import { ObjectIdToString } from "mongoose";
import { EditUser } from "../../types/user";
// import { ObjectIdToString } from "mongoose";

export const userZodSchema = z.object({
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  color: z.string(),
  id: z.string(),
  role: z.enum(["Member", "Admin"]),
  twoFactor: z.object({
    enabled: z.boolean(),
    configured: z.boolean(),
  }),
} as ToZodSchema<ObjectIdToString<User>>);
export const editUserZodSchema = z.object({
  name: z.string(),
  surname: z.string(),
  role: z.enum(["Member", "Admin"]),
  timeZone: z.string().optional(),
  location: z.string().optional(),
} as ToZodSchema<ObjectIdToString<EditUser>>);

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
  chatId: z.string(),
} satisfies ToZodSchema<ObjectIdToString<FullUser>>);

export const userWithTokensZodSchema = z.object({
  user: userZodSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});
