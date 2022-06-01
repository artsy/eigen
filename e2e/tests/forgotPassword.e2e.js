import { expect as jestExpect } from "@jest/globals"
import { getEnv } from "../helpers/env"
import { forgotPassword } from "../helpers/forgotPassword"

const email = getEnv("TEST_EMAIL")
console.log("email", email)

describe("Forgot password", () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: { notifications: "YES" },
    })
  })

  it("receives reset password email", async () => {
    const response = await forgotPassword(email)
    jestExpect(response).toBeTruthy()
  })
})
