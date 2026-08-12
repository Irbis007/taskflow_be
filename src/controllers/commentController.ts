import { NextFunction, Response, Request } from "express";
import { commentService } from "../service/comment-service";
import { getId } from "../utils/getId";
import { decodeJwt } from "../utils/jwtDecode";
import { ApiError } from "../exceptions/api-error";

const getComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comments = await commentService.getComments(
      getId(req.params?.taskId),
    );
    return res.json(comments);
  } catch (e) {
    return next(e);
  }
};

const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const author = decodeJwt(req.cookies?.refreshToken);
    if (!author) {
      throw ApiError.BadRequest("cannot get author for comment");
    }
    const comment = await commentService.createComment(req.body, author.id);

    return res.json(comment);
  } catch (e) {
    return next(e);
  }
};

const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const comment = await commentService.updateComment(
      req.body,
      getId(req.params.id),
    );

    return res.json(comment);
  } catch (e) {
    return next(e);
  }
};

export const commentController = {
  createComment,
  getComments,
  updateComment,
};
