import express from "express";
import { userController } from "../controllers/userController";
const route = express();

route.get("/users", userController.getAllUsers);
route.get("/users/available-for-chat", userController.getUsersAvailableForChat);
route.get("/users/:id", userController.getUser);
route.patch("/users/:id", userController.editUser);

export const usersRoute = route;
