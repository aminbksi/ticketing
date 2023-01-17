import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  authRequired,
  NotAuthorizedError,
  NotFoundError,
  validateRequest,
} from "@itickey/common";
import { Ticket } from "../core";

const api = express.Router();

api.post(
  "/api/tickets",
  authRequired,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { title, price } = request.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: request.currentUser!.id,
    });
    await ticket.save();

    response.status(201).send(ticket);
  }
);

api.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

api.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  res.send(tickets);
});

api.put(
  "/api/tickets/:id",
  authRequired,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();

    res.send(ticket);
  }
);

export { api };
