import userModel from "../models/user-model";
import bcrypt from "bcrypt";
import uuid from "uuid";
import { mailService } from "./mail-service";
import { tokenService } from "./token-service";
import { getUserDto } from "../dtos";
import { ApiError } from "../exceptions/api-error";
import { getFullUserDto } from "../dtos/userDto";
import chatModel from "../models/chat-model";
import { User } from "../types";
import { generateSecret, generateURI, verify, VerifyResult } from "otplib";

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

const resetPassword = async (
  data: {
    currentPassword: string;
    newPassword: string;
  },
  userId: string,
) => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw ApiError.BadRequest("cannot find user");
  }
  const isCorrect = await bcrypt.compare(data.currentPassword, user?.password);
  console.log(data.currentPassword, user?.password);
  if (!isCorrect) {
    throw ApiError.BadRequest("Current password is not correct");
  }
  const hashedPassword = await bcrypt.hash(data.newPassword, 3);
  user.password = hashedPassword;
  user.save();
};

const getAllUsers = async () => {
  const users = await userModel.find();
  if (!users) {
    throw ApiError.BadRequest("Cannot get users");
  }
  const usersDto = users.map((u) => getUserDto(u, true));
  return usersDto;
};

const getUser = async (id: string, authorId: string) => {
  const user = await userModel.findById(id);
  if (!user) {
    throw ApiError.BadRequest("Cannot get user");
  }
  const usersDto = await getFullUserDto(user, authorId);
  return usersDto;
};

const getUsersAvailableForChat = async (authorId: string) => {
  const users = await userModel.find();
  const chats = await chatModel.find({ members: authorId });
  const availableUsers = users.filter(
    (u) =>
      !u._id.equals(authorId) &&
      chats.some((c) => c.members.some((m) => m.equals(authorId))),
  );
  const usersDto = await Promise.all(
    availableUsers.map((item) => getFullUserDto(item, authorId)),
  );
  return usersDto;
};
const editUser = async (userId: string, data: User) => {
  const user = await userModel.findByIdAndUpdate(userId, data, {
    returnDocument: "after",
  });
  if (!user) {
    throw ApiError.BadRequest("Cannot find and update user");
  }
  const userDto = getFullUserDto(user, userId);
  return userDto;
};

const inviteUser = async (userId: string, data: { email: string }) => {
  await mailService.sendInvitationMail(data.email);
};

// 2FA

const setup2fa = async (userId: string) => {
  const user = await userModel.findById(userId);

  if (!user) {
    throw ApiError.BadRequest("cannot find user");
  }

  let secret = user.twoFactor.pendingSecret;

  if (!secret) {
    secret = generateSecret();
    user.twoFactor.pendingSecret = secret;
    await user.save();
  }

  const otpauthUrl = generateURI({
    issuer: "TaskFlow",
    label: user.email,
    secret,
  });

  return otpauthUrl;
};

const enable2fa = async (code: string, userId: string) => {
  const user = await userModel.findById(userId);

  if (!user) {
    throw ApiError.BadRequest("User not found");
  }

  const secret = user.twoFactor.pendingSecret || user.twoFactor.secret;

  if (!secret) {
    throw ApiError.BadRequest("2FA setup not found");
  }

  const result = await verify({
    token: code,
    secret,
  });

  if (!result.valid) {
    throw ApiError.BadRequest("Invalid authentication code");
  }

  if (user.twoFactor.pendingSecret) {
    user.twoFactor.secret = user.twoFactor.pendingSecret;
    user.twoFactor.pendingSecret = null;
  }

  user.twoFactor.enabled = true;

  await user.save();

  return getUserDto(user, true);
};

const disable2fa = async (userId: string) => {
  const user = await userModel.findById(userId);

  if (!user) {
    throw ApiError.BadRequest("2FA setup not found");
  }

  user.twoFactor.enabled = false;

  await user.save();
  return getUserDto(user, true);
};

const verify2fa = async (code: string, userId: string) => {
  const user = await userModel.findById(userId);

  if (!user) {
    throw ApiError.BadRequest("cannot find user");
  }
  const result = await verify({
    token: code,
    secret: user.twoFactor.secret,
  });

  if (!result.valid) {
    throw ApiError.BadRequest("Invalid authentication code");
  }
  const userDto = getUserDto(user);
  const tokens = await tokenService.generateToken({ ...userDto });
  await tokenService.saveToken(user._id, tokens.refreshToken);

  return {
    ...tokens,
    user: userDto,
  };
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
  editUser,
  inviteUser,
  resetPassword,
  setup2fa,
  enable2fa,
  disable2fa,
  verify2fa,
};
