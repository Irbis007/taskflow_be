import { ApiError } from "../exceptions/api-error";
import chatModel from "../models/chat-model";
import messageModel from "../models/message-model";
import userModel from "../models/user-model";
import { getMessageDto } from "./getMessageDto";
import { getUserDto } from "./userDto";
export const getGroupDto = async (
  model: InstanceType<typeof chatModel>,
  curId?: string,
) => {
  const lastMessage = await messageModel.findOne({ chat: model._id });
  const lastMessageDto = lastMessage
    ? await getMessageDto(lastMessage)
    : undefined;
  return {
    lastMessage: lastMessageDto,
    chatId: model._id,
    members: model.members,
    chatName: "",
  };
};

export async function getChatDto(
  model: InstanceType<typeof chatModel>,
  id: string,
) {
  const companionId = model.members.filter((c) => c._id.toString() != id);
  const companion = await userModel.findById(companionId);
  if (!companion) {
    throw ApiError.BadRequest(`cannot find companion for chat: ${model._id}`);
  }

  const lastMessage = await messageModel.findOne({ chat: model._id });
  const lastMessageDto = lastMessage
    ? await getMessageDto(lastMessage)
    : undefined;

  return {
    chatName: `${companion.name} ${companion.surname.charAt(0)}`,
    chatId: model._id,
    avatar: `${companion.name.charAt(0)}${companion.surname.charAt(0)}`,
    companion: getUserDto(companion, true),
    lastMessage: lastMessageDto,
  };
}

export async function getChatDtoWithMessages(
  model: InstanceType<typeof chatModel>,
  id: string,
) {
  const companionId = model.members.filter((c) => c._id.toString() != id);
  const companion = await userModel.findById(companionId);
  if (!companion) {
    throw ApiError.BadRequest(`cannot find companion for chat: ${model._id}`);
  }

  const chatMessages = await messageModel.find({ chat: model._id });
  const messagesDto = await Promise.all(
    chatMessages.map((item) => getMessageDto(item)),
  );

  return {
    chatName: `${companion.name} ${companion.surname.charAt(0)}`,
    chatId: model._id,
    avatar: `${companion.name.charAt(0)}${companion.surname.charAt(0)}`,
    companion: getUserDto(companion, true),
    messages: messagesDto,
  };
}

export async function getEmptyChatDto(model: InstanceType<typeof userModel>) {
  return {
    chatName: `${model.name} ${model.surname.charAt(0)}`,
    chatId: null,
    avatar: `${model.name.charAt(0)}${model.surname.charAt(0)}`,
    companion: getUserDto(model, true),
  };
}
