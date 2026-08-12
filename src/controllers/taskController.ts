import { NextFunction, Response, Request } from "express";
import { ApiError } from "../exceptions/api-error";
import { taskService } from "../service/task-services";
import { decodeJwt } from "../utils/jwtDecode";

const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasksData = await taskService.getTasks(req.query);

    return res.json(tasksData);
  } catch (e) {
    return next(e);
  }
};

const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params?.id)
      ? req.params?.id[0]
      : req.params?.id;
    const tasksData = await taskService.getTask(id);
    return res.json(tasksData);
  } catch (e) {
    return next(e);
  }
};

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    const author = decodeJwt(refreshToken);
    if (!author) {
      throw ApiError.BadRequest(
        "something went wrong when try to get user in create",
      );
    }
    const taskData = await taskService.createTask(req.body, author);
    return res.json(taskData);
  } catch (e) {
    return next(e);
  }
};

const partialUpdateTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id =
      typeof req.params.id === "string" ? req.params.id : req.params.id[0];
    const taskData = await taskService.partialUpdateTask(req.body, id);

    return res.json(taskData);
  } catch (e) {
    return next(e);
  }
};

const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id =
      typeof req.params.id === "string" ? req.params.id : req.params.id[0];
    await taskService.deleteTask(id);

    return res.json({ message: `task with id: ${id} deleted` });
  } catch (e) {
    return next(e);
  }
};

export const taskController = {
  getTasks,
  createTask,
  getTask,
  partialUpdateTask,
  deleteTask,
};
