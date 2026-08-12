import express from "express";
import { userController } from "../controllers/userController";
import { chatController } from "../controllers/chatController";
const route = express();

route.get("/chats", chatController.getChats);
route.post("/chats", chatController.createChat);
route.get("/chats/:id", chatController.getChat);
route.post("/chats/:id/messages", chatController.createMessage);

export const chatRouter = route;
