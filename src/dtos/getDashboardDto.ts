import activityModel from "../models/activity-model";
import projectModel from "../models/project-model";
import taskModel from "../models/task-model";
import userModel from "../models/user-model";
import { DashboardData, WeekActivity } from "../types/dashboard";
import { getStartAndEndWeek } from "../utils/getStartAndEndWeek";

import { Model } from "mongoose";
import { getActivityDto } from "./activityDto";

const dayOfWeek = ["Mon", "Thu", "Wed", "Tho", "Fri", "Sut", "Sun"];

const getDifference = async <T>(model: Model<T>, options?: object) => {
  const thisWeek = getStartAndEndWeek();
  const lastWeek = getStartAndEndWeek(1);
  return Promise.all([
    model.countDocuments({
      ...options,
      createdAt: {
        $gte: thisWeek.start,
        $lt: thisWeek.end,
      },
    }),

    model.countDocuments({
      ...options,
      createdAt: {
        $gte: lastWeek.start,
        $lt: lastWeek.end,
      },
    }),
  ]);
};

const getActivityThisWeek = async () => {
  const { start, end } = getStartAndEndWeek();
  const result = await taskModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start,
          $lt: end,
        },
      },
    },
    {
      $group: {
        _id: {
          $isoDayOfWeek: "$createdAt",
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  let res = {} as WeekActivity;

  dayOfWeek.forEach((day, index) => {
    res[day as keyof WeekActivity] =
      result.find((item) => item._id === index)?.count ?? 0;
  });

  return res;
};

export const getDashboardDto = async (): Promise<DashboardData> => {
  const [projectsThisWeek, projectsLastWeek] = await getDifference(
    projectModel,
    {
      status: "active",
    },
  );
  const projectDifference = projectsThisWeek - projectsLastWeek;

  const [tasksThisWeek, tasksLastWeek] = await getDifference(taskModel);
  const tasksDifference = tasksThisWeek - tasksLastWeek;
  const [tasksIPThisWeek, tasksIPLastWeek] = await getDifference(taskModel, {
    status: "in progress",
  });
  const tasksIPDifference = tasksIPThisWeek - tasksIPLastWeek;

  const activityThisWeek = await getActivityThisWeek();

  const tasks = await taskModel.find();

  const tasksByStatus: Record<string, number> = {};

  tasks.forEach((item) => {
    tasksByStatus[item.status] = (tasksByStatus[item.status] ?? 0) + 1;
  });

  const [membersThisWeek, membersLastWeek] = await getDifference(userModel);
  const membersDifference = membersThisWeek - membersLastWeek;

  const activity = await activityModel.find().limit(7);
  const activityDto = await Promise.all(
    activity.map((item) => getActivityDto(item)),
  );
  return {
    projects: {
      total: projectsThisWeek,
      difference: projectDifference,
    },
    taskActivity: {
      total: tasksThisWeek,
      difference: tasksDifference,
    },
    inProgress: {
      total: tasksIPThisWeek,
      difference: tasksIPDifference,
    },
    members: {
      total: membersThisWeek,
      difference: membersDifference,
    },
    weekActivity: activityThisWeek,
    tasksByStatus,

    recentTask: tasks.slice(0, 7).map((item) => ({
      id: item._id,
      priority: item.priority,
      title: item.title,
    })),
    lastActivity: activityDto,
  };
};
