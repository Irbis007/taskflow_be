import { Request, Response, NextFunction } from "express";
import { userServices } from "../service/user-service";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/api-error";
import { getId } from "../utils/getId";
import { decodeJwt } from "../utils/jwtDecode";

const saveToken = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });
};

const registration = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest("Error with validation", errors.array()));
    }
    const { email, password, name, surname } = req.body;
    const userData = await userServices.registration(
      email,
      password,
      name,
      surname,
    );
    saveToken(res, userData.refreshToken);
    return res.json(userData);
  } catch (e) {
    return next(e);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const userData = await userServices.login(email, password);
    saveToken(res, userData.refreshToken);
    return res.json(userData);
  } catch (e) {
    return next(e);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    const token = await userServices.logout(refreshToken);
    res.clearCookie("refreshToken");
    return res.status(200).json(token);
  } catch (e) {
    return next(e);
  }
};

const activate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { link } = req.params;
    const activationLink = Array.isArray(link) ? link[0] : link;
    userServices.activate(activationLink);
    res.redirect(process.env.CLIENT_URL || "");
  } catch (e) {
    return next(e);
  }
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    const userData = await userServices.refresh(refreshToken);
    saveToken(res, userData.refreshToken);
    return res.json(userData);
  } catch (e) {
    return next(e);
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const users = await userServices.getAllUsers();
  return res.json(users);
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const id = getId(req.params.id);
  const user = await userServices.getUser(id);
  return res.json(user);
};

const getUsersAvailableForChat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = decodeJwt(req.cookies?.refreshToken)?.id.toString();
  const users = await userServices.getUsersAvailableForChat(userId);
  return res.json(users);
};

export const userController = {
  refresh,
  registration,
  login,
  logout,
  activate,
  getAllUsers,
  getUser,
  getUsersAvailableForChat,
};
