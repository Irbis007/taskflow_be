import * as z from "zod/v4";
import { colorsEnum, iconsEnum, projectStatusEnum } from "../helpers/enums";

export const projectCreateZodSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  icon: iconsEnum,
  color: colorsEnum,
  deadline: z.date().optional().nullable(),
  status: projectStatusEnum,
  members: z.array(z.string()),
});
