import { signup } from "../helpers/signup"

describe("Sign up", () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: {notifications: "YES"}
    });
  });

  it("goes to onboarding after email signup", async () => {
    await signup()
  })
});
