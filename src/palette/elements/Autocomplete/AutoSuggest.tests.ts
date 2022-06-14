import { AutoSuggest } from "./AutoSuggest"

describe("AutoSuggest", () => {
  const data = [
    "Julian",
    "Julian Opie",
    "Juliet",
    "julie",
    "Banksy",
    "Makelele",
    "Ragnar Sigurðsson",
  ]

  const autoSuggest = new AutoSuggest(data)

  describe(autoSuggest.getNextSuggestion, () => {
    it("gets the next if available", () => {
      let word = "Julian"
      let next = autoSuggest.getNextSuggestion(word)
      expect(next).toEqual("Julian Opie")

      // next word is not same as current word
      expect(next).not.toEqual(word)

      word = "julian notInList"
      next = autoSuggest.getNextSuggestion(word)
      expect(next).toBeNull()
    })

    it("allows for space in between words", () => {
      const wordWithSpace = "Julian "
      const next = autoSuggest.getNextSuggestion(wordWithSpace)
      expect(next).toEqual("Julian Opie")
    })

    it("Lettercase do not matter", () => {
      const wordWithSpace = "julie"
      const next = autoSuggest.getNextSuggestion(wordWithSpace)
      expect(next).toEqual("Juliet")
    })
  })

  describe(autoSuggest.getSuggestions, () => {
    it("suggestions include the current word", () => {
      const word = "Banksy"
      const suggestions = autoSuggest.getSuggestions(word)
      expect(suggestions.join()).toEqual(word)
    })

    it("correctly maps diacritics ", () => {
      const word = "ragnar Sigurd"
      const suggestions = autoSuggest.getSuggestions(word)
      expect(suggestions).toEqual(["Ragnar Sigurðsson"])
    })
  })

  describe(autoSuggest.isSuggestible, () => {
    describe("matchExact", () => {
      it("When matchExact is TRUE", () => {
        let substring = "banks"
        const matchExact = true
        let isSuggestible = autoSuggest.isSuggestible(substring, matchExact)
        expect(isSuggestible).toBe(false)

        substring = "banksy"
        isSuggestible = autoSuggest.isSuggestible(substring, matchExact)
        expect(isSuggestible).toBe(true)
      })

      it("When matchExact is FALSE", () => {
        let substring = "banks"
        const matchExact = false
        let isSuggestible = autoSuggest.isSuggestible(substring, matchExact)
        expect(isSuggestible).toBe(true)

        substring = "banksy"
        isSuggestible = autoSuggest.isSuggestible(substring, matchExact)
        expect(isSuggestible).toBe(true)
      })

      it("it is always false when word cannot be found", () => {
        const substring = "banksyyyyy"
        let matchExact = false
        let isSuggestible = autoSuggest.isSuggestible(substring, matchExact)
        expect(isSuggestible).toBe(false)

        matchExact = true
        isSuggestible = autoSuggest.isSuggestible(substring, matchExact)
        expect(isSuggestible).toBe(false)
      })
    })
  })
})
