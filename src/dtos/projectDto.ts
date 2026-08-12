import { HydratedDocument } from "mongoose";
import { ApiError } from "../exceptions/api-error";
import projectModel from "../models/project-model";
import taskModel from "../models/task-model";
import userModel from "../models/user-model";
import { Project } from "../types";
import { ProjectOverview, SingleProject } from "../types/Project";
import { getUserDto } from "./userDto";
import { ProjectTask, Task } from "../types/Task";
import tagModel from "../models/tag-model";
import activityModel from "../models/activity-model";
import { getActivityDto } from "./activityDto";

export const getProjectDto = async (
  model: InstanceType<typeof projectModel> | null,
): Promise<Partial<Project>> => {
  const user = await userModel.findById(model?.author);
  if (!user) {
    throw ApiError.BadRequest("There is no user");
  }
  const author = getUserDto(user);
  return model
    ? {
        name: model.name,
        icon: model.icon,
        description: model.description,
        color: model.color,
        status: model.status,
        deadline: model.deadline,
        members: model.members,
        id: model._id,
        author,
      }
    : ({} as Project);
};

export const getSingleProjectDto = async (
  model: InstanceType<typeof projectModel> | null,
): Promise<SingleProject> => {
  const tasks = await taskModel.find({
    _id: { $in: model?.tasks },
  });
  if (!tasks) {
    throw ApiError.BadRequest("There is No these tasks");
  }
  const tasksDto = tasks.map((item) => getProjectTaskDto(item));
  return model
    ? {
        name: model.name,
        icon: model.icon,
        description: model.description,
        color: model.color,
        status: model.status,
        deadline: model.deadline,
        id: model._id,
        totalTasks: tasksDto.length,
        tasksInProgress: tasks.filter((t) => t.status === "In progress").length,
        completedTasks: tasks.filter((t) => t.status === "Done").length,
      }
    : ({} as SingleProject);
};
export const getProjectOverviewDto = async (
  model: InstanceType<typeof projectModel>,
): Promise<ProjectOverview> => {
  const users = await userModel.find({
    _id: { $in: model.members.map((item) => item.id) },
  });
  const tags = await tagModel.find().lean();
  const tasks = await taskModel.find({ project: model._id }).lean();
  const activity = await activityModel
    .find({ entityId: model._id })
    .sort({ createdAt: -1 })
    .limit(3);

  const team = users.map((item) => ({
    ...getUserDto(item, true),
    projectRole: model.members.find((m) => m.id === item.id)?.role || "Member",
  }));

  const activitiesDto = await Promise.all(
    activity.map((item) => getActivityDto(item)),
  );

  const tagsMap = new Map(tags.map((tag) => [tag._id.toString(), tag]));

  const progressByCategories: ProjectOverview["progressByCategories"] = {};

  tasks.forEach((task) => {
    task.tags?.forEach((tagId) => {
      const tag = tagsMap.get(tagId.toString());

      if (!tag) return;
      if (!progressByCategories[tag.name]) {
        progressByCategories[tag.name] = {
          total: 0,
          completed: 0,
        };
      }
      progressByCategories[tag.name].total += 1;

      if (task.status === "Done") {
        progressByCategories[tag.name].completed += 1;
      }
    });
  });
  return model
    ? {
        team,
        recentActivity: activitiesDto,
        progressByCategories,
      }
    : ({} as ProjectOverview);
};

const getProjectTaskDto = (model: HydratedDocument<Task>): ProjectTask => {
  return model
    ? {
        title: model.title,
        priority: model.priority,
        deadline: model.deadline,
        assignees: model.assignees,
        isCompleted: model.isCompleted,
        tags: model.tags,
        id: model._id,
      }
    : ({} as ProjectTask);
};
