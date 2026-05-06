"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../src/utils/logger");
describe("logger utility", () => {
    it("does not throw on log send", async () => {
        await expect((0, logger_1.Log)({
            stack: "backend",
            level: "info",
            package: "utils",
            message: "test"
        })).resolves.toBeUndefined();
    });
});
