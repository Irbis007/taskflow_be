import { ApiError } from "../exceptions/api-error";
import {
  getProjectDto,
  getProjectOverviewDto,
  getSingleProjectDto,
} from "../dtos/projectDto";
import projectModel from "../models/project-model";
import { ProjectCreate, ProjectEdit } from "../types/Project";
import { activityService } from "./activity-service";
import { getUserDto } from "../dtos";
import userModel from "../models/user-model";
import taskModel from "../models/task-model";

const getProjects = async () => {
  const projects = await projectModel.find({ isDeleted: false });
  if (!projects) {
    throw ApiError.BadRequest("Error while getting projects");
  }
  const projectsDto = await Promise.all(
    projects.map((project) => getProjectDto(project)),
  );

  return projectsDto;
};

const getProject = async (id: string) => {
  const project = await projectModel.findById(id);
  if (!project) {
    throw ApiError.BadRequest(`Error while getting project:`);
  }
  const projectDto = getSingleProjectDto(project);

  return projectDto;
};

const editProject = async (id: string, projectData: ProjectEdit) => {
  const project = await projectModel.findByIdAndUpdate(
    id,
    {
      ...projectData,
      members: projectData.members?.map((item) => ({
        id: item,
        role: "Member",
      })),
    },
    {
      returnDocument: "after",
    },
  );
  if (!project) {
    throw ApiError.BadRequest(`Error while getting project:`);
  }
  const projectDto = getSingleProjectDto(project);

  return projectDto;
};

const deleteProject = async (id: string) => {
  await projectModel.findByIdAndUpdate(id, {
    isDeleted: true,
    deletedDate: new Date(),
  });
  await taskModel.updateMany(
    { project: id },
    { isDeleted: true, deletedData: new Date() },
  );
};

const getProjectOverview = async (id: string) => {
  const project = await projectModel.findById(id);
  if (!project) {
    throw ApiError.BadRequest(`Error while getting project:`);
  }
  const projectDto = getProjectOverviewDto(project);

  return projectDto;
};

const getProjectActivity = async (id: string) => {
  const project = await projectModel.findById(id);
  if (!project) {
    throw ApiError.BadRequest(`Error while getting project:`);
  }
  const projectDto = getSingleProjectDto(project);

  return projectDto;
};

const getProjectMembers = async (id: string) => {
  const project = await projectModel.findById(id);
  if (!project) {
    throw ApiError.BadRequest(`Error while getting project:`);
  }
  const tasks = await taskModel.find({
    assignees: { $in: project.members.map((item) => item.id) },
  });
  const users = await userModel.find({ _id: { $in: project.members } });
  const usersDto = await Promise.all(users.map((item) => getUserDto(item)));

  const data = usersDto.map((item) => ({
    ...item,
    assignedTasks: tasks.filter((t) => t.assignees?.includes(item.id)).length,
  }));
  return data;
};
const createProject = async (projectData: ProjectCreate) => {
  const users = await userModel
    .find({
      _id: {
        $in: projectData.members,
      },
    })
    .lean();

  const project = await projectModel.create({
    ...projectData,
    members: users.map((item) => ({ id: item._id })),
  });
  if (!project) {
    throw ApiError.BadRequest("Error while creating projects");
  }
  await activityService.createActivity({
    action: "created",
    entityId: project._id,
    entityType: "Project",
    author: projectData.author,
  });
  const projectDto = getProjectDto(project);
  return projectDto;
};

export const projectService = {
  getProjects,
  createProject,
  getProject,
  getProjectOverview,
  getProjectActivity,
  getProjectMembers,
  editProject,
  deleteProject,
};
