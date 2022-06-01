import { waitForEmail } from "./mailtrap"

export const forgotPassword = async (email) => {
  await element(by.id("button-login")).tap()
  await element(by.id("continueWithEmail")).tap()
  await element(by.text("Forgot password?")).tap()
  await element(by.type("RCTUITextField")).atIndex(0).typeText(email)
  await element(by.id("resetButton")).tap()

  return waitForEmail(
    { to: email, match: { title: 'Reset password instructions' }}
  )
}