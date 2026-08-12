import { NextFunction, Response, Request } from "express";
import { ApiError } from "../exceptions/api-error";
import { projectService } from "../service/project-service";
import { decodeJwt } from "../utils/jwtDecode";

const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectsData = await projectService.getProjects();
    return res.json(projectsData);
  } catch (e) {
    return next(e);
  }
};
const getProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const projectsData = await projectService.getProject(id);
    return res.json(projectsData);
  } catch (e) {
    return next(e);
  }
};

const editProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const projectsData = await projectService.editProject(id, req.body);
    return res.json(projectsData);
  } catch (e) {
    return next(e);
  }
};

// TODO: Create deletion for assigned tasks
const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await projectService.deleteProject(id);
    return res.json({ message: `project with id: ${id} deleted` });
  } catch (e) {
    return next(e);
  }
};

const getProjectOverview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const projectsData = await projectService.getProjectOverview(id);
    return res.json(projectsData);
  } catch (e) {
    return next(e);
  }
};

const getProjectMembers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const membersData = await projectService.getProjectMembers(id);
    return res.json(membersData);
  } catch (e) {
    return next(e);
  }
};

const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const author = decodeJwt(req.cookies?.refreshToken);
    if (!author) {
      throw ApiError.BadRequest("something went wrong when creating project");
    }
    const projectData = await projectService.createProject({
      ...req.body,
      author: author.id,
    });
    return res.json(projectData);
  } catch (e) {
    return next(e);
  }
};

export const projectController = {
  getProjects,
  createProject,
  getProject,
  getProjectOverview,
  getProjectMembers,
  editProject,
  deleteProject,
};
