import * as z from "zod/v4";

export const registrationZodSchema = z.object({
  name: z.string(),
  surname: z.string(),
  password: z.string(),
  email: z.email(),
});
