import userModel from "../models/user-model";
import bcrypt from "bcrypt";
import uuid from "uuid";
import { mailService } from "./mail-service";
import { tokenService } from "./token-service";
import { getUserDto } from "../dtos";
import { ApiError } from "../exceptions/api-error";
import tokenModel from "../models/token-model";
import { getFullUserDto } from "../dtos/userDto";
import chatModel from "../models/chat-model";
import { Schema } from "mongoose";

const registration = async (
  email: string,
  password: string,
  name: string,
  surname: string,
) => {
  const candidate = await userModel.findOne({ email });
  if (candidate) {
    throw ApiError.BadRequest("This email is already used with another user");
  }

  const hashPassword = await bcrypt.hash(password, 3);
  const activationLink = uuid.v4();
  const user = await userModel.create({
    email,
    name,
    surname,
    password: hashPassword,
    activationLink,
    color: "purple",
  });
  await mailService.sendActivationMail(email, activationLink);
  const userDto = getUserDto(user);
  const tokens = await tokenService.generateToken({ ...userDto });
  await tokenService.saveToken(userDto.id, tokens.refreshToken);
  return {
    ...tokens,
    user: userDto,
  };
};

const activate = async (activationLink: string) => {
  const user = await userModel.findOne({ activationLink });
  if (!user) {
    throw ApiError.BadRequest("The activation link is incorrect");
  }
  user.isActivated = true;
  user.save();
};

const login = async (email: string, password: string) => {
  const user = await userModel.findOne({ email });
  if (!user) {
    throw ApiError.BadRequest("There is no user with this email");
  }
  const isEqual = await bcrypt.compare(password, user.password);

  if (!isEqual) {
    throw ApiError.BadRequest("The password is incorrect");
  }

  const userDto = getUserDto(user);
  const tokens = await tokenService.generateToken({ ...userDto });
  await tokenService.saveToken(userDto.id, tokens.refreshToken);
  return {
    ...tokens,
    user: userDto,
  };
};
const logout = async (refreshToken: string) => {
  const token = await tokenService.removeToken(refreshToken);
  return token;
};

const refresh = async (refreshToken?: string | null) => {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }
  const userData = tokenService.validateRefreshToken(refreshToken);
  const tokenFromDb = await tokenService.findToken(refreshToken);

  if (!userData || !tokenFromDb) {
    throw ApiError.UnauthorizedError();
  }
  const user = await userModel.findById(userData.id);
  if (!user) {
    throw ApiError.BadRequest("CAnnot find user");
  }
  const userDto = getUserDto(user);
  const tokens = await tokenService.generateToken({ ...userDto });
  await tokenService.saveToken(userData.id, tokens.refreshToken);
  return {
    ...tokens,
    user: userData,
  };
};

const getAllUsers = async () => {
  const users = await userModel.find();
  if (!users) {
    throw ApiError.BadRequest("Cannot get users");
  }
  const usersDto = users.map((u) => getUserDto(u, true));
  return usersDto;
};

const getUser = async (id: string) => {
  const user = await userModel.findById(id);
  if (!user) {
    throw ApiError.BadRequest("Cannot get user");
  }
  const usersDto = getFullUserDto(user);
  return usersDto;
};

const getUsersAvailableForChat = async (id: string | undefined) => {
  const users = await userModel.find();
  const chats = await chatModel.find({ members: id });
  const availableUsers = users.filter(
    (u) =>
      !u._id.equals(id) &&
      chats.some((c) => c.members.some((m) => m.equals(id))),
  );
  const usersDto = await Promise.all(
    availableUsers.map((item) => getFullUserDto(item)),
  );
  return usersDto;
};

export const userServices = {
  registration,
  login,
  logout,
  activate,
  refresh,
  getAllUsers,
  getUser,
  getUsersAvailableForChat,
};
