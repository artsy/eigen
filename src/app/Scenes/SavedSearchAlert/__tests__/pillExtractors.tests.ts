import { OwnerType } from "@artsy/cohesion"
import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  SavedSearchEntity,
  SavedSearchEntityArtist,
  SearchCriteria,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import {
  extractArtistPills,
  extractPillFromAggregation,
  extractPillsFromCriteria,
  extractSizeLabel,
} from "app/Scenes/SavedSearchAlert/pillExtractors"

describe("extractPillFromAggregation", () => {
  it("returns pills", () => {
    const result = extractPillFromAggregation(
      SearchCriteria.materialsTerms,
      ["acrylic", "canvas"],
      aggregations
    )

    const pills = [
      { label: "Acrylic", value: "acrylic", paramName: SearchCriteria.materialsTerms },
      { label: "Canvas", value: "canvas", paramName: SearchCriteria.materialsTerms },
    ]

    expect(result).toEqual(pills)
  })

  it("returns undefined for unknown param values", () => {
    const result = extractPillFromAggregation(
      SearchCriteria.materialsTerms,
      ["acrylic", "canvas", "unknown-value"],
      aggregations
    )

    const pills = [
      { label: "Acrylic", value: "acrylic", paramName: SearchCriteria.materialsTerms },
      { label: "Canvas", value: "canvas", paramName: SearchCriteria.materialsTerms },
      undefined,
    ]

    expect(result).toEqual(pills)
  })

  it("returns empty array when couldn't get aggregation by param name", () => {
    const result = extractPillFromAggregation(
      SearchCriteria.materialsTerms,
      ["acrylic", "canvas", "unknown-value"],
      []
    )

    expect(result).toEqual([])
  })
})

describe("extractSizeLabel", () => {
  it("returns correcly label when full range is specified", () => {
    expect(extractSizeLabel({ prefix: "w", value: "5-10", unit: "in" })).toBe("w: 5-10 in")
    expect(extractSizeLabel({ prefix: "w", value: "5-10", unit: "cm" })).toBe("w: 12.7-25.4 cm")
  })

  it("returns correcly label when only min value is specified", () => {
    expect(extractSizeLabel({ prefix: "w", value: "5-*", unit: "in" })).toBe("w: from 5 in")
    expect(extractSizeLabel({ prefix: "w", value: "5-*", unit: "cm" })).toBe("w: from 12.7 cm")
  })

  it("returns correcly label when only max value is specified", () => {
    expect(extractSizeLabel({ prefix: "w", value: "*-10", unit: "in" })).toBe("w: to 10 in")
    expect(extractSizeLabel({ prefix: "w", value: "*-10", unit: "cm" })).toBe("w: to 25.4 cm")
  })

  it("returns specified prefix", () => {
    expect(extractSizeLabel({ prefix: "h", value: "5-10", unit: "in" })).toBe("h: 5-10 in")
    expect(extractSizeLabel({ prefix: "h", value: "5-10", unit: "cm" })).toBe("h: 12.7-25.4 cm")
  })
})

describe("extractPillsFromCriteria", () => {
  it("should correctly extract pills", () => {
    const attributes: SearchCriteriaAttributes = {
      materialsTerms: ["acrylic", "canvas"],
      priceRange: "5000-10000",
      attributionClass: ["limited edition", "open edition"],
      offerable: true,
      width: "5-10",
      height: "15-*",
      colors: ["unknown-color"],
    }

    const result = extractPillsFromCriteria({ attributes, aggregations, entity, unit: "in" })

    const pills = [
      {
        label: "Acrylic",
        paramName: SearchCriteria.materialsTerms,
        value: "acrylic",
      },
      {
        label: "Canvas",
        paramName: SearchCriteria.materialsTerms,
        value: "canvas",
      },
      {
        label: "$5,000–10,000",
        value: "5000-10000",
        paramName: SearchCriteria.priceRange,
      },
      {
        paramName: SearchCriteria.attributionClass,
        label: "Limited Edition",
        value: "limited edition",
      },
      {
        paramName: SearchCriteria.attributionClass,
        label: "Open Edition",
        value: "open edition",
      },
      {
        label: "Make Offer",
        value: true,
        paramName: SearchCriteria.offerable,
      },
      {
        label: "w: 5-10 in",
        value: "5-10",
        paramName: SearchCriteria.width,
      },
      {
        label: "h: from 15 in",
        value: "15-*",
        paramName: SearchCriteria.height,
      },
    ]

    expect(result).toEqual(pills)
  })

  it("should correctly extract ways to buy pills", () => {
    const attributes: SearchCriteriaAttributes = {
      offerable: true,
      atAuction: true,
    }
    const result = extractPillsFromCriteria({ attributes, aggregations, entity, unit: "in" })

    const pills = [
      {
        label: "Make Offer",
        value: true,
        paramName: SearchCriteria.offerable,
      },
      {
        label: "Bid",
        value: true,
        paramName: SearchCriteria.atAuction,
      },
    ]

    expect(result).toEqual(pills)
  })

  it("should correctly extract size pills", () => {
    const attributes: SearchCriteriaAttributes = {
      sizes: ["SMALL", "LARGE"],
    }

    // with unit inches
    const inResult = extractPillsFromCriteria({ attributes, aggregations, entity, unit: "in" })

    expect(inResult).toEqual([
      {
        label: "Small (under 16in)",
        paramName: SearchCriteria.sizes,
        value: "SMALL",
      },
      {
        label: "Large (over 40in)",
        paramName: SearchCriteria.sizes,
        value: "LARGE",
      },
    ])

    // with unit centimeters
    const cmResult = extractPillsFromCriteria({ attributes, aggregations, entity, unit: "cm" })

    expect(cmResult).toEqual([
      {
        label: "Small (under 40cm)",
        paramName: SearchCriteria.sizes,
        value: "SMALL",
      },
      {
        label: "Large (over 100cm)",
        paramName: SearchCriteria.sizes,
        value: "LARGE",
      },
    ])
  })

  it("should correctly extract time period pills", () => {
    const attributes: SearchCriteriaAttributes = {
      majorPeriods: ["2020", "2010"],
    }
    const result = extractPillsFromCriteria({ attributes, aggregations, entity, unit: "in" })

    expect(result).toEqual([
      {
        label: "2020–Today",
        paramName: SearchCriteria.majorPeriods,
        value: "2020",
      },
      {
        label: "2010–2019",
        paramName: SearchCriteria.majorPeriods,
        value: "2010",
      },
    ])
  })

  it("should correctly extract color pills", () => {
    const attributes: SearchCriteriaAttributes = {
      colors: ["pink", "orange"],
    }
    const result = extractPillsFromCriteria({ attributes, aggregations, entity, unit: "in" })

    expect(result).toEqual([
      {
        label: "Pink",
        paramName: SearchCriteria.colors,
        value: "pink",
      },
      {
        label: "Orange",
        paramName: SearchCriteria.colors,
        value: "orange",
      },
    ])
  })

  it("should correctly extract attribution pills", () => {
    const attributes: SearchCriteriaAttributes = {
      attributionClass: ["unique"],
    }
    const result = extractPillsFromCriteria({ attributes, aggregations, entity, unit: "in" })

    expect(result).toEqual([
      {
        label: "Unique",
        paramName: SearchCriteria.attributionClass,
        value: "unique",
      },
    ])
  })

  it("should correctly extract additionalGeneIDs pills", () => {
    const attributes: SearchCriteriaAttributes = {
      additionalGeneIDs: ["painting", "work-on-paper"],
    }
    const result = extractPillsFromCriteria({ attributes, aggregations, entity, unit: "in" })

    expect(result).toEqual([
      {
        label: "Painting",
        paramName: SearchCriteria.additionalGeneIDs,
        value: "painting",
      },
      {
        label: "Work on Paper",
        paramName: SearchCriteria.additionalGeneIDs,
        value: "work-on-paper",
      },
    ])
  })

  it("should correctly extract custom price range pill", () => {
    const attributes: SearchCriteriaAttributes = {
      priceRange: "1000-1500",
    }
    const result = extractPillsFromCriteria({ attributes, aggregations, entity, unit: "in" })

    expect(result).toEqual([
      {
        label: "$1,000–1,500",
        paramName: SearchCriteria.priceRange,
        value: "1000-1500",
      },
    ])
  })
})

describe("artistPills", () => {
  it("should return empty array", () => {
    const result = extractArtistPills([])

    expect(result).toEqual([])
  })

  it("should correctly extract single artist", () => {
    const result = extractArtistPills([firstArtist])

    expect(result).toEqual([
      {
        label: "firstArtistName",
        value: "firstArtistId",
        paramName: SearchCriteria.artistID,
      },
    ])
  })

  it("should correctly extract single artist", () => {
    const result = extractArtistPills([firstArtist, secondArtist])

    expect(result).toEqual([
      {
        label: "firstArtistName",
        value: "firstArtistId",
        paramName: SearchCriteria.artistID,
      },
      {
        label: "secondArtistName",
        value: "secondArtistId",
        paramName: SearchCriteria.artistID,
      },
    ])
  })
})

const firstArtist: SavedSearchEntityArtist = {
  id: "firstArtistId",
  name: "firstArtistName",
}

const secondArtist: SavedSearchEntityArtist = {
  id: "secondArtistId",
  name: "secondArtistName",
}

const entity: SavedSearchEntity = {
  artists: [firstArtist],
  owner: { type: OwnerType.artist, slug: "first-artist", id: firstArtist.id },
}

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
