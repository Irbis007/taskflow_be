import { z } from "zod";
import { userZodSchema } from "./user";
import { colorsEnum } from "./helpers";

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
  id: z.string(),
  pinned: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const chatItemZodSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  chatName: z.string(),
  lastMessage: messageZodSchema,
  id: z.string(),
  companion: userZodSchema,
  pinned: z.boolean(),
});
export const groupItemZodSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  chatName: z.string(),
  lastMessage: messageZodSchema,
  id: z.string(),
  chatColor: colorsEnum,
  pinned: z.boolean(),
});
export const groupZodSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  chatName: z.string(),
  lastMessage: messageZodSchema,
  id: z.string(),
  chatColor: colorsEnum,
  pinned: z.boolean(),
});

export const editChaZodSchema = z.object({
  chatName: z.string().optional(),
  pinned: z.boolean().optional(),
});
// export const chatZodSchema = z.object({
//   createdAt: z.date(),
//   updatedAt: z.date(),
//   messages: z.array(messageZodSchema),
//   name: z.string(),
//   lasMessage: z.string(),
//   lastMessageDate: z.date()
// });
