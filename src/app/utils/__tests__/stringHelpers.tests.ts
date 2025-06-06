import { stringIncludes } from "app/utils/stringHelpers"

describe("stringIncludes", () => {
  it("should return true if the string includes the other string", () => {
    expect(stringIncludes("Salvador Dali", "Salvador")).toEqual(true)
    expect(stringIncludes("Édouard Manet", "Edouard Manet")).toEqual(true)
    expect(stringIncludes(" Édouard Manet ", "Edouard Manet")).toEqual(true)
  })

  it("should return false3 if the string does not include the other string", () => {
    expect(stringIncludes("Salvador Dali", "Banksy")).toEqual(false)
  })
})
