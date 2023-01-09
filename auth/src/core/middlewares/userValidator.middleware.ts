import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserInterface {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserInterface;
    }
  }
}

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const currentUser = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserInterface;
    req.currentUser = currentUser;
  } catch (err) {}

  next();
};
