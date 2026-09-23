import projectModel from "../models/project-model";
import taskModel from "../models/task-model";

const getSearch = async (search: string) => {
  const tasks = await taskModel
    .find({
      title: {
        $regex: search || "",
        $options: "i",
      },
    })
    .limit(10)
    .lean();
  const projects = await projectModel
    .find({
      name: {
        $regex: search,
        $options: "i",
      },
    })
    .limit(10)
    .lean();

  const tasksDto = tasks.map((item) => ({
    title: item.title,
    id: item._id,
  }));
  const projectsDto = projects.map((item) => ({
    title: item.name,
    id: item._id,
  }));

  return {
    tasks: tasksDto,
    projects: projectsDto,
  };
};

export const searchService = {
  getSearch,
};
