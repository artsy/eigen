import { Aggregations, FilterData, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { extractPillFromAggregation, extractPills } from "../helpers"

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
        displayText: "Make offer",
        paramValue: true,
        paramName: FilterParamName.waysToBuyMakeOffer,
      },
    ]
    const result = extractPills(filters, aggregations)

    expect(result).toEqual(["Acrylic", "Canvas", "$5,000–10,000", "Limited Edition", "Open Edition", "Make offer"])
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
