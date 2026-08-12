import { NextFunction, Response, Request } from "express";
import { tagService } from "../service/tag-service";

const getTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tags = await tagService.getTags();

    return res.json(tags);
  } catch (e) {
    return next(e);
  }
};

const createTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tag = await tagService.createTag(req.body);
    return res.json(tag);
  } catch (e) {
    return next(e);
  }
};

export const tagController = {
  getTags,
  createTag,
};
