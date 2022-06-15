import { pluralise } from "./pluralise"

describe("pluralise", () => {
  it("pluralises a word when the number of occurances is greater than 1", () => {
    expect(pluralise("word", 2)).toEqual("words")
    expect(pluralise("person", 2, "people")).toEqual("people")
  })

  it("returns the word when the number of occurances is 1", () => {
    expect(pluralise("word", 1)).toEqual("word")
  })
})
