import { Response, Request, NextFunction } from "express";
import { getId } from "../utils/getId";
import { messageService } from "../service/message-service";

const getChatMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const chatId = getId(req.params.id);
    const messages = await messageService.getChatMessages(chatId);

    return res.json(messages);
  } catch (e) {
    return next(e);
  }
};

const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const chatId = getId(req.params.id);
    const message = await messageService.createMessage({
      chat: chatId,
      ...req.body,
    });

    return res.json(message);
  } catch (e) {
    return next(e);
  }
};

export const messageController = {
  getChatMessages,
  createMessage,
};
