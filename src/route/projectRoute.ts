import express from "express";
import { projectController } from "../controllers/projectController";
import authMiddleware from "../middlewares/auth-middleware";
import { taskController } from "../controllers/taskController";
import { activityController } from "../controllers/activityController";

const route = express();

route.get("/projects", authMiddleware, projectController.getProjects);
route.post("/projects", authMiddleware, projectController.createProject);
route.get("/projects/:id", authMiddleware, projectController.getProject);
route.put("/projects/:id", authMiddleware, projectController.editProject);
route.delete("/projects/:id", authMiddleware, projectController.deleteProject);
route.get(
  "/projects/:id/overview",
  authMiddleware,
  projectController.getProjectOverview,
);
route.get("/projects/:id/tasks", authMiddleware, taskController.getTask);
route.get(
  "/projects/:id/members",
  authMiddleware,
  projectController.getProjectMembers,
);
route.get(
  "/projects/:id/activity",
  authMiddleware,
  activityController.getActivitiesForEntity,
);

export const projectRoute = route;
