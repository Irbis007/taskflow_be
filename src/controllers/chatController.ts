import { Request, Response, NextFunction } from "express";
import { userServices } from "../service/user-service";
import { getId, getUserId } from "../utils/getId";
import { decodeJwt } from "../utils/jwtDecode";
import { chatServices } from "../service/chat-services";
import { ApiError } from "../exceptions/api-error";

const getChats = async (req: Request, res: Response, next: NextFunction) => {
  const userId = getUserId(req);
  const chats = await chatServices.getAllChats(userId, req.query);
  return res.json(chats);
};

const getChat = async (req: Request, res: Response, next: NextFunction) => {
  const id = getId(req.params.id);
  const userId = getUserId(req);
  const chatData = await chatServices.getOneChat(id, userId);
  return res.json(chatData);
};

const createChat = async (req: Request, res: Response, next: NextFunction) => {
  const userId = getUserId(req);
  const chatData = await chatServices.createChat(req.body, userId);
  return res.json(chatData);
};

const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = getUserId(req);
  const users = await chatServices.createMessage(req.body, userId);
  return res.json(users);
};

const editChat = async (req: Request, res: Response, next: NextFunction) => {
  const userId = getUserId(req);
  const chatId = getId(req.params.id);
  const chat = await chatServices.editChat(chatId, userId, req.body);
  return res.json(chat);
};

export const chatController = {
  getChats,
  getChat,
  createChat,
  createMessage,
  editChat,
};
