import express from "express";
import { userController } from "../controllers/userController";
const route = express();

route.get("/users", userController.getAllUsers);
route.get("/users/available-for-chat", userController.getUsersAvailableForChat);
route.get("/users/:id", userController.getUser);
route.patch("/users/:id", userController.editUser);
route.post("/users/invite", userController.inviteUser);
route.post("/refresh-password", userController.resetPassword);
route.post("/2fa/setup", userController.setup2fa);
route.post("/2fa/enable", userController.enable2fa);

export const usersRoute = route;
