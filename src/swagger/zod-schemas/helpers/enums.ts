import * as z from "zod/v4";
import { Entity, ProjectRole } from "../../../types";

const taskStatusArr = ["Backlog", "To Do", "In progress", "Review", "Done"];
export const taskStatusEnum = z.enum(taskStatusArr);

const projectStatusArr = ["Active", "Planned"];
export const projectStatusEnum = z.enum(projectStatusArr);

const priorityArr = ["Low", "Medium", "Hight"];
export const priorityEnum = z.enum(priorityArr);

const colorsArr = ["purple", "success", "warning", "danger", "pink", "blue"];
export const colorsEnum = z.enum(colorsArr);

const iconsArr = [
  "phone",
  "dashboard",
  "api",
  "security",
  "server",
  "docs",
  "paint",
  "chart",
  "cart",
  "github",
  "mail",
  "rocket",
];
export const iconsEnum = z.enum(iconsArr);

const entityArr = ["Task", "Project"] satisfies Entity[];

export const entityEnum = z.enum(entityArr);

export const actionEnum = z.enum([
  "created",
  "commented",
  "edited",
  "invited",
  "moved",
  "completed",
]);

const projectRoleArr = ["Lead", "Member"] satisfies ProjectRole[];

export const projectRoleEnum = z.enum(projectRoleArr);

const groupRole = ["Admin", "Member"];

export const groupRoleEnum = z.enum(groupRole);
