import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import tokenModel from "../models/token-model";

const generateToken = async (payload: object) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET || "", {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || "", {
    expiresIn: "30d",
  });
  return {
    accessToken,
    refreshToken,
  };
};

const saveToken = async (userId: Types.ObjectId, refreshToken: string) => {
  const tokenData = await tokenModel.findOne({ user: userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    tokenData.save();
  }
  const token = await tokenModel.create({ user: userId, refreshToken });
  return token;
};

const removeToken = async (refreshToken: string) => {
  const tokenData = await tokenModel.deleteOne({ refreshToken });
  return tokenData;
};
const findToken = async (refreshToken: string) => {
  const tokenData = await tokenModel.findOne({ refreshToken });
  return tokenData;
};

const validateAccessToken = (token: string) => {
  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "");

    if (typeof userData === "string") {
      return null;
    }

    return userData;
  } catch (e) {
    console.log(e);
    return null;
  }
};
const validateRefreshToken = (token: string) => {
  try {
    const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET || "");
    return userData as jwt.JwtPayload;
  } catch (e) {
    return null;
  }
};

export const tokenService = {
  generateToken,
  saveToken,
  removeToken,
  validateAccessToken,
  validateRefreshToken,
  findToken,
};
