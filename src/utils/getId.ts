import jwt from "jsonwebtoken";
import { decodeJwt } from "./jwtDecode";
import { User } from "../types";

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
    console.log(e);
    return null;
  }
};
