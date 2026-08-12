import taskModel from "../models/task-model";
import { KanbanTaskDto, SingleTask, SubtaskRow, Task } from "../types/Task";
import projectModel from "../models/project-model";
import { ApiError } from "../exceptions/api-error";
import userModel from "../models/user-model";
import { getUserDto } from "./userDto";
import { getTagDto } from "./tagDto";
import tagModel from "../models/tag-model";

function formatDuration(minutes?: number) {
  if (!minutes) return undefined;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return `${h}h ${m}m`;
}

export const getKanbanTaskDto = async (
  model: InstanceType<typeof taskModel> | null,
): Promise<Partial<KanbanTaskDto>> => {
  const user = await userModel.findById(model?.author);
  const tags = await tagModel.find({
    _id: { $in: model?.tags },
  });

  const subtasks = await taskModel.find({ _id: { $in: model?.subtasks } });
  if (!user) {
    throw ApiError.BadRequest(
      `Cannot find author for this task:${model?._id} `,
    );
  }
  if (!tags) {
    throw ApiError.BadRequest(`Cannot find tags for this task:${model?._id} `);
  }
  const tagsDto = tags.map((item) => getTagDto(item));
  const author = getUserDto(user);

  return model
    ? {
        title: model.title,
        status: model.status,
        priority: model.priority,
        deadline: model.deadline,
        totalSubtasks: subtasks?.length,
        completedSubtasks: subtasks?.filter((t) => t.isCompleted).length,
        tags: tagsDto,
        id: model._id,
        author,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
      }
    : ({} as KanbanTaskDto);
};
export const getSingleTaskDto = async (
  model: InstanceType<typeof taskModel>,
): Promise<Partial<SingleTask>> => {
  const project = await projectModel.findById(model?.project);
  const user = await userModel.findById(model?.author);
  const subtasks = await taskModel.find({ _id: { $in: model?.subtasks } });
  const tags = await tagModel.find({ _id: { $in: model?.tags } });
  if (!project || !user) {
    throw ApiError.BadRequest("Error while getting project");
  }
  if (!tags) {
    throw ApiError.BadRequest(`Cannot find tags for this task:${model?._id} `);
  }
  const tagsDto = tags.map((item) => getTagDto(item));
  const subtasksDto = await Promise.all(
    subtasks.map((item) => getSubtaskRowDto(item)),
  );

  const author = getUserDto(user, true);
  const estimate = formatDuration(model.estimate);
  return model
    ? {
        title: model.title,
        status: model.status,
        priority: model.priority,
        deadline: model.deadline,
        assignees: model.assignees,
        isCompleted: model.isCompleted,
        tags: tagsDto,
        id: model._id,
        author: author,
        description: model.description,
        subtasks: subtasksDto,
        estimate: estimate,
        project: {
          id: model.id,
          name: project.name,
          color: project.color,
          icon: project.icon,
        },
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
      }
    : ({} as SingleTask);
};

export const getSubtaskRowDto = async (
  model: InstanceType<typeof taskModel> | null,
): Promise<SubtaskRow> => {
  const user = await userModel.findById(model?.author);
  if (!user) {
    throw ApiError.BadRequest("Error while getting project");
  }
  const author = getUserDto(user, true);
  return model
    ? {
        title: model.title,
        isCompleted: model.isCompleted,
        id: model._id,
        author: author,
      }
    : ({} as SubtaskRow);
};
