import { getSectionHref } from "app/Scenes/HomeView/helpers/getSectionHref"

describe("getSectionHref", () => {
  it("returns the viewAllHref if it is a string", () => {
    expect(getSectionHref("123", "/view-all")).toBe("/view-all")
  })

  it("returns the default section route if viewAllHref is null", () => {
    expect(getSectionHref("123", null)).toBe("home-view/sections/123")
  })
  it("returns null if viewAllHref is undefined", () => {
    expect(getSectionHref("123", undefined)).toBeNull()
  })
})
