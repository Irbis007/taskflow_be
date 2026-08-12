import { ApiError } from "../exceptions/api-error";
import activityModel from "../models/activity-model";
import projectModel from "../models/project-model";
import taskModel from "../models/task-model";
import userModel from "../models/user-model";
import { ActivityDto } from "../types";
import { getUserDto } from "./userDto";

export const getActivityDto = async (
  model: InstanceType<typeof activityModel>,
): Promise<ActivityDto> => {
  const author = await userModel.findById(model.author);
  const invitedUser = await userModel.findById(model?.invitedUser);

  let entityTitle: string;

  if (model.entityType === "Task") {
    const task = await taskModel.findById(model.entityId);
    if (!task) {
      throw ApiError.BadRequest("Cannot find task for activity");
    }
    entityTitle = task.title;
  } else {
    const project = await projectModel.findById(model.entityId);
    if (!project) {
      throw ApiError.BadRequest("Cannot find project for activity");
    }
    entityTitle = project.name;
  }

  if (!author || (!invitedUser && model?.invitedUser)) {
    throw ApiError.BadRequest("Cannot get user form activity");
  }
  const authorDto = getUserDto(author, true);
  const invitedUserDto = invitedUser
    ? getUserDto(invitedUser, true)
    : undefined;

  return {
    action: model.action,
    entityId: model.entityId,
    entityType: model.entityType,
    metadata: model.metadata,
    author: authorDto,
    invitedUser: invitedUserDto,
    id: model._id,
    entityTitle,
    createdAt: model.createdAt,
  };
};
