import mongoose from "mongoose";
import { app } from "./app";
import { BadRequestError } from "@itickey/common";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new BadRequestError("JWT_KEY is not defined");
  }

  if (!process.env.MONGO_URI) {
    throw new BadRequestError("MONGO_URI is not defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
};

app.listen(3000, () => {
  console.log("Listening on 3000");
});

start();
