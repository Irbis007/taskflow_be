import { getActivityDto } from "../dtos/activityDto";
import { ApiError } from "../exceptions/api-error";
import activityModel from "../models/activity-model";
import { CreateActivity } from "../types";

const createActivity = async (activityData: CreateActivity) => {
  const activity = await activityModel.create({ ...activityData });
  if (!activity) {
    throw ApiError.BadRequest("Cannot create activity");
  }
  const activityDto = await getActivityDto(activity);

  return activityDto;
};

const getActivitiesForEntity = async (id: string) => {
  const activities = await activityModel
    .find({ entityId: id })
    .sort({ createdAt: -1 })
    .limit(10);

  const activitiesDto = await Promise.all(
    activities.map((item) => getActivityDto(item)),
  );
  return activitiesDto;
};

const getAllActivities = async () => {
  const activities = await activityModel
    .find()
    .sort({ createdAt: -1 })
    .limit(10);

  const activitiesDto = await Promise.all(
    activities.map((item) => getActivityDto(item)),
  );
  return activitiesDto;
};

export const activityService = {
  createActivity,
  getActivitiesForEntity,
  getAllActivities,
};
