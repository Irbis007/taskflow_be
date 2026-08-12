import { ValidationError } from "express-validator";

export class ApiError extends Error {
  status: number;
  errors;

  constructor(status: number, message: string, errors: any[] = []) {
    super(message);
    ((this.status = status), (this.errors = errors));
  }

  static UnauthorizedError() {
    return new ApiError(401, "User is unauthorized");
  }
  static BadRequest(message: string, errors: ValidationError[] = []) {
    return new ApiError(400, message, errors);
  }
}
