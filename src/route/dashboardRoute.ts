import express from "express";
import { dashboardController } from "../controllers/dashboardController";
const route = express();

route.get("/dashboard", dashboardController.getData);

export const dashboardRoute = route;
