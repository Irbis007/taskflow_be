import { Message } from "./../types/message";
import userModel from "../models/user-model";
import chatModel from "../models/chat-model";
import {
  getChatDto,
  getEmptyChatDto,
  getChatDtoWithMessages,
} from "../dtos/chatDto";
import { ApiError } from "../exceptions/api-error";
import messageModel from "../models/message-model";
import { ObjectIdToString } from "mongoose";
import { getMessageDto } from "../dtos";

const getAllChats = async (userId: string) => {
  const users = await userModel.find();
  const chats = await chatModel.find({ members: userId });
  const availableUsers = users.filter(
    (u) =>
      !u._id.equals(userId) &&
      !chats.some((c) => c.members.some((m) => m.equals(u._id))),
  );
  const chatsDto = await Promise.all(
    chats.map((item) => getChatDto(item, userId)),
  );
  const uncreatedChats = await Promise.all(
    availableUsers.map((item) => getEmptyChatDto(item)),
  );
  return {
    groups: [],
    chats: [...chatsDto, ...uncreatedChats],
  };
};

const getOneChat = async (chatId: string, userId: string) => {
  const chat = await chatModel.findById(chatId);
  if (!chat) {
    throw ApiError.BadRequest(`cannot get chat: ${chatId}`);
  }
  const chatDto = getChatDtoWithMessages(chat, userId);
  return chatDto;
};

const createChat = async (data: { members: string[] }, id: string) => {
  const chat = await chatModel.create({
    members: [...data.members, id],
    type: data.members.length > 1 ? "group" : "direct",
  });

  const chatDto = await getChatDto(chat, id);
  return chatDto;
};

const createMessage = async (
  data: Omit<ObjectIdToString<Message>, "id" | "createdAt" | "updatedAt">,
  userId: string,
) => {
  const message = await messageModel.create({
    ...data,
    author: userId,
    status: "sent",
    chat: data.chatId,
  });
  const messageDto = getMessageDto(message);
  return messageDto;
};

export const chatServices = {
  getAllChats,
  getOneChat,
  createChat,
  createMessage,
};
