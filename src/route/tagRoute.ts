import express from "express";
import { tagController } from "../controllers/tagController";

const route = express();

route.get("/tags", tagController.getTags);
route.post("/tags", tagController.createTag);

export const tagRoute = route;
