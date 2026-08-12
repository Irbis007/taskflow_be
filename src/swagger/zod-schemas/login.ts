import * as z from "zod/v4";

export const loginZodSchema = z.object({
  email: z.email(),
  password: z.string(),
});
