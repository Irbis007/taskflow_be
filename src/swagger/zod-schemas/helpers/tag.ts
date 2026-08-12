import * as z from "zod/v4";

export const tagZodSchema = z.object({
  name: z.string(),
  id: z.string(),
});
