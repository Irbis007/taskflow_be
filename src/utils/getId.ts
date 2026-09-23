import jwt from "jsonwebtoken";
import { User } from "../types";
import { Request } from "express";
import { decodeJwt } from "./jwtDecode";
import { ApiError } from "../exceptions/api-error";

export const getId = (id: string | string[]): string => {
  return Array.isArray(id) ? id[0] : id;
};

export const getIdByAccessToken = (token: string) => {
  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "");
    if (typeof userData === "string") {
      return null;
    }

    return (userData as User).id;
  } catch (e) {
    return null;
  }
};

export const getUserId = (req: Request) => {
  const userId = decodeJwt(req.cookies?.refreshToken)?.id.toString();
  if (!userId) {
    throw ApiError.BadRequest(`cannot get user id`);
  }
  return userId;
};
