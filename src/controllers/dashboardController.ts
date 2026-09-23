import { NextFunction, Response, Request } from "express";
import { getDashboardDto } from "../dtos/getDashboardDto";

const getData = async (req: Request, res: Response, next: NextFunction) => {
  const dto = await getDashboardDto();
  return res.json(dto);
};

export const dashboardController = { getData };
