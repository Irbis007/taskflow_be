import { getKanbanTaskDto, getSingleTaskDto } from "../dtos/taskDto";
import { ApiError } from "../exceptions/api-error";
import projectModel from "../models/project-model";
import taskModel from "../models/task-model";
import { User } from "../types";
import { CreateTask, Task } from "../types/Task";
import { activityService } from "./activity-service";

type GetTasksQuery = {
  priority?: "Hight";
  assignee?: string;
  projectId?: string;
};

const getTasks = async (query: GetTasksQuery) => {
  const filter: {
    priority?: "Hight";
    assignees?: string;
    project?: string;
  } = { ...query };

  const tasks = await taskModel.find(filter);
  if (!tasks) {
    throw ApiError.BadRequest("Error while getting tasks");
  }
  const tasksDto = await Promise.all(
    tasks.map(async (task) => await getKanbanTaskDto(task)),
  );
  return tasksDto;
};

const getTask = async (id: string) => {
  const task = await taskModel.findById(id);
  if (!task) {
    throw ApiError.BadRequest("Error while getting tasks");
  }
  const taskDto = await getSingleTaskDto(task);
  return taskDto;
};

const createTask = async (taskData: CreateTask, author: User) => {
  const task = await taskModel.create({ ...taskData });
  if (!task) {
    throw ApiError.BadRequest("Error while creating tasks");
  }
  const parentProject = await projectModel.findById(task.project);
  if (!parentProject) {
    throw ApiError.BadRequest(
      `Error while creating tasks: There is no project with this id: ${task.project}`,
    );
  }
  if (task?.parentTask) {
    const parentTask = await taskModel.findById(task.parentTask);
    if (!parentTask) {
      throw ApiError.BadRequest("cannot find parent task");
    }
    parentTask.subtasks = [...parentTask.subtasks, task.id];
    await parentTask.save();
  }

  await activityService.createActivity({
    action: "created",
    entityId: task._id,
    entityType: "Task",
    author: author.id,
  });

  task.author = author.id;
  await task.save();
  parentProject.tasks.push(task.id);
  await parentProject.save();

  const taskDto = getSingleTaskDto(task);
  return taskDto;
};
const partialUpdateTask = async (taskData: Partial<Task>, id: string) => {
  const task = await taskModel.findByIdAndUpdate(id, taskData, {
    returnDocument: "after",
  });
  if (!task) {
    throw ApiError.BadRequest("Error while creating tasks");
  }

  if ("isCompleted" in taskData) {
    task.status = taskData.isCompleted ? "Done" : "To Do";
  }
  if ("status" in taskData) {
    task.isCompleted = taskData.status === "Done";
  }

  await task.save();

  const taskDto = getSingleTaskDto(task);
  return taskDto;
};

const deleteTask = async (id: string) => {
  const task = await taskModel.findById(id);
  if (!task) {
    throw ApiError.BadRequest("Cannot delete task");
  }
  if (task.status === "Done") {
    throw ApiError.BadRequest("Cannot delete completed task");
  }
  task.isDeleted = true;
  task.deletedDate = new Date();
  task.save();
};

export const taskService = {
  getTasks,
  createTask,
  getTask,
  partialUpdateTask,
  deleteTask,
};
