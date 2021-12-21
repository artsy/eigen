import {
  Aggregations,
  FilterArray,
  FilterData,
  FilterParamName,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractPillFromAggregation, extractPills, extractSizeLabel, getNamePlaceholder } from "./helpers"

describe("extractPillFromAggregation", () => {
  it("returns pills", () => {
    const filter: FilterData = {
      displayText: "Acrylic, Canvas",
      paramName: FilterParamName.materialsTerms,
      paramValue: ["acrylic", "canvas"],
    }
    const result = extractPillFromAggregation(filter, aggregations)

    const pills = [
      { label: "Acrylic", value: "acrylic", paramName: FilterParamName.materialsTerms },
      { label: "Canvas", value: "canvas", paramName: FilterParamName.materialsTerms },
    ]

    expect(result).toEqual(pills)
  })

  it("returns undefined for unknown param values", () => {
    const filter: FilterData = {
      displayText: "Acrylic, Canvas",
      paramName: FilterParamName.materialsTerms,
      paramValue: ["acrylic", "canvas", "unknown-value"],
    }
    const result = extractPillFromAggregation(filter, aggregations)

    const pills = [
      { label: "Acrylic", value: "acrylic", paramName: FilterParamName.materialsTerms },
      { label: "Canvas", value: "canvas", paramName: FilterParamName.materialsTerms },
      undefined,
    ]

    expect(result).toEqual(pills)
  })

  it("returns empty array when couldn't get aggregation by param name", () => {
    const filter: FilterData = {
      displayText: "Acrylic, Canvas",
      paramName: FilterParamName.materialsTerms,
      paramValue: ["acrylic", "canvas", "unknown-value"],
    }
    const result = extractPillFromAggregation(filter, [])

    expect(result).toEqual([])
  })
})

describe("extractSizeLabel", () => {
  it("returns correcly label when full range is specified", () => {
    expect(extractSizeLabel("w", "5-10")).toBe("w: 5-10 in")
  })

  it("returns correcly label when only min value is specified", () => {
    expect(extractSizeLabel("w", "5-*")).toBe("w: from 5 in")
  })

  it("returns correcly label when only max value is specified", () => {
    expect(extractSizeLabel("w", "*-10")).toBe("w: to 10 in")
  })

  it("returns specified prefix", () => {
    expect(extractSizeLabel("h", "5-10")).toBe("h: 5-10 in")
  })
})

describe("extractPills", () => {
  it("should correctly extract pills", () => {
    const filters = [
      {
        displayText: "Acrylic, Canvas",
        paramName: FilterParamName.materialsTerms,
        paramValue: ["acrylic", "canvas"],
      },
      {
        displayText: "$5,000–10,000",
        paramValue: "5000-10000",
        paramName: FilterParamName.priceRange,
      },
      {
        paramName: FilterParamName.attributionClass,
        displayText: "Limited Edition, Open Edition",
        paramValue: ["limited edition", "open edition"],
      },
      {
        displayText: "Make Offer",
        paramValue: true,
        paramName: FilterParamName.waysToBuyMakeOffer,
      },
      {
        displayText: "5-10",
        paramValue: "5-10",
        paramName: FilterParamName.width,
      },
      {
        displayText: "15-*",
        paramValue: "15-*",
        paramName: FilterParamName.height,
      },
      {
        displayText: "",
        paramValue: ["unknown-color"],
        paramName: FilterParamName.colors,
      },
      {
        displayText: "Pill without value",
        paramValue: undefined,
        paramName: FilterParamName.waysToBuyInquire,
      },
    ] as FilterArray

    const result = extractPills(filters, aggregations)

    const pills = [
      {
        label: "Acrylic",
        paramName: FilterParamName.materialsTerms,
        value: "acrylic",
      },
      {
        label: "Canvas",
        paramName: FilterParamName.materialsTerms,
        value: "canvas",
      },
      {
        label: "$5,000–10,000",
        value: "5000-10000",
        paramName: FilterParamName.priceRange,
      },
      {
        paramName: FilterParamName.attributionClass,
        label: "Limited Edition",
        value: "limited edition",
      },
      {
        paramName: FilterParamName.attributionClass,
        label: "Open Edition",
        value: "open edition",
      },
      {
        label: "Make Offer",
        value: true,
        paramName: FilterParamName.waysToBuyMakeOffer,
      },
      {
        label: "w: 5-10 in",
        value: "5-10",
        paramName: FilterParamName.width,
      },
      {
        label: "h: from 15 in",
        value: "15-*",
        paramName: FilterParamName.height,
      },
    ]

    expect(result).toEqual(pills)
  })

  it("should correctly extract ways to buy pills", () => {
    const filters: FilterData[] = [
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
    ]
    const result = extractPills(filters, aggregations)

    const pills = [
      {
        label: "Make Offer",
        value: true,
        paramName: FilterParamName.waysToBuyMakeOffer,
      },
      {
        label: "Bid",
        value: true,
        paramName: FilterParamName.waysToBuyBid,
      },
    ]

    expect(result).toEqual(pills)
  })

  it("should correctly extract size pills", () => {
    const filters: FilterData[] = [
      {
        displayText: "Small (under 16in), Large (over 40in)",
        paramName: FilterParamName.sizes,
        paramValue: ["SMALL", "LARGE"],
      },
    ]
    const result = extractPills(filters, aggregations)

    expect(result).toEqual([
      {
        label: "Small (under 16in)",
        paramName: FilterParamName.sizes,
        value: "SMALL",
      },
      {
        label: "Large (over 40in)",
        paramName: FilterParamName.sizes,
        value: "LARGE",
      },
    ])
  })

  it("should correctly extract time period pills", () => {
    const filters: FilterData[] = [
      {
        displayText: "2020–Today, 2010–2019",
        paramName: FilterParamName.timePeriod,
        paramValue: ["2020", "2010"],
      },
    ]
    const result = extractPills(filters, aggregations)

    expect(result).toEqual([
      {
        label: "2020–Today",
        paramName: FilterParamName.timePeriod,
        value: "2020",
      },
      {
        label: "2010–2019",
        paramName: FilterParamName.timePeriod,
        value: "2010",
      },
    ])
  })

  it("should correctly extract color pills", () => {
    const filters: FilterData[] = [
      {
        displayText: "Pink, Orange, Dark Orange",
        paramName: FilterParamName.colors,
        paramValue: ["pink", "orange", "darkorange"],
      },
    ]
    const result = extractPills(filters, aggregations)

    expect(result).toEqual([
      {
        label: "Pink",
        paramName: FilterParamName.colors,
        value: "pink",
      },
      {
        label: "Orange",
        paramName: FilterParamName.colors,
        value: "orange",
      },
      {
        label: "Dark Orange",
        paramName: FilterParamName.colors,
        value: "darkorange",
      },
    ])
  })

  it("should correctly extract attribution pills", () => {
    const filters: FilterData[] = [
      {
        displayText: "Unique, Unknown Edition",
        paramName: FilterParamName.attributionClass,
        paramValue: ["unique", "unknown edition"],
      },
    ]
    const result = extractPills(filters, aggregations)

    expect(result).toEqual([
      {
        label: "Unique",
        paramName: FilterParamName.attributionClass,
        value: "unique",
      },
      {
        label: "Unknown Edition",
        paramName: FilterParamName.attributionClass,
        value: "unknown edition",
      },
    ])
  })

  it("should correctly extract custom price range pill", () => {
    const filters: FilterData[] = [
      {
        displayText: "$1,000–1,500",
        paramName: FilterParamName.priceRange,
        paramValue: "1000-1500",
      },
    ]
    const result = extractPills(filters, aggregations)

    expect(result).toEqual([
      {
        label: "$1,000–1,500",
        paramName: FilterParamName.priceRange,
        value: "1000-1500",
      },
    ])
  })
})

const aggregations: Aggregations = [
  {
    slice: "MATERIALS_TERMS",
    counts: [
      {
        count: 44,
        name: "Acrylic",
        value: "acrylic",
      },
      {
        count: 30,
        name: "Canvas",
        value: "canvas",
      },
      {
        count: 26,
        name: "Metal",
        value: "metal",
      },
    ],
  },
]

describe("getNamePlaceholder", () => {
  it("returns the singular form for the filter label", () => {
    const pills = [{ label: "One", paramName: FilterParamName.materialsTerms, value: "one" }]
    expect(getNamePlaceholder("artistName", pills)).toBe("artistName • 1 filter")
  })

  it("returns the plural form for the filter label", () => {
    const pills = [
      { label: "One", paramName: FilterParamName.materialsTerms, value: "one" },
      { label: "Two", paramName: FilterParamName.materialsTerms, value: "two" },
    ]
    expect(getNamePlaceholder("artistName", pills)).toBe("artistName • 2 filters")
  })

  it("returns the correct number of filters when artist pill is shown", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableImprovedAlertsFlow: true })
    const pills = [
      { label: "Artist Name", paramName: FilterParamName.artistIDs, value: "artistName" },
      { label: "One", paramName: FilterParamName.materialsTerms, value: "one" },
      { label: "Two", paramName: FilterParamName.materialsTerms, value: "two" },
    ]
    expect(getNamePlaceholder("artistName", pills)).toBe("artistName • 3 filters")
  })
})
