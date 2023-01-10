import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return await request(app)
    .post("/api/users/signup")
    .send({
      email: "asdadd",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return await request(app)
    .post("/api/users/signup")
    .send({
      email: "asdadd@asdsd.asd",
      password: "1",
    })
    .expect(400);
});

it("returns a 400 with missing password and email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "rwe@dasds.dasd",
    })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({
      password: "sdasdasdsad",
    })
    .expect(400);
});

it("not allowing signup with the same email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});

it("responds with details about the current user", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get("/api/users/current-user")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/current-user")
    .send()
    .expect(401);

  expect(response.body.currentUser).toEqual(undefined);
});
