import { Aggregations, FilterData, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { extractPillFromAggregation, extractPills, extractSizeLabel, getNamePlaceholder } from "../helpers"

describe("extractPillFromAggregation", () => {
  it("returns pills", () => {
    const filter: FilterData = {
      displayText: "Acrylic, Canvas",
      paramName: FilterParamName.materialsTerms,
      paramValue: ["acrylic", "canvas"],
    }
    const result = extractPillFromAggregation(filter, aggregations)

    expect(result).toEqual(["Acrylic", "Canvas"])
  })

  it("returns undefined for unknown param values", () => {
    const filter: FilterData = {
      displayText: "Acrylic, Canvas",
      paramName: FilterParamName.materialsTerms,
      paramValue: ["acrylic", "canvas", "unknown-value"],
    }
    const result = extractPillFromAggregation(filter, aggregations)

    expect(result).toEqual(["Acrylic", "Canvas", undefined])
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
    const filters: FilterData[] = [
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
    ]
    const result = extractPills(filters, aggregations)

    expect(result).toEqual([
      "Acrylic",
      "Canvas",
      "$5,000–10,000",
      "Limited Edition",
      "Open Edition",
      "Make Offer",
      "w: 5-10 in",
      "h: from 15 in",
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
    expect(getNamePlaceholder("artistName", ["one"])).toBe("artistName • 1 filter")
  })

  it("returns the plural form for the filter label", () => {
    expect(getNamePlaceholder("artistName", ["one", "two"])).toBe("artistName • 2 filters")
  })
})
