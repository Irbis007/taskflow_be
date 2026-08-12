import jwt from "jsonwebtoken";
import { User } from "../types";

export const decodeJwt = (refreshToken?: string | null) => {
  if (!refreshToken) return null;
  const userData = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET || "",
  );

  if (typeof userData === "string") {
    return null;
  }

  return userData as User;
};
