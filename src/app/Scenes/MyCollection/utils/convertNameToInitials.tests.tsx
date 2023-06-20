import { Initials } from "app/Scenes/MyCollection/utils/convertNameToInitials"
import { isNull } from "lodash"

describe("convertNameToInitials", () => {
  it("returns the Initials for a string with normal orthography", () => {
    expect(Initials("Richard Prince")).toBe("RP")
    expect(Initials("Harm van den Dorpel")).toBe("HD")
  })

  it("returns Initials for single words", () => {
    expect(Initials("Prince")).toBe("P")
    expect(Initials("prince")).toBe("P")
  })

  it("returns Initials for strings with unconventional orthography", () => {
    expect(Initials("e e cummings")).toBe("EEC")
    expect(Initials("e e cummings", 2)).toBe("EE")
  })

  it("is a little weird for numbers", () => {
    expect(Initials("247365")).toBe("2")
  })

  it("returns null when the value is undefined", () => {
    expect(isNull(Initials())).toBe(true)
  })
})
