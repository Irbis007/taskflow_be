import express from "express";
import { projectController } from "../controllers/projectController";
import authMiddleware from "../middlewares/auth-middleware";
import { searchController } from "../controllers/searchController";

const route = express();

route.get("/search", searchController.getSearch);

export const searchRoute = route;
