import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import { api } from "./api";
import { errorHandler } from "./core";

const app = express();
app.use(json());

app.use(api);
app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
};

app.listen(3000, () => {
  console.log("Listening on 3000");
});

start();
