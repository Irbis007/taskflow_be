import { z } from "zod";
import { userZodSchema } from "./user";

export const messageZodSchema = z.object({
  message: z.string(),
  author: userZodSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.enum(["read", "sent", "delivered"]),
  chatId: z.string(),
  id: z.string(),
});

export const createMessageZodSchema = z.object({
  message: z.string(),
  chatId: z.string(),
});

export const chatZodSchema = z.object({
  companion: userZodSchema,
  messages: z.array(messageZodSchema),
  chatName: z.string(),
  chatId: z.string(),
});

export const chatItemZodSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  chatName: z.string(),
  lasMessage: z.string(),
  lastMessageDate: z.date(),
  chatId: z.string(),
  companion: userZodSchema,
});
// export const chatZodSchema = z.object({
//   createdAt: z.date(),
//   updatedAt: z.date(),
//   messages: z.array(messageZodSchema),
//   name: z.string(),
//   lasMessage: z.string(),
//   lastMessageDate: z.date()
// });
