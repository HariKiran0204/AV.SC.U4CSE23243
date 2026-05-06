import request from "supertest";
import { app } from "../../src/app";

describe("auth routes", () => {
  it("register + login + refresh", async () => {
    const register = await request(app).post("/api/v1/auth/register").send({
      email: "admin@example.com",
      name: "Admin",
      password: "pass1234",
      role: "admin"
    });
    expect(register.status).toBe(201);

    const login = await request(app).post("/api/v1/auth/login").send({
      email: "admin@example.com",
      password: "pass1234"
    });
    expect(login.status).toBe(200);
    expect(login.body.data.accessToken).toBeTruthy();

    const refresh = await request(app).post("/api/v1/auth/refresh").send({
      refreshToken: login.body.data.refreshToken
    });
    expect(refresh.status).toBe(200);
    expect(refresh.body.data.accessToken).toBeTruthy();
  });
});
