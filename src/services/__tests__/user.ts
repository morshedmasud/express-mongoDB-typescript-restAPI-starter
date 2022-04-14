import { Express } from "express-serve-static-core";
import request from "supertest";

import { createServer } from "@main/config/server";

let server: Express;

const validToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYyNTg4OTNhNmE1YTBmODYyYzRjNjBlZCIsIm5hbWUiOiJ0ZXN0IHVzZXIiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20ifSwiZXhwIjoxNjUwMDU1ODgxMjIwLCJpYXQiOjE2NDk5Njk0ODF9.TGHixouuvEPhkU3ScvfMSZDgkdIK-nU8gS6TdYG7Kb0";
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
            _id: "6258893a6a5a0f862c4c60ed",
            name: "test user",
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
