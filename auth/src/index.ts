import express from "express";
import { json } from "body-parser";
import { api } from "./api";

const app = express();
app.use(json());

app.use(api);

app.listen(3000, () => {
  console.log("Listening on 3000");
});
