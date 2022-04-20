import { createServer } from "@main/config/server";
import { Express } from "express-serve-static-core";
import request from "supertest";

let server: Express;

const validToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYyNGMxMzZlYjFlNmU2ZTk0MGE3MDZjMSIsIm5hbWUiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIn0sImV4cCI6MTY1MDUyODg2MzQ2NCwiaWF0IjoxNjUwNDQyNDYzfQ.dX8IC96-0nYkOwHMhW_M2kPvND1EFBl8MiuTupIzoQs";
const invalidToken = "invalid token";
beforeAll(async () => {
  server = await createServer();
});

describe("USER APIs", () => {
  it("GET /api/user/info --> should return 200 & valid response", async () => {
    return request(server)
      .get("/api/user/info")
      .set("Authorization", "bearer " + validToken)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          data: {
            name: "test",
            email: "test@test.com",
            photo: null,
          },
          message: null,
          stack: null,
        });
      });
  });

  it("GET /api/user/info --> should return 401 & valid response", async () => {
    return request(server)
      .get("/api/user/info")
      .set("Authorization", "bearer " + invalidToken)
      .expect("Content-Type", /json/)
      .expect(401)
      .then((response) => {
        expect(response.body).toMatchObject({
          data: null,
          message: "Invalid Token",
          stack: null,
        });
      });
  });
});
