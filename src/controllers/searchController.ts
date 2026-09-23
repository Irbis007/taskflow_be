import { NextFunction, Response, Request } from "express";
import { searchService } from "../service/search-service";

const getSearch = async (req: Request, res: Response, next: NextFunction) => {
  const search = req.query?.search as string;
  const data = await searchService.getSearch(search);
  return res.json(data);
};

export const searchController = {
  getSearch,
};
