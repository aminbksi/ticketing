import { ValidationError } from "express-validator";
import { BaseError } from "./base.error";

export class RequestValidationError extends BaseError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super("Not valid parameters");

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return this.errors.map((error) => ({
      message: error.msg,
      field: error.param,
    }));
  }
}
