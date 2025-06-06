import { transformBytesToSize } from "app/utils/transformBytesToSize"

describe("transformBytesToSize", () => {
  it("returns n/a when 0 byte passed", () => {
    const result = transformBytesToSize(0)
    expect(result).toBe("n/a")
  })

  it("correctly transforms bytes into MB", () => {
    const result = transformBytesToSize(3425899)
    expect(result).toBe("3.3 MB")
  })
})
