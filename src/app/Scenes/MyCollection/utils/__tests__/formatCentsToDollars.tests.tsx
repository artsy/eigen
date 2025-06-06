import { formatCentsToDollars } from "app/Scenes/MyCollection/utils/formatCentsToDollars"

describe("formatCentsToDollars", () => {
  it("ignores negative numbers", () => {
    expect(formatCentsToDollars(-1)).toBe("$0")
  })

  it("formats inputs correctly", () => {
    expect(formatCentsToDollars(200)).toBe("$2")
    expect(formatCentsToDollars(200.013)).toBe("$2")
  })
})
