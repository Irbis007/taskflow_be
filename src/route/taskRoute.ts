import express from "express";
import { taskController } from "../controllers/taskController";
import { commentController } from "../controllers/commentController";
import { activityController } from "../controllers/activityController";

const route = express();

route.get("/tasks", taskController.getTasks);
route.get("/tasks/:id", taskController.getTask);
route.post("/tasks", taskController.createTask);
route.patch("/tasks/:id", taskController.partialUpdateTask);

route.get("/tasks/:taskId/comments", commentController.getComments);
route.post("/tasks/:taskId/comments", commentController.createComment);
route.patch("/tasks/:taskId/comments/:id", commentController.updateComment);
route.get("/tasks/:id/activity", activityController.getActivitiesForEntity);

export const taskRoute = route;
