import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { api } from "./api";
import { errorHandler } from "./core";

const app = express();
app.use(json());

app.use(api);
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Listening on 3000");
});
