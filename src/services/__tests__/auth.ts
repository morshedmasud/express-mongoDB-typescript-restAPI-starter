import { createServer } from "@main/config/server";
import { Express } from "express-serve-static-core";
import request from "supertest";

let server: Express;

beforeAll(async () => {
  server = await createServer();
});

const registerData = {
  email: "test@test.com",
  password: "123456",
  name: "test",
};

const loginData = {
  email: "test@test.com",
  password: "asdcdf", // invalid password
};

describe("AUTH APIs", () => {
  it("GET /api/auth/register --> should return 201 & valid response", async () => {
    return request(server)
      .post("/api/auth/register")
      .set("Authorization", "Basic dGVzdC1jbGllbnQ6dGVzdC1jbGllbnQ=")
      .send(registerData)
      .expect(201)
      .then((response) => {
        expect(response.body).toMatchObject({
          data: {
            name: "test",
            email: "test@test.com",
            photo: null,
            status: "active",
          },
          message: null,
          stack: null,
        });
      });
  });

  it("GET /api/auth/login --> should return 406 & valid response", async () => {
    return request(server)
      .post("/api/auth/login")
      .set("Authorization", "Basic dGVzdC1jbGllbnQ6dGVzdC1jbGllbnQ=")
      .send(loginData)
      .expect(406) //
      .then((response) => {
        expect(response.body).toMatchObject({
          data: null,
          message: "Password Not Matched.",
          stack: null,
        });
      });
  });
});
