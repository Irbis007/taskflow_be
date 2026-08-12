import { NextFunction, Response, Request } from "express";
import { activityService } from "../service/activity-service";
import { getId } from "../utils/getId";

const getActivitiesForEntity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = getId(req.params.id);
    const activities = await activityService.getActivitiesForEntity(id);
    return res.json(activities);
  } catch (e) {
    return next(e);
  }
};

const getAllActivities = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const activities = await activityService.getAllActivities();
    return res.json(activities);
  } catch (e) {
    return next(e);
  }
};

export const activityController = {
  getActivitiesForEntity,
  getAllActivities,
};
