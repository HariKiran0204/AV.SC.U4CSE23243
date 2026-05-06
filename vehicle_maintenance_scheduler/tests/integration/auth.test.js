"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../src/app");
describe("auth routes", () => {
    it("register + login + refresh", async () => {
        const register = await (0, supertest_1.default)(app_1.app).post("/api/v1/auth/register").send({
            email: "admin@example.com",
            name: "Admin",
            password: "pass1234",
            role: "admin"
        });
        expect(register.status).toBe(201);
        const login = await (0, supertest_1.default)(app_1.app).post("/api/v1/auth/login").send({
            email: "admin@example.com",
            password: "pass1234"
        });
        expect(login.status).toBe(200);
        expect(login.body.data.accessToken).toBeTruthy();
        const refresh = await (0, supertest_1.default)(app_1.app).post("/api/v1/auth/refresh").send({
            refreshToken: login.body.data.refreshToken
        });
        expect(refresh.status).toBe(200);
        expect(refresh.body.data.accessToken).toBeTruthy();
    });
});
