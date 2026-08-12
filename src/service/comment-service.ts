import { Types } from "mongoose";
import { getCommentDto } from "../dtos";
import { ApiError } from "../exceptions/api-error";
import commentModel from "../models/comment-model";
import { CreateComment, UpdateComment, User } from "../types";
import { activityService } from "./activity-service";

const getComments = async (entityId: string) => {
  const comments = await commentModel.find({ entityId });
  if (!comments) {
    throw ApiError.BadRequest(`cannot get comments for: ${entityId}`);
  }
  const commentsDto = await Promise.all(
    comments.map((item) => getCommentDto(item)),
  );
  return commentsDto;
};

const createComment = async (
  commentData: CreateComment,
  authorId: Types.ObjectId,
) => {
  const comment = await commentModel.create({
    ...commentData,
    author: authorId,
  });
  if (!comment) {
    throw ApiError.BadRequest("Cannot create comment");
  }
  await activityService.createActivity({
    action: "commented",
    entityId: commentData.entityId,
    entityType: commentData.entityType,
    author: authorId,
  });
  const commentDto = getCommentDto(comment);
  return commentDto;
};

const updateComment = async (commentData: UpdateComment, id: string) => {
  const comment = await commentModel.findByIdAndUpdate(
    id,
    { ...commentData },
    { returnDocument: "after" },
  );

  const commentDto = getCommentDto(comment);
  return commentDto;
};

export const commentService = {
  createComment,
  updateComment,
  getComments,
};
