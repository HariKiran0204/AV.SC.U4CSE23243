import { Log } from "../../src/utils/logger";

describe("logger utility", () => {
  it("does not throw on log send", async () => {
    await expect(Log({
      stack: "backend",
      level: "info",
      package: "utils",
      message: "test"
    })).resolves.toBeUndefined();
  });
});
