import { isArtsyEmail } from "app/utils/general"

describe(isArtsyEmail, () => {
  it("detects artsy users correctly", () => {
    expect(isArtsyEmail("pavlos@artsymail.com")).toBe(true)
    expect(isArtsyEmail("pavlos+withextra@artsymail.com")).toBe(true)
    expect(isArtsyEmail("alsopavlos@artsy.net")).toBe(true)
    expect(isArtsyEmail("pavlos@example.com")).toBe(false)
  })
})
