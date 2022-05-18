import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { clearDefaultAttributes } from "./helpers"

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
