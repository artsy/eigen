import { endash, range } from "@artsy/palette-mobile"

describe("Text", () => {
  it("uses endash in ranges", () => {
    const usingHelper = range("10", "20")
    const usingEndash = `10 ${endash} 20`
    expect(usingHelper).toEqual(usingEndash)
    expect(usingHelper).toEqual("10 – 20") // endash
    expect(usingHelper).not.toEqual("10 - 20") // minus
  })
})
