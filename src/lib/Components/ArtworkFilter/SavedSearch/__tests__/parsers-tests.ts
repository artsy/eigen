import { Aggregation, FilterParamName } from "../../ArtworkFilterHelpers"
import {
  parseAggregationValueNamesForFilterParams,
  parseAttributionClassesForFilterParams,
  parseColorsForFilterParams,
  parsePriceForFilterParams,
  parseSizeForFilterParams,
} from "../parsers"

describe("parsePriceForFilterParams", () => {
  it("returns `$100–200` price range", () => {
    expect(parsePriceForFilterParams(100, 200)).toEqual({
      displayText: "$100–200",
      paramValue: "100-200",
      paramName: FilterParamName.priceRange,
    })
  })

  it("returns `$50,000+` price range", () => {
    expect(parsePriceForFilterParams(50000, null)).toEqual({
      displayText: "$50,000+",
      paramValue: "50000-*",
      paramName: FilterParamName.priceRange,
    })
  })

  it("returns `$0–1,000` price range", () => {
    expect(parsePriceForFilterParams(null, 1000)).toEqual({
      displayText: "$0–1,000",
      paramValue: "*-1000",
      paramName: FilterParamName.priceRange,
    })
  })

  it("returns `*-*` price range", () => {
    expect(parsePriceForFilterParams(null, null)).toEqual({
      displayText: "All",
      paramValue: "*-*",
      paramName: FilterParamName.priceRange,
    })
  })
})

describe("parseSizeForFilterParams", () => {
  it("returns the default size filter value", () => {
    expect(parseSizeForFilterParams({})).toEqual([
      {
        displayText: "All",
        paramValue: "*-*",
        paramName: FilterParamName.dimensionRange,
      },
    ])
  })

  it("returns the small size filter value", () => {
    expect(parseSizeForFilterParams({ dimensionScoreMax: 16 })).toEqual([
      {
        displayText: "Small (under 16in)",
        paramValue: "*-16.0",
        paramName: FilterParamName.dimensionRange,
      },
    ])
  })

  it("returns the medium size filter value", () => {
    expect(parseSizeForFilterParams({ dimensionScoreMin: 16, dimensionScoreMax: 40 })).toEqual([
      {
        displayText: "Medium (under 16in – 40in)",
        paramValue: "16.0-40.0",
        paramName: FilterParamName.dimensionRange,
      },
    ])
  })

  it("returns only the minimum width for the size filter", () => {
    expect(parseSizeForFilterParams({ widthMin: 100 })).toEqual([
      {
        displayText: "100-*",
        paramValue: "100-*",
        paramName: FilterParamName.width,
      },
      {
        displayText: "Custom size",
        paramValue: "0-*",
        paramName: FilterParamName.dimensionRange,
      },
    ])
  })

  it("returns only the maximum width for the size filter", () => {
    expect(parseSizeForFilterParams({ widthMax: 150 })).toEqual([
      {
        displayText: "*-150",
        paramValue: "*-150",
        paramName: FilterParamName.width,
      },
      {
        displayText: "Custom size",
        paramValue: "0-*",
        paramName: FilterParamName.dimensionRange,
      },
    ])
  })

  it("returns the minimum and maximum width for the size filter", () => {
    expect(parseSizeForFilterParams({ widthMin: 100, widthMax: 150 })).toEqual([
      {
        displayText: "100-150",
        paramValue: "100-150",
        paramName: FilterParamName.width,
      },
      {
        displayText: "Custom size",
        paramValue: "0-*",
        paramName: FilterParamName.dimensionRange,
      },
    ])
  })

  it("returns only the minimum height for the size filter", () => {
    expect(parseSizeForFilterParams({ heightMin: 200 })).toEqual([
      {
        displayText: "200-*",
        paramValue: "200-*",
        paramName: FilterParamName.height,
      },
      {
        displayText: "Custom size",
        paramValue: "0-*",
        paramName: FilterParamName.dimensionRange,
      },
    ])
  })

  it("returns only the maximum height for the size filter", () => {
    expect(parseSizeForFilterParams({ heightMax: 250 })).toEqual([
      {
        displayText: "*-250",
        paramValue: "*-250",
        paramName: FilterParamName.height,
      },
      {
        displayText: "Custom size",
        paramValue: "0-*",
        paramName: FilterParamName.dimensionRange,
      },
    ])
  })

  it("returns the minimum and maximum height for the size filter", () => {
    expect(parseSizeForFilterParams({ heightMin: 200, heightMax: 250 })).toEqual([
      {
        displayText: "200-250",
        paramValue: "200-250",
        paramName: FilterParamName.height,
      },
      {
        displayText: "Custom size",
        paramValue: "0-*",
        paramName: FilterParamName.dimensionRange,
      },
    ])
  })

  it("returns the width and height for the size filter", () => {
    expect(parseSizeForFilterParams({ widthMin: 100, widthMax: 150, heightMin: 200, heightMax: 250 })).toEqual([
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
      {
        displayText: "Custom size",
        paramValue: "0-*",
        paramName: FilterParamName.dimensionRange,
      },
    ])
  })
})

describe("parseColorsForFilterParams", () => {
  it("returns the color filter", () => {
    expect(
      parseColorsForFilterParams({
        colors: ["gold", "red"],
        additionalGeneIDs: ["prints"],
      })
    ).toEqual({
      displayText: "Gold, Red",
      paramValue: ["gold", "red"],
      paramName: FilterParamName.colors,
    })
  })

  it("returns only the available colors in the color filter", () => {
    expect(
      parseColorsForFilterParams({
        colors: ["pink", "violet", "deep-purple"],
      })
    ).toEqual({
      displayText: "Pink, Violet",
      paramValue: ["pink", "violet"],
      paramName: FilterParamName.colors,
    })
  })

  it("returns nothing", () => {
    expect(parseColorsForFilterParams({})).toBeNull()
    expect(
      parseColorsForFilterParams({
        colors: null,
      })
    ).toBeNull()
  })
})

describe("parseAggregationValueNamesForFilterParams", () => {
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
    const result = parseAggregationValueNamesForFilterParams(
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

    const result = parseAggregationValueNamesForFilterParams(
      FilterParamName.additionalGeneIDs,
      aggregations,
      criteriaValues
    )

    expect(result).toBeNull()
  })
})

describe("parseAttributionClassesForFilterParams", () => {
  it("returns the rarity filter", () => {
    const result = parseAttributionClassesForFilterParams({
      attributionClasses: ["unknown edition", "open edition"],
    })

    expect(result).toEqual({
      displayText: "Unknown Edition, Open Edition",
      paramValue: ["unknown edition", "open edition"],
      paramName: FilterParamName.attributionClass,
    })
  })

  it("returns the filter param with only available values", () => {
    const result = parseAttributionClassesForFilterParams({
      attributionClasses: ["limited edition", "unique", "something-unknown"],
    })

    expect(result).toEqual({
      displayText: "Limited Edition, Unique",
      paramValue: ["limited edition", "unique"],
      paramName: FilterParamName.attributionClass,
    })
  })

  it("returns nothing", () => {
    const result = parseAttributionClassesForFilterParams({
      attributionClasses: null,
    })

    expect(result).toBeNull()
  })
})

