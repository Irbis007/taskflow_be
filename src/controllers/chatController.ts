import { Request, Response, NextFunction } from "express";
import { userServices } from "../service/user-service";
import { getId } from "../utils/getId";
import { decodeJwt } from "../utils/jwtDecode";
import { chatServices } from "../service/chat-services";
import { ApiError } from "../exceptions/api-error";
import { commentService } from "../service/comment-service";

const getChats = async (req: Request, res: Response, next: NextFunction) => {
  const user = decodeJwt(req.cookies.refreshToken);
  if (!user) {
    return {};
  }
  const chats = await chatServices.getAllChats(user.id.toString());
  return res.json(chats);
};

const getChat = async (req: Request, res: Response, next: NextFunction) => {
  const id = getId(req.params.id);
  const userId = decodeJwt(req.cookies.refreshToken)?.id;
  if (!userId) {
    throw ApiError.BadRequest("ssssdfg");
  }
  const chatData = await chatServices.getOneChat(id, userId.toString());
  return res.json(chatData);
};

const createChat = async (req: Request, res: Response, next: NextFunction) => {
  const userId = decodeJwt(req.cookies?.refreshToken)?.id.toString();
  console.log(userId);
  console.log(req.cookies?.refreshToken);
  if (!userId) {
    throw ApiError.BadRequest("ssssdfg");
  }
  const chatData = await chatServices.createChat(req.body, userId);
  return res.json(chatData);
};

const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = decodeJwt(req.cookies?.refreshToken)?.id.toString();
  if (!userId) {
    throw ApiError.BadRequest("ssssdfg");
  }
  const users = await chatServices.createMessage(req.body, userId);
  return res.json(users);
};

export const chatController = {
  getChats,
  getChat,
  createChat,
  createMessage,
};
