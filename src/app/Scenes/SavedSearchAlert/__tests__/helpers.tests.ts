import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { clearDefaultAttributes, inferSeriesName } from "app/Scenes/SavedSearchAlert/helpers"

describe("clearDefaultAttributes", () => {
  it("should remove all default values", () => {
    const attributes: SearchCriteriaAttributes = {
      materialsTerms: [],
      colors: [],
      priceRange: null,
      acquireable: null,
      sizes: ["SMALL", "MEDIUM"],
      atAuction: true,
      artistIDs: ["artistID"],
    }

    expect(clearDefaultAttributes(attributes)).toEqual({
      sizes: ["SMALL", "MEDIUM"],
      atAuction: true,
      artistIDs: ["artistID"],
    })
  })
})

describe(inferSeriesName, () => {
  // cases where this workaround will succeed in removing the artist name (>90% of series)
  const goodCases: [string, string, string[]][] = [
    // common case
    ["yayoi-kusama-pumpkins", "Pumpkins", ["Yayoi Kusama"]],
    // capitalization
    ["sol-lewitt-cubes", "Cubes", ["Sol LeWitt"]],
    // diacritics
    ["joan-miro-etchings", "Etchings", ["Joan Miró"]],
    // hyphen
    ["pierre-auguste-renoir-portraits", "Portraits", ["Pierre-Auguste Renoir"]],
    // @ symbol
    ["be-at-rbrick-andy-warhol", "Andy Warhol", ["BE@RBRICK"]],
  ]

  // cases where this workaround will fail to remove the artist name (<10% of series)
  const badCases: [string, string, string[]][] = [
    // Unusual capitalization in series name
    ["kaws-bff", "BFF", ["KAWS"]],
    // Non-latin characters in artist name, transliterated in slug
    ["zao-wou-ki-zhao-wu-ji-etchings", "Etchings", ["Zao Wou-Ki 趙無極"]],
    // Punctuation in series title, not present in slug
    ["invader-rubiks-cubes", "Rubik’s Cubes", ["Invader"]],
  ]

  it("should return a properly formatted series name", () => {
    //
    goodCases.forEach(([slug, title, names]) => {
      names.forEach((name) => {
        expect(inferSeriesName(slug, [name])).toEqual(title)
      })
    })
    badCases.forEach(([slug, title, names]) => {
      names.forEach((name) => {
        expect(inferSeriesName(slug, [name])).not.toEqual(title)
      })
    })
  })
})
