import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError, RequestValidationError, User } from "../core";

const MIN_PASSWORD_CHARACTER = 4;
const MAX_PASSWORD_CHARACTER = 20;

const api = express.Router();

api.get("/api/users/current-user", (req, res) => {
  res.send("current user");
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
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

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

api.get("/api/users/signin", (req, res) => {
  res.send("signin");
});

api.get("/api/users/signout", (req, res) => {
  res.send("signout");
});

export { api };
