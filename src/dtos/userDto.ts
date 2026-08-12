import { Types } from "mongoose";
import userModel from "../models/user-model";
import { FullUser, User } from "../types";
import projectModel from "../models/project-model";
import taskModel from "../models/task-model";
import activityModel from "../models/activity-model";
import { getActivityDto } from "./activityDto";

type UserType = User & {
  isActivated: boolean;
};

export function getUserDto(
  model: InstanceType<typeof userModel>,
  withoutActivation?: boolean,
): User | UserType {
  return {
    email: model.email || "",
    id: model._id,
    name: model.name,
    surname: model.surname,
    color: model.color,
    role: model.role,
    ...(withoutActivation
      ? {
          isActivated: model.isActivated,
        }
      : {}),
  };
}

export async function getFullUserDto(
  model: InstanceType<typeof userModel>,
): Promise<FullUser> {
  const tasks = await taskModel.countDocuments({
    assignees: model._id,
    status: "Done",
  });
  const activities = await activityModel
    .find({ author: model._id })
    .sort({ createdAt: -1 })
    .limit(5);
  const projects = await projectModel.find({
    "members.id": model._id,
  });
  const projectsDto = await Promise.all(
    projects.map((item) => getFullUserProjectDto(item, model._id)),
  );
  const activitiesDto = await Promise.all(
    activities.map((item) => getActivityDto(item)),
  );

  const [stats] = await taskModel.aggregate([
    {
      $match: {
        status: "Done",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        onTime: {
          $sum: {
            $cond: [{ $lte: ["$timeSpend", "$estimate"] }, 1, 0],
          },
        },
      },
    },
  ]);

  return {
    email: model.email || "",
    id: model._id,
    name: model.name,
    surname: model.surname,
    color: model.color,
    role: model.role,
    tasksDone: tasks,
    timeZone: model.timeZone,
    projects: projectsDto,
    projectsCount: projects.length,
    lastActivities: activitiesDto,
    lastActivityTime: model.lastActivityTime,
    joinedDate: model.joinedDate,
    location: model.location,
    roleTitle: model.roleTitle,
    completedTasksRate:
      (stats?.total === 0
        ? 0
        : Math.round((stats?.onTime / stats?.total) * 100)) || 0,
  };
}

async function getFullUserProjectDto(
  model: InstanceType<typeof projectModel>,
  authorId: Types.ObjectId,
): Promise<FullUser["projects"][number]> {
  const tasks = await taskModel.find({
    project: model._id,
    assignees: authorId,
  });

  const role =
    model.members.find((item) => item._id === authorId)?.role || "Member";
  return {
    projectRole: role,
    assignedTasks: tasks.length,
    id: model._id,
    color: model.color,
    name: model.name,
  };
}
