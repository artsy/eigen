import {
  Aggregation,
  Aggregations,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  convertAggregationValueNamesToFilterParam,
  convertAttributionToFilterParam,
  convertColorsToFilterParam,
  convertMajorPeriodToFilterParam,
  convertPriceToFilterParam,
  convertSavedSearchCriteriaToFilterParams,
  convertSizeToFilterParams,
  convertWaysToBuyToFilterParams,
} from "app/Components/ArtworkFilter/SavedSearch/convertersToFilterParams"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"

describe("convertPriceToFilterParam", () => {
  it("returns `$100–200` price range", () => {
    const result = convertPriceToFilterParam({
      priceRange: "100-200",
    })

    expect(result).toEqual({
      displayText: "$100–200",
      paramValue: "100-200",
      paramName: FilterParamName.priceRange,
    })
  })

  it("returns `$50,000+` price range", () => {
    const result = convertPriceToFilterParam({
      priceRange: "50000-*",
    })

    expect(result).toEqual({
      displayText: "$50,000+",
      paramValue: "50000-*",
      paramName: FilterParamName.priceRange,
    })
  })

  it("returns `$0–1,000` price range", () => {
    const result = convertPriceToFilterParam({
      priceRange: "*-1000",
    })

    expect(result).toEqual({
      displayText: "$0–1,000",
      paramValue: "*-1000",
      paramName: FilterParamName.priceRange,
    })
  })

  it("returns `*-*` price range", () => {
    const result = convertPriceToFilterParam({
      priceRange: null,
    })

    expect(result).toBeNull()
  })
})

describe("convertSizeToFilterParams", () => {
  it("returns the default size filter value", () => {
    expect(convertSizeToFilterParams({})).toEqual(null)
  })

  it("returns the small size filter value for the old size filter format", () => {
    expect(convertSizeToFilterParams({ dimensionRange: "*-16.0" })).toEqual([
      {
        displayText: "Small (under 16in)",
        paramValue: ["SMALL"],
        paramName: FilterParamName.sizes,
      },
    ])
  })

  it("returns the medium size filter value for the old size filter format", () => {
    expect(convertSizeToFilterParams({ dimensionRange: "16.0-40.0" })).toEqual([
      {
        displayText: "Medium (16in – 40in)",
        paramValue: ["MEDIUM"],
        paramName: FilterParamName.sizes,
      },
    ])
  })

  it("returns only small size filter value", () => {
    expect(convertSizeToFilterParams({ sizes: ["SMALL"] })).toEqual([
      {
        displayText: "Small (under 16in)",
        paramValue: ["SMALL"],
        paramName: FilterParamName.sizes,
      },
    ])
  })

  it("returns small and large size filter values", () => {
    expect(convertSizeToFilterParams({ sizes: ["SMALL", "LARGE"] })).toEqual([
      {
        displayText: "Small (under 16in), Large (over 40in)",
        paramValue: ["SMALL", "LARGE"],
        paramName: FilterParamName.sizes,
      },
    ])
  })

  it("returns only the minimum width for the size filter", () => {
    expect(convertSizeToFilterParams({ width: "100-*" })).toEqual([
      {
        displayText: "100-*",
        paramValue: "100-*",
        paramName: FilterParamName.width,
      },
    ])
  })

  it("returns only the maximum width for the size filter", () => {
    expect(convertSizeToFilterParams({ width: "*-150" })).toEqual([
      {
        displayText: "*-150",
        paramValue: "*-150",
        paramName: FilterParamName.width,
      },
    ])
  })

  it("returns the minimum and maximum width for the size filter", () => {
    expect(convertSizeToFilterParams({ width: "100-150" })).toEqual([
      {
        displayText: "100-150",
        paramValue: "100-150",
        paramName: FilterParamName.width,
      },
    ])
  })

  it("returns only the minimum height for the size filter", () => {
    expect(convertSizeToFilterParams({ height: "200-*" })).toEqual([
      {
        displayText: "200-*",
        paramValue: "200-*",
        paramName: FilterParamName.height,
      },
    ])
  })

  it("returns only the maximum height for the size filter", () => {
    expect(convertSizeToFilterParams({ height: "*-250" })).toEqual([
      {
        displayText: "*-250",
        paramValue: "*-250",
        paramName: FilterParamName.height,
      },
    ])
  })

  it("returns the minimum and maximum height for the size filter", () => {
    expect(convertSizeToFilterParams({ height: "200-250" })).toEqual([
      {
        displayText: "200-250",
        paramValue: "200-250",
        paramName: FilterParamName.height,
      },
    ])
  })

  it("returns the width and height for the size filter", () => {
    expect(convertSizeToFilterParams({ width: "100-150", height: "200-250" })).toEqual([
      {
        displayText: "100-150",
        paramValue: "100-150",
        paramName: FilterParamName.width,
      },
      {
        displayText: "200-250",
        paramValue: "200-250",
        paramName: FilterParamName.height,
      },
    ])
  })
})

describe("convertColorsToFilterParam", () => {
  it("returns the color filter", () => {
    const criteria: SearchCriteriaAttributes = {
      colors: ["yellow", "red"],
      additionalGeneIDs: ["prints"],
    }

    expect(convertColorsToFilterParam(criteria)).toEqual({
      displayText: "Yellow, Red",
      paramValue: ["yellow", "red"],
      paramName: FilterParamName.colors,
    })
  })

  it("returns only the available colors in the color filter", () => {
    const criteria: SearchCriteriaAttributes = {
      colors: ["pink", "purple", "deep-purple"],
    }

    expect(convertColorsToFilterParam(criteria)).toEqual({
      displayText: "Pink, Purple",
      paramValue: ["pink", "purple"],
      paramName: FilterParamName.colors,
    })
  })

  it("returns nothing", () => {
    expect(convertColorsToFilterParam({})).toBeNull()
    expect(
      convertColorsToFilterParam({
        colors: null,
      })
    ).toBeNull()
  })
})

describe("convertAggregationValueNamesToFilterParam", () => {
  it("returns the filter param with only available values", () => {
    const criteriaValues = ["prints", "ephemera-or-merchandise"]
    const aggregations: Aggregation[] = [
      {
        count: 18037,
        name: "Photography",
        value: "photography",
      },
      {
        count: 2420,
        name: "Prints",
        value: "prints",
      },
      {
        count: 513,
        name: "Ephemera or Merchandise",
        value: "ephemera-or-merchandise",
      },
    ]
    const result = convertAggregationValueNamesToFilterParam(
      FilterParamName.additionalGeneIDs,
      aggregations,
      criteriaValues
    )

    expect(result).toEqual({
      displayText: "Prints, Ephemera or Merchandise",
      paramValue: ["prints", "ephemera-or-merchandise"],
      paramName: FilterParamName.additionalGeneIDs,
    })
  })

  it("returns nothing", () => {
    const criteriaValues = ["prints", "ephemera-or-merchandise"]
    const aggregations: Aggregation[] = [
      {
        count: 18061,
        name: "New York, NY, USA",
        value: "New York, NY, USA",
      },
      {
        count: 322,
        name: "London, United Kingdom",
        value: "London, United Kingdom",
      },
    ]

    const result = convertAggregationValueNamesToFilterParam(
      FilterParamName.additionalGeneIDs,
      aggregations,
      criteriaValues
    )

    expect(result).toBeNull()
  })
})

describe("convertAttributionToFilterParam", () => {
  it("returns the rarity filter", () => {
    const result = convertAttributionToFilterParam({
      attributionClass: ["unknown edition", "open edition"],
    })

    expect(result).toEqual({
      displayText: "Unknown Edition, Open Edition",
      paramValue: ["unknown edition", "open edition"],
      paramName: FilterParamName.attributionClass,
    })
  })

  it("returns the filter param with only available values", () => {
    const result = convertAttributionToFilterParam({
      attributionClass: ["limited edition", "unique", "something-unknown"],
    })

    expect(result).toEqual({
      displayText: "Limited Edition, Unique",
      paramValue: ["limited edition", "unique"],
      paramName: FilterParamName.attributionClass,
    })
  })

  it("returns nothing", () => {
    const result = convertAttributionToFilterParam({
      attributionClass: null,
    })

    expect(result).toBeNull()
  })
})

describe("convertWaysToBuyToFilterParams", () => {
  it("returns the ways to buy filter", () => {
    const result = convertWaysToBuyToFilterParams({
      acquireable: null,
      atAuction: true,
      inquireableOnly: null,
      offerable: true,
    })

    expect(result).toEqual([
      {
        displayText: "Make Offer",
        paramValue: true,
        paramName: FilterParamName.waysToBuyMakeOffer,
      },
      {
        displayText: "Bid",
        paramValue: true,
        paramName: FilterParamName.waysToBuyBid,
      },
    ])
  })

  it("returns the filter param with only available values", () => {
    const result = convertWaysToBuyToFilterParams({
      attributionClass: ["limited edition", "unique", "something-unknown"],
      acquireable: true,
      atAuction: null,
      inquireableOnly: true,
      offerable: null,
    })

    expect(result).toEqual([
      {
        displayText: "Purchase",
        paramValue: true,
        paramName: FilterParamName.waysToBuyPurchase,
      },
      {
        displayText: "Contact Gallery",
        paramValue: true,
        paramName: FilterParamName.waysToBuyContactGallery,
      },
    ])
  })

  it("returns nothing", () => {
    const result = convertWaysToBuyToFilterParams({
      attributionClass: null,
    })

    expect(result).toBeNull()
  })
})

describe("convertMajorPeriodToFilterParam", () => {
  it("returns the major time periods in the correct format", () => {
    const criteria: SearchCriteriaAttributes = {
      majorPeriods: ["2020", "2010"],
    }
    const result = convertMajorPeriodToFilterParam(criteria)

    expect(result).toEqual({
      displayText: "2020–Today, 2010–2019",
      paramValue: ["2020", "2010"],
      paramName: FilterParamName.timePeriod,
    })
  })

  it("returns nothing", () => {
    expect(convertMajorPeriodToFilterParam({})).toBeNull()
  })
})

describe("convertSavedSearchCriteriaToFilterParams", () => {
  it("returns filter params for existing search criteria", () => {
    const aggregations: Aggregations = [
      {
        slice: "MEDIUM",
        counts: [
          {
            count: 18037,
            name: "Photography",
            value: "photography",
          },
          {
            count: 2420,
            name: "Prints",
            value: "prints",
          },
          {
            count: 513,
            name: "Ephemera or Merchandise",
            value: "ephemera-or-merchandise",
          },
        ],
      },
      {
        slice: "LOCATION_CITY",
        counts: [
          {
            count: 18242,
            name: "New York, NY, USA",
            value: "New York, NY, USA",
          },
          {
            count: 322,
            name: "London, United Kingdom",
            value: "London, United Kingdom",
          },
        ],
      },
      {
        slice: "PARTNER",
        counts: [
          {
            count: 18210,
            name: "Cypress Test Partner [For Automated Testing Purposes]",
            value: "cypress-test-partner-for-automated-testing-purposes",
          },
          {
            count: 578,
            name: "Tate Ward Auctions",
            value: "tate-ward-auctions",
          },
        ],
      },
    ]
    const criteria: SearchCriteriaAttributes = {
      acquireable: null,
      additionalGeneIDs: ["prints"],
      atAuction: true,
      attributionClass: ["unknown edition", "open edition"],
      colors: ["yellow", "red"],
      sizes: ["MEDIUM"],
      inquireableOnly: null,
      locationCities: ["New York, NY, USA"],
      majorPeriods: ["2000"],
      materialsTerms: ["screen print"],
      offerable: true,
      partnerIDs: ["tate-ward-auctions"],
      priceRange: "10000-50000",
    }
    const result = convertSavedSearchCriteriaToFilterParams(criteria, aggregations)

    expect(result).toContainEqual({
      displayText: "$10,000–50,000",
      paramValue: "10000-50000",
      paramName: FilterParamName.priceRange,
    })
    expect(result).toContainEqual({
      displayText: `Medium (16in – 40in)`,
      paramValue: ["MEDIUM"],
      paramName: FilterParamName.sizes,
    })
    expect(result).toContainEqual({
      displayText: "Yellow, Red",
      paramValue: ["yellow", "red"],
      paramName: FilterParamName.colors,
    })
    expect(result).toContainEqual({
      displayText: "New York, NY, USA",
      paramValue: ["New York, NY, USA"],
      paramName: FilterParamName.locationCities,
    })
    expect(result).toContainEqual({
      displayText: "New York, NY, USA",
      paramValue: ["New York, NY, USA"],
      paramName: FilterParamName.locationCities,
    })
    expect(result).toContainEqual({
      displayText: "Prints",
      paramValue: ["prints"],
      paramName: FilterParamName.additionalGeneIDs,
    })
    expect(result).toContainEqual({
      displayText: "Unknown Edition, Open Edition",
      paramValue: ["unknown edition", "open edition"],
      paramName: FilterParamName.attributionClass,
    })
    expect(result).toContainEqual({
      displayText: "Make Offer",
      paramValue: true,
      paramName: FilterParamName.waysToBuyMakeOffer,
    })
    expect(result).toContainEqual({
      displayText: "Bid",
      paramValue: true,
      paramName: FilterParamName.waysToBuyBid,
    })
    expect(result).toContainEqual({
      displayText: "Tate Ward Auctions",
      paramValue: ["tate-ward-auctions"],
      paramName: FilterParamName.partnerIDs,
    })
    expect(result).toContainEqual({
      displayText: "2000–2009",
      paramValue: ["2000"],
      paramName: FilterParamName.timePeriod,
    })
  })

  it("returns the correct length of filter params", () => {
    const aggregations: Aggregations = [
      {
        slice: "MEDIUM",
        counts: [
          {
            count: 18037,
            name: "Photography",
            value: "photography",
          },
          {
            count: 2420,
            name: "Prints",
            value: "prints",
          },
          {
            count: 513,
            name: "Ephemera or Merchandise",
            value: "ephemera-or-merchandise",
          },
        ],
      },
      {
        slice: "LOCATION_CITY",
        counts: [
          {
            count: 18242,
            name: "New York, NY, USA",
            value: "New York, NY, USA",
          },
          {
            count: 322,
            name: "London, United Kingdom",
            value: "London, United Kingdom",
          },
        ],
      },
      {
        slice: "PARTNER",
        counts: [
          {
            count: 18210,
            name: "Cypress Test Partner [For Automated Testing Purposes]",
            value: "cypress-test-partner-for-automated-testing-purposes",
          },
          {
            count: 578,
            name: "Tate Ward Auctions",
            value: "tate-ward-auctions",
          },
        ],
      },
    ]
    const criteria: SearchCriteriaAttributes = {
      acquireable: null,
      additionalGeneIDs: ["prints"],
      atAuction: true,
      attributionClass: null,
      colors: null,
      sizes: ["MEDIUM"],
      inquireableOnly: null,
      locationCities: ["New York, NY, USA"],
      majorPeriods: ["2000"],
      materialsTerms: ["screen print"],
      offerable: true,
      partnerIDs: ["tate-ward-auctions"],
      priceRange: "10000-50000",
    }
    const result = convertSavedSearchCriteriaToFilterParams(criteria, aggregations)

    expect(result).toHaveLength(8)
  })
})
