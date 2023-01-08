import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

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
  (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).send(errors.array());
    }

    console.log("Creating user...");

    response.send({});
  }
);

api.get("/api/users/signin", (req, res) => {
  res.send("signin");
});

api.get("/api/users/signout", (req, res) => {
  res.send("signout");
});

export { api };
