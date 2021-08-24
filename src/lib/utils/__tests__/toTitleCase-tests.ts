import { isAllCapitalized, isIrregularCapitalized, toTitleCase } from "../toTitleCase"

describe("isAllCapitalized", () => {
  it("returns true if all characters are capitalized", () => {
    expect(isAllCapitalized("HELLO WORLD")).toBeTruthy()
  })

  it("returns true if all characters are capitalized and there are special characters", () => {
    expect(isAllCapitalized("HELLO_WORLD")).toBeTruthy()
  })

  it("returns false if there are lowercase characters", () => {
    expect(isAllCapitalized("Hello World")).toBeFalsy()
  })

  it("returns false if only some words are uppercase", () => {
    expect(isAllCapitalized("HELLO World")).toBeFalsy()
  })

  it("returns false if all characters are lowercased", () => {
    expect(isAllCapitalized("hello world")).toBeFalsy()
  })
})

describe("isIrregularCapitalized", () => {
  it("returns false if all characters are lowercased", () => {
    expect(isIrregularCapitalized("hello")).toBeFalsy()
  })

  it("returns false if all words are lowercased", () => {
    expect(isIrregularCapitalized("hello user")).toBeFalsy()
  })

  it("returns false if all characters are capitalized", () => {
    expect(isIrregularCapitalized("HELLO")).toBeFalsy()
  })

  it("returns false if all characters are lowercased and there are numbers", () => {
    expect(isIrregularCapitalized("hello 123")).toBeFalsy()
  })

  it("returns false if all latin characters are lowercased", () => {
    expect(isIrregularCapitalized("helloààâäèéêëîïôœùûüÿç")).toBeFalsy()
  })

  it("returns true if some characters are capitalized", () => {
    expect(isIrregularCapitalized("hellO")).toBeTruthy()
    expect(isIrregularCapitalized("aBcDe")).toBeTruthy()
  })

  it("returns true if some words are capitalized", () => {
    expect(isIrregularCapitalized("heLlo UsEr")).toBeTruthy()
  })

  it("returns true if some characters are capitalized and there are special characters", () => {
    expect(isIrregularCapitalized("first_naMe")).toBeTruthy()
  })

  it("returns true if some characters are capitalized and there are numbers", () => {
    expect(isIrregularCapitalized("hellO 123")).toBeTruthy()
  })

  it("returns true if some latin characters are capitalized", () => {
    expect(isIrregularCapitalized("helloàÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ")).toBeTruthy()
  })
})

describe("toTitleCase", () => {
  it("should format the text correctly", () => {
    expect(toTitleCase("hello world")).toBe("Hello World")
    expect(toTitleCase("musée picasso")).toBe("Musée Picasso")
    expect(toTitleCase("alpha 137 gallery")).toBe("Alpha 137 Gallery")
    expect(toTitleCase("new union gallery")).toBe("New Union Gallery")
    expect(toTitleCase("123 456 789")).toBe("123 456 789")
    expect(toTitleCase("who are so beguiled")).toBe("Who Are So Beguiled")
    expect(toTitleCase("lorem ipsum is simply dummy text of the printing and typesetting industry")).toBe(
      "Lorem Ipsum Is Simply Dummy Text of the Printing and Typesetting Industry"
    )
  })

  it("should format the lowercase words correctly", () => {
    expect(toTitleCase("first World")).toBe("First World")
    expect(toTitleCase("end to end gallery")).toBe("End to End Gallery")
    expect(toTitleCase("large (Over 100)")).toBe("Large (over 100)")
    expect(toTitleCase("artsy X capsule auctions")).toBe("Artsy x Capsule Auctions")
    expect(toTitleCase("one x two X three X four x")).toBe("One x Two x Three x Four X")
  })

  it("should format the special characters correctly", () => {
    expect(toTitleCase("$whatever space")).toBe("$Whatever Space")
    expect(toTitleCase("something [special]")).toBe("Something [Special]")
    expect(toTitleCase("first_name")).toBe("First_name")
    expect(toTitleCase("hang-up gallery")).toBe("Hang-Up Gallery")
    expect(toTitleCase("sotheby's")).toBe("Sotheby's")
    expect(toTitleCase("rago/wright")).toBe("Rago/Wright")
    expect(toTitleCase("name (Description)")).toBe("Name (Description)")
    expect(toTitleCase('"hello" name')).toBe('"Hello" Name')
  })

  it("should capitalize the first and last words", () => {
    expect(toTitleCase("the example word")).toBe("The Example Word")
    expect(toTitleCase("something new")).toBe("Something New")
    expect(toTitleCase("example word the")).toBe("Example Word The")
  })

  it("don't change the capital words", () => {
    expect(toTitleCase("HOFA gallery (house of fine art)")).toBe("HOFA Gallery (House of Fine Art)")
    expect(toTitleCase("HoFa gallery")).toBe("HoFa Gallery")
    expect(toTitleCase("eHDC gallery")).toBe("eHDC Gallery")
  })
})
