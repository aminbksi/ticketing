import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import {
  BadRequestError,
  isCorrectPassword,
  User,
  validateRequest,
} from "../core";

const MIN_PASSWORD_CHARACTER = 4;
const MAX_PASSWORD_CHARACTER = 20;

const api = express.Router();

api.get("/api/users/current-user", (request: Request, response: Response) => {
  if (!request.session?.jwt) {
    return response.send({ currentUser: null });
  }

  try {
    const currentUser = jwt.verify(request.session.jwt, process.env.JWT_KEY!);
    response.send({ currentUser: currentUser });
  } catch (err) {
    response.send({ currentUser: null });
  }
});

api.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: MIN_PASSWORD_CHARACTER, max: MAX_PASSWORD_CHARACTER })
      .withMessage("Password should be between 4 and 20"),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { email, password } = request.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("This email is already in use");
    }

    const user = User.build({ email, password });
    await user.save();

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    request.session = {
      jwt: token,
    };

    response.status(201).send(user);
  }
);

api.get(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { email, password } = request.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Bad Credentials");
    }

    const isPasswordMatch = await isCorrectPassword(user.password, password);
    if (!isPasswordMatch) {
      throw new BadRequestError("Bad Credentials");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    request.session = {
      jwt: token,
    };

    response.status(201).send(user);
  }
);

api.get("/api/users/signout", (req, res) => {
  res.send("signout");
});

export { api };
