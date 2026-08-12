import { getChatDto } from "../dtos/chatDto";
import { getMessageDto } from "../dtos/getMessageDto";
import { ApiError } from "../exceptions/api-error";
import chatModel from "../models/chat-model";
import messageModel from "../models/message-model";
import { Message } from "../types";

const getChatMessages = async (id: string) => {
  let chat = await chatModel.findById(id);
  if (!chat) {
    chat = await chatModel.create({
      members: [id],
    });
  }
  const messages = await messageModel.find({ chat: chat._id });

  const messageDto = await Promise.all(
    messages.map((item) => getMessageDto(item)),
  );

  return messageDto;
};

const createMessage = async (messageData: Message) => {
  const message = await messageModel.create({ ...messageData });

  if (!message) {
    throw ApiError.BadRequest("Cannot create message");
  }

  const messageDto = await getMessageDto(message);

  return messageDto;
};

export const messageService = {
  getChatMessages,
  createMessage,
};
