import { Request, Response, NextFunction } from "express";
import { BaseError } from "../errors";

export const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof BaseError) {
    return response
      .status(error.statusCode)
      .send({ errors: error.serializeErrors() });
  }

  response.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
