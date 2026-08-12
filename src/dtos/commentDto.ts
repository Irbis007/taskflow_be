import { Comment } from "../types";
import commentModel from "../models/comment-model";
import userModel from "../models/user-model";
import { ApiError } from "../exceptions/api-error";
import { getUserDto } from "./userDto";

type CommentDto = Omit<Comment, "entityId" | "entityType">;

export const getCommentDto = async (
  model: InstanceType<typeof commentModel> | null,
): Promise<CommentDto> => {
  const user = await userModel.findById(model?.author);
  if (!user) {
    throw ApiError.BadRequest(`Cannot get user for comment: ${model?._id}`);
  }
  const author = getUserDto(user, true);
  return model
    ? {
        message: model.message,
        id: model._id,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
        author,
        isEdited: model.isEdited,
      }
    : ({} as CommentDto);
};
