import { transformBytesToSize } from "./transformBytesToSize"

describe("transformBytesToSize", () => {
  it("returns n/a when 0 byte passed", () => {
    const result = transformBytesToSize(0)
    expect(result).toBe("n/a")
  })

  it("correctly transforms bytes into MB", () => {
    const result = transformBytesToSize(1000000)
    expect(result).toBe("1.0 MB")
  })
})
