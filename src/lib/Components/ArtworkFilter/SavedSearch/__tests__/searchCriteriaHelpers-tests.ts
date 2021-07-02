import { getOnlyFilledSearchCriteriaValues } from "../searchCriteriaHelpers"

describe("getOnlyFilledSearchCriteriaValues", () => {
  it("should return nothing", () => {
    const result = getOnlyFilledSearchCriteriaValues({})

    expect(result).toEqual({})
  })

  it("should return only filled values", () => {
    const result = getOnlyFilledSearchCriteriaValues({
      acquireable: true,
      additionalGeneIDs: [],
      atAuction: true,
      attributionClass: [],
      colors: [],
      dimensionRange: null,
      height: null,
      inquireableOnly: null,
      locationCities: [],
      majorPeriods: [],
      materialsTerms: ["screen print"],
      offerable: null,
      partnerIDs: [],
      priceRange: null,
      width: null,
    })

    expect(result).toEqual({
      acquireable: true,
      atAuction: true,
      materialsTerms: ["screen print"],
    })
  })
})
