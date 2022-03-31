import { getEnv } from "./env"

export const signup = async () => {
  const timestamp = new Date()
    .toISOString()
    .replace(/:/g, "-")
    .replace(/\./g, "-")

  const email = `detox-test-${timestamp}@fakedomain.com`
  const password = getEnv("TEST_PASSWORD")
  const name = "Detox User"

  await element(by.id('button-create')).tap();
  await element(by.id('continueWithEmail')).tap();

  const emailInput = await element(by.type("RCTUITextField")).atIndex(0)
  await emailInput.typeText(email)
  await element(by.id("signUpButton")).tap()

  const passwordInput = await element(by.type("RCTUITextField")).atIndex(0)
  await passwordInput.typeText(password)
  await element(by.id("signUpButton")).tap()

  const nameInput = await element(by.type("RCTUITextField")).atIndex(0)
  await nameInput.typeText(name)
  await element(
    by.text(
      "By checking this box, you consent to our Terms of Use, Privacy Policy, and Conditions of Sale."
    )
  ).tap({ x: 0, y: 0})
  await element(by.id("signUpButton")).tap()
}