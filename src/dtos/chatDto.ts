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
    id: model._id,
    members: model.members,
    chatName: "",
  };
};

export async function getChatItemDto(
  model: InstanceType<typeof chatModel>,
  userId: string,
) {
  const companionId = model.members.filter((c) => c._id.toString() != userId);
  const user = await userModel.findById(userId).select("pinnedChats");
  const companion = await userModel.findById(companionId);
  if (!companion) {
    throw ApiError.BadRequest(`cannot find companion for chat: ${model._id}`);
  }

  const lastMessage = await messageModel
    .findOne({ chat: model._id })
    .sort({ createdAt: -1 });
  const lastMessageDto = lastMessage
    ? await getMessageDto(lastMessage)
    : undefined;

  return {
    chatName: `${companion.name} ${companion.surname.charAt(0)}`,
    id: model._id,
    avatar: `${companion.name.charAt(0)}${companion.surname.charAt(0)}`,
    companion: getUserDto(companion, true),
    lastMessage: lastMessageDto,
    pinned: user?.pinnedChats.some((id) => id.equals(model._id)),
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
  };
}

export async function getChatDto(
  model: InstanceType<typeof chatModel>,
  userId: string,
) {
  const companionId = model.members.filter((c) => c._id.toString() != userId);
  const companion = await userModel.findById(companionId);
  const user = await userModel.findById(userId).select("pinnedChats");
  if (!companion) {
    throw ApiError.BadRequest(`cannot find companion for chat: ${model._id}`);
  }

  const chatMessages = await messageModel.find({ chat: model._id });
  const messagesDto = await Promise.all(
    chatMessages.map((item) => getMessageDto(item)),
  );

  return {
    chatName: `${companion.name} ${companion.surname.charAt(0)}`,
    id: model._id,
    avatar: `${companion.name.charAt(0)}${companion.surname.charAt(0)}`,
    companion: getUserDto(companion, true),
    messages: messagesDto,
    pinned: user?.pinnedChats.some((id) => id.equals(model._id)),
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
  };
}

export async function getEmptyChatDto(model: InstanceType<typeof userModel>) {
  return {
    chatName: `${model.name} ${model.surname.charAt(0)}`,
    id: null,
    avatar: `${model.name.charAt(0)}${model.surname.charAt(0)}`,
    companion: getUserDto(model, true),
  };
}
