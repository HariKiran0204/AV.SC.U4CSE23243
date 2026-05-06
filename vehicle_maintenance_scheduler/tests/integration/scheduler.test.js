"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../src/app");
async function getToken() {
    await (0, supertest_1.default)(app_1.app).post("/api/v1/auth/register").send({
        email: "scheduler@example.com",
        name: "Scheduler",
        password: "pass1234",
        role: "scheduler"
    });
    const login = await (0, supertest_1.default)(app_1.app).post("/api/v1/auth/login").send({
        email: "scheduler@example.com",
        password: "pass1234"
    });
    return login.body.data.accessToken;
}
describe("scheduler routes", () => {
    it("returns optimized schedule", async () => {
        const token = await getToken();
        const response = await (0, supertest_1.default)(app_1.app)
            .post("/api/v1/depots/d1/schedule")
            .set("Authorization", `Bearer ${token}`)
            .send({});
        expect(response.status).toBe(200);
        expect(response.body.data.depotId).toBe("d1");
        expect(Array.isArray(response.body.data.selectedTasks)).toBe(true);
    });
});
