import { FilterParamName } from "../ArtworkFilterHelpers"
import {
  getAllowedFiltersForSavedSearchInput,
  getOnlyFilledSearchCriteriaValues,
  getSearchCriteriaFromFilters,
  prepareFilterDataForSaveSearchInput,
} from "./searchCriteriaHelpers"

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
      sizes: null,
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

describe("prepareFilterDataForSaveSearchInput", () => {
  it("returns fields in the saved search criteria format", () => {
    const filters = [
      {
        displayText: "Large (over 100cm)",
        paramName: FilterParamName.sizes,
        paramValue: ["LARGE"],
      },
      {
        displayText: "Limited Edition",
        paramName: FilterParamName.attributionClass,
        paramValue: ["limited edition"],
      },
      {
        displayText: "$5,000-10,000",
        paramName: FilterParamName.priceRange,
        paramValue: "5000-10000",
      },
      {
        displayText: "Prints",
        paramName: FilterParamName.additionalGeneIDs,
        paramValue: ["prints"],
      },
      {
        displayText: "Paper",
        paramName: FilterParamName.materialsTerms,
        paramValue: ["paper"],
      },
      {
        displayText: "Bid",
        paramName: FilterParamName.waysToBuyBid,
        paramValue: true,
      },
      {
        displayText: "London, United Kingdom",
        paramName: FilterParamName.locationCities,
        paramValue: ["London, United Kingdom"],
      },
      {
        displayText: "1990-1999",
        paramName: FilterParamName.timePeriod,
        paramValue: ["1990"],
      },
      {
        displayText: "Yellow, Red",
        paramName: FilterParamName.colors,
        paramValue: ["yellow", "red"],
      },
      {
        displayText: "Cypress Test Partner [For Automated Testing Purposes], Tate Ward Auctions",
        paramName: FilterParamName.partnerIDs,
        paramValue: ["cypress-test-partner-for-automated-testing-purposes", "tate-ward-auctions"],
      },
    ]

    expect(prepareFilterDataForSaveSearchInput(filters)).toEqual({
      priceRange: "5000-10000",
      attributionClass: ["limited edition"],
      additionalGeneIDs: ["prints"],
      atAuction: true,
      majorPeriods: ["1990"],
      colors: ["yellow", "red"],
      locationCities: ["London, United Kingdom"],
      materialsTerms: ["paper"],
      sizes: ["LARGE"],
      partnerIDs: ["cypress-test-partner-for-automated-testing-purposes", "tate-ward-auctions"],
    })
  })

  it("return nothing if only the sort filter is selected", () => {
    const filters = [
      {
        displayText: "Recently Updated",
        paramName: FilterParamName.sort,
        paramValue: "-partner_updated_at",
      },
    ]

    expect(prepareFilterDataForSaveSearchInput(filters)).toEqual({})
  })

  it("returns minPrice and maxPrice fields if only the price filter is selected", () => {
    const filters = [
      {
        displayText: "$1,000-5,000",
        paramName: FilterParamName.priceRange,
        paramValue: "1000-5000",
      },
    ]

    expect(prepareFilterDataForSaveSearchInput(filters)).toEqual({
      priceRange: "1000-5000",
    })
  })

  it("returns minPrice field if only the minimum price filter is specified", () => {
    const filters = [
      {
        displayText: "$50,000+",
        paramName: FilterParamName.priceRange,
        paramValue: "50000-*",
      },
    ]

    expect(prepareFilterDataForSaveSearchInput(filters)).toEqual({
      priceRange: "50000-*",
    })
  })

  it("returns the selected `ways to buy` values", () => {
    const filters = [
      {
        displayText: "Bid",
        paramName: FilterParamName.waysToBuyBid,
        paramValue: true,
      },
      {
        displayText: "Inquire",
        paramName: FilterParamName.waysToBuyInquire,
        paramValue: true,
      },
    ]

    expect(prepareFilterDataForSaveSearchInput(filters)).toEqual({
      atAuction: true,
      inquireableOnly: true,
    })
  })

  it("returns custom filter sizes", () => {
    const filters = [
      {
        displayText: "200-250",
        paramName: FilterParamName.height,
        paramValue: "78.74015748031496-98.4251968503937",
      },
      {
        displayText: "100-150",
        paramName: FilterParamName.width,
        paramValue: "39.37007874015748-59.05511811023622",
      },
    ]

    expect(prepareFilterDataForSaveSearchInput(filters)).toEqual({
      width: "39.37007874015748-59.05511811023622",
      height: "78.74015748031496-98.4251968503937",
    })
  })

  it("returns only custom width sizes", () => {
    const filters = [
      {
        displayText: "100-150",
        paramName: FilterParamName.width,
        paramValue: "12.5-34.6",
      },
    ]

    expect(prepareFilterDataForSaveSearchInput(filters)).toEqual({
      width: "12.5-34.6",
    })
  })

  it("returns only custom max width size", () => {
    const filters = [
      {
        displayText: "*-500",
        paramName: FilterParamName.width,
        paramValue: "*-196.8503937007874",
      },
    ]

    expect(prepareFilterDataForSaveSearchInput(filters)).toEqual({
      width: "*-196.8503937007874",
    })
  })

  it("returns only custom min height size", () => {
    const filters = [
      {
        displayText: "100-150",
        paramName: FilterParamName.width,
        paramValue: "10-*",
      },
    ]

    expect(prepareFilterDataForSaveSearchInput(filters)).toEqual({
      width: "10-*",
    })
  })
})

describe("getAllowedFiltersForSavedSearchInput", () => {
  it("should return only allowed filters", () => {
    const filters = [
      {
        displayText: "100-150",
        paramName: FilterParamName.width,
        paramValue: "10-*",
      },
      {
        displayText: "Recently Updated",
        paramName: FilterParamName.sort,
        paramValue: "-partner_updated_at",
      },
    ]

    expect(getAllowedFiltersForSavedSearchInput(filters)).toEqual([
      {
        displayText: "100-150",
        paramName: FilterParamName.width,
        paramValue: "10-*",
      },
    ])
  })
})

describe("getSearchCriteriaFromFilters", () => {
  const filters = [
    {
      displayText: "Prints",
      paramName: FilterParamName.additionalGeneIDs,
      paramValue: ["prints"],
    },
    {
      displayText: "1990-1999",
      paramName: FilterParamName.timePeriod,
      paramValue: ["1990"],
    },
  ]

  it("returns fields in the saved search criteria format", () => {
    expect(getSearchCriteriaFromFilters("artistID", filters)).toEqual({
      artistIDs: ["artistID"],
      additionalGeneIDs: ["prints"],
      majorPeriods: ["1990"],
    })
  })
})
