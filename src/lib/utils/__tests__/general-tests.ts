import { isArtsyUser } from "../general"

describe(isArtsyUser, () => {
  it("detects artsy users correctly", () => {
    expect(isArtsyUser("pavlos@artsymail.com")).toBe(true)
    expect(isArtsyUser("pavlos+withextra@artsymail.com")).toBe(true)
    expect(isArtsyUser("alsopavlos@artsy.net")).toBe(true)
    expect(isArtsyUser("pavlos@example.com")).toBe(false)
  })
})
