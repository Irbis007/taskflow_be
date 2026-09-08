import { ObjectIdToString } from "mongoose";
import { getMessageDto } from "../dtos";
import { getChatDto, getChatItemDto, getEmptyChatDto } from "../dtos/chatDto";
import { ApiError } from "../exceptions/api-error";
import chatModel from "../models/chat-model";
import messageModel from "../models/message-model";
import userModel from "../models/user-model";
import { Message } from "./../types/message";

type GetChatsQuery = {
  name?: string;
};

const getAllChats = async (userId: string, query: GetChatsQuery) => {
  const filter: Record<string, any> = {};

  if (query.name) {
    filter.name = {
      $regex: query.name,
      $options: "i",
    };
  }
  const users = await userModel.find(filter);
  const allChats = await chatModel.find({ members: userId, ...filter }).sort({
    lastMessageAt: -1,
  });

  const chatsDto = await Promise.all(
    allChats.map((item) => getChatItemDto(item, userId)),
  );

  const availableUsers = users.filter(
    (u) =>
      !u._id.equals(userId) &&
      !allChats.some((c) => c.members.some((m) => m.equals(u._id))),
  );
  const uncreatedChats = await Promise.all(
    availableUsers.map((item) => getEmptyChatDto(item)),
  );

  return {
    groups: [],
    chats: [
      ...chatsDto.sort((a, b) => Number(b.pinned) - Number(a.pinned)),
      ...uncreatedChats,
    ],
  };
};

const getOneChat = async (chatId: string, userId: string) => {
  const chat = await chatModel.findById(chatId);
  if (!chat) {
    throw ApiError.BadRequest(`cannot get chat: ${chatId}`);
  }
  const chatDto = getChatDto(chat, userId);
  return chatDto;
};

const createChat = async (data: { members: string[] }, userId: string) => {
  const chat = await chatModel.create({
    members: [...data.members, userId],
    type: data.members.length > 1 ? "group" : "direct",
  });

  const chatDto = await getChatItemDto(chat, userId);
  return chatDto;
};

const editChat = async (
  chatId: string,
  userId: string,
  data: { pinned: boolean; chatName: string },
) => {
  const { pinned, ...chatData } = data;
  const chat = await chatModel.findByIdAndUpdate(chatId, chatData, {
    returnDocument: "after",
  });
  const user = await userModel.findById(userId);

  if (user && (pinned != undefined || pinned != null)) {
    const isPinned = user.pinnedChats.some((c) => c.toString() === chatId);

    if (isPinned) {
      await userModel.findByIdAndUpdate(userId, {
        $pull: { pinnedChats: chatId },
      });
    } else {
      await userModel.findByIdAndUpdate(userId, {
        $addToSet: { pinnedChats: chatId },
      });
    }
  }

  if (!chat) {
    throw ApiError.BadRequest("sssssssss");
  }

  const chatDto = await getChatDto(chat, userId);
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
  await chatModel.findByIdAndUpdate(data.chatId, {
    lastMessageAt: message.createdAt,
  });

  const messageDto = getMessageDto(message);
  return messageDto;
};

export const chatServices = {
  getAllChats,
  getOneChat,
  createChat,
  createMessage,
  editChat,
};
