import { color } from "../color"

describe("color", () => {
  it("returns the correct color", () => {
    expect(color("black10")).toEqual("#E5E5E5")
    expect(color("black30")).toEqual("#C2C2C2")
  })
})
