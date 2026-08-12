import { ApiError } from "../exceptions/api-error";
import messageModel from "../models/message-model";
import userModel from "../models/user-model";
import { MessageOutput } from "../types";
import { getUserDto } from "./userDto";

export const getMessageDto = async (
  model: InstanceType<typeof messageModel>,
): Promise<MessageOutput> => {
  const user = await userModel.findById(model.author);
  if (!user) {
    throw ApiError.BadRequest("cannot find user");
  }
  const author = getUserDto(user, true);
  return {
    id: model._id,
    status: model.status,
    message: model.message,
    author,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
    chatId: model.chat,
  };
};
