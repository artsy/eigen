import {
  FilterArray,
  getUnitedSelectedAndAppliedFilters,
  aggregationsWithFollowedArtists,
  changedFiltersParams,
  filterArtworksParams,
  FilterParamName,
  FilterParams,
  getParamsForInputByFilterType,
  getSelectedFiltersCounts,
  prepareFilterArtworksParamsForInput,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"

describe("changedFiltersParams helper", () => {
  it("when a medium selection changed and sort selection unchanged", () => {
    const appliedFilters = filterArtworksParams([
      {
        displayText: "Recommended",
        paramValue: "-decayed_merch",
        paramName: FilterParamName.sort,
      },
      {
        displayText: "Performance Art",
        paramValue: "performance-art",
        paramName: FilterParamName.medium,
      },
    ])
    expect(
      changedFiltersParams(appliedFilters, [
        {
          displayText: "Recommended",
          paramValue: "-decayed_merch",
          paramName: FilterParamName.sort,
        },
        {
          displayText: "Photography",
          paramValue: "photography",
          paramName: FilterParamName.medium,
        },
      ])
    ).toEqual({ medium: "photography" })
  })

  it("when a medium and sort selection made from initial state", () => {
    const appliedFilters = filterArtworksParams([])
    expect(
      changedFiltersParams(appliedFilters, [
        {
          displayText: "Recently Updated",
          paramValue: "-partner_updated_at",
          paramName: FilterParamName.sort,
        },
        {
          displayText: "Sculpture",
          paramValue: "sculpture",
          paramName: FilterParamName.medium,
        },
      ])
    ).toEqual({ medium: "sculpture", sort: "-partner_updated_at" })
  })

  it("when medium selection and sort selection changed", () => {
    const appliedFilters = filterArtworksParams([
      {
        displayText: "Recommended",
        paramValue: "-decayed_merch",
        paramName: FilterParamName.sort,
      },
      {
        displayText: "Sculpture",
        paramValue: "sculpture",
        paramName: FilterParamName.medium,
      },
    ])
    expect(
      changedFiltersParams(appliedFilters, [
        {
          displayText: "Artwork Year (Ascending)",
          paramValue: "year",
          paramName: FilterParamName.sort,
        },
        { displayText: "All", paramValue: "*", paramName: FilterParamName.medium },
      ])
    ).toEqual({ medium: "*", sort: "year" })
  })

  it("when a medium selection unchanged and sort selection changed", () => {
    const appliedFilters = filterArtworksParams([
      {
        displayText: "Artwork Year (Descending)",
        paramValue: "-year",
        paramName: FilterParamName.sort,
      },
      {
        displayText: "Painting",
        paramValue: "painting",
        paramName: FilterParamName.medium,
      },
    ])
    expect(
      changedFiltersParams(appliedFilters, [
        {
          displayText: "Artwork Year (Ascending)",
          paramValue: "year",
          paramName: FilterParamName.sort,
        },
        {
          displayText: "Painting",
          paramValue: "painting",
          paramName: FilterParamName.medium,
        },
      ])
    ).toEqual({ sort: "year" })
  })

  it("when clearing applied sort selection", () => {
    const appliedFilters = filterArtworksParams([
      {
        displayText: "Artwork Year (Ascending)",
        paramValue: "year",
        paramName: FilterParamName.sort,
      },
      { displayText: "All", paramValue: "*", paramName: FilterParamName.medium },
      {
        displayText: "All",
        paramValue: "*-*",
        paramName: FilterParamName.priceRange,
      },
    ])
    expect(
      changedFiltersParams(appliedFilters, [
        {
          displayText: "Recommended",
          paramValue: "-decayed_merch",
          paramName: FilterParamName.sort,
        },
      ])
    ).toEqual({
      sort: "-decayed_merch",
    })
  })

  it("when clearing applied filters from medium and sort selections made", () => {
    const appliedFilters = filterArtworksParams([
      {
        displayText: "Recently Added",
        paramValue: "-published_at",
        paramName: FilterParamName.sort,
      },
      {
        displayText: "Performance Art",
        paramValue: "performance-art",
        paramName: FilterParamName.medium,
      },
    ])
    expect(
      changedFiltersParams(appliedFilters, [
        {
          displayText: "Recommended",
          paramValue: "-decayed_merch",
          paramName: FilterParamName.sort,
        },
        {
          displayText: "All",
          paramValue: "*",
          paramName: FilterParamName.medium,
        },
      ])
    ).toEqual({ sort: "-decayed_merch", medium: "*" })
  })
})

describe("filterArtworksParams helper", () => {
  let appliedFilters: FilterArray

  it("maps applied filters to relay params when default filters", () => {
    appliedFilters = [
      {
        displayText: "Recommended",
        paramValue: "-decayed_merch",
        paramName: FilterParamName.sort,
      },
      { displayText: "All", paramValue: "*", paramName: FilterParamName.medium },
      {
        displayText: "All",
        paramValue: "*-*",
        paramName: FilterParamName.priceRange,
      },
      {
        displayText: "Bid",
        paramValue: false,
        paramName: FilterParamName.waysToBuyBid,
      },
      {
        displayText: "Purchase",
        paramValue: false,
        paramName: FilterParamName.waysToBuyPurchase,
      },
      {
        displayText: "Contact Gallery",
        paramValue: false,
        paramName: FilterParamName.waysToBuyContactGallery,
      },
      {
        displayText: "Make Offer",
        paramValue: false,
        paramName: FilterParamName.waysToBuyMakeOffer,
      },
    ]
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-decayed_merch",
      medium: "*",
      priceRange: "*-*",
      estimateRange: "",
      includeArtworksByFollowedArtists: false,
      inquireableOnly: false,
      atAuction: false,
      acquireable: false,
      offerable: false,
    })
  })

  it("maps applied filters to relay params when no filters", () => {
    appliedFilters = []
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-decayed_merch",
      medium: "*",
      estimateRange: "",
      priceRange: "*-*",
      includeArtworksByFollowedArtists: false,
      inquireableOnly: false,
      atAuction: false,
      acquireable: false,
      offerable: false,
    })
  })

  it("maps applied filters to a default filter relay params when a single filter applied", () => {
    appliedFilters = [
      {
        displayText: "Artwork Year (Descending)",
        paramValue: "-year",
        paramName: FilterParamName.sort,
      },
    ]
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-year",
      medium: "*",
      estimateRange: "",
      priceRange: "*-*",
      includeArtworksByFollowedArtists: false,
      inquireableOnly: false,
      atAuction: false,
      acquireable: false,
      offerable: false,
    })
  })

  it("maps applied filters to relay params when multiple filters", () => {
    appliedFilters = [
      {
        displayText: "Recently Updated",
        paramValue: "-partner_updated_at",
        paramName: FilterParamName.sort,
      },
      {
        displayText: "Works on paper",
        paramValue: "work-on-paper",
        paramName: FilterParamName.medium,
      },
      {
        displayText: "$5,000-10,000",
        paramValue: "5000-10000",
        paramName: FilterParamName.priceRange,
      },
      {
        displayText: "Bid",
        paramValue: false,
        paramName: FilterParamName.waysToBuyBid,
      },
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
      {
        displayText: "Make Offer",
        paramValue: false,
        paramName: FilterParamName.waysToBuyMakeOffer,
      },
      {
        displayText: "All Artists I Follow",
        paramValue: true,
        paramName: FilterParamName.artistsIFollow,
      },
      {
        displayText: "Rarity",
        paramValue: ["unique", "unknown edition"],
        paramName: FilterParamName.attributionClass,
      },
    ]
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-partner_updated_at",
      medium: "work-on-paper",
      estimateRange: "",
      priceRange: "5000-10000",
      inquireableOnly: true,
      atAuction: false,
      acquireable: true,
      offerable: false,
      includeArtworksByFollowedArtists: true,
      attributionClass: ["unique", "unknown edition"],
    })
  })

  it("maps correct applied filters when there's a single artistID param", () => {
    appliedFilters = [
      {
        displayText: "Artist 1",
        paramValue: ["artist-1"],
        paramName: FilterParamName.artistIDs,
      },
      {
        displayText: "Make Offer",
        paramValue: true,
        paramName: FilterParamName.waysToBuyMakeOffer,
      },
    ]
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-decayed_merch",
      medium: "*",
      priceRange: "*-*",
      estimateRange: "",
      inquireableOnly: false,
      atAuction: false,
      acquireable: false,
      offerable: true,
      artistIDs: ["artist-1"],
      includeArtworksByFollowedArtists: false,
    })
  })

  it("maps correct applied filters when there are multiple artistID params", () => {
    appliedFilters = [
      {
        displayText: "Artist 1, Artist 2",
        paramValue: ["artist-1", "artist-2"],
        paramName: FilterParamName.artistIDs,
      },
    ]
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-decayed_merch",
      medium: "*",
      estimateRange: "",
      priceRange: "*-*",
      inquireableOnly: false,
      atAuction: false,
      acquireable: false,
      offerable: false,
      artistIDs: ["artist-1", "artist-2"],
      includeArtworksByFollowedArtists: false,
    })
  })

  describe("showArtwork", () => {
    it("maps applied filters to relay params when default filters", () => {
      appliedFilters = [
        {
          displayText: "Gallery Curated",
          paramValue: "partner_show_position",
          paramName: FilterParamName.sort,
        },
        { displayText: "All", paramValue: "*", paramName: FilterParamName.medium },
        {
          displayText: "All",
          paramValue: "*-*",
          paramName: FilterParamName.priceRange,
        },
        {
          displayText: "Bid",
          paramValue: false,
          paramName: FilterParamName.waysToBuyBid,
        },
        {
          displayText: "Purchase",
          paramValue: false,
          paramName: FilterParamName.waysToBuyPurchase,
        },
        {
          displayText: "Contact Gallery",
          paramValue: false,
          paramName: FilterParamName.waysToBuyContactGallery,
        },
        {
          displayText: "Make Offer",
          paramValue: false,
          paramName: FilterParamName.waysToBuyMakeOffer,
        },
      ]
      expect(filterArtworksParams(appliedFilters, "showArtwork")).toEqual({
        sort: "partner_show_position",
        medium: "*",
        priceRange: "*-*",
        estimateRange: "",
        includeArtworksByFollowedArtists: false,
        inquireableOnly: false,
        atAuction: false,
        acquireable: false,
        offerable: false,
      })
    })
  })
})

describe("aggregationsWithFollowedArtists", () => {
  it("returns the correct structure if there are followed artists", () => {
    const existingAggregations = [
      {
        slice: "MEDIUM",
        counts: [
          {
            count: 4222,
            value: "prints",
            name: "Prints",
          },
          {
            count: 176,
            value: "work-on-paper",
            name: "Work on Paper",
          },
        ],
      },
    ]

    expect(aggregationsWithFollowedArtists(10, existingAggregations)).toEqual([
      {
        slice: "MEDIUM",
        counts: [
          {
            count: 4222,
            value: "prints",
            name: "Prints",
          },
          {
            count: 176,
            value: "work-on-paper",
            name: "Work on Paper",
          },
        ],
      },
      {
        slice: "FOLLOWED_ARTISTS",
        counts: [
          {
            count: 10,
            value: "followed_artists",
          },
        ],
      },
    ])
  })

  it("returns the correct structure if there are no followed artists", () => {
    const existingAggregations = [
      {
        slice: "MEDIUM",
        counts: [
          {
            count: 4222,
            value: "prints",
            name: "Prints",
          },
          {
            count: 176,
            value: "work-on-paper",
            name: "Work on Paper",
          },
        ],
      },
    ]

    expect(aggregationsWithFollowedArtists(0, existingAggregations)).toEqual([
      {
        slice: "MEDIUM",
        counts: [
          {
            count: 4222,
            value: "prints",
            name: "Prints",
          },
          {
            count: 176,
            value: "work-on-paper",
            name: "Work on Paper",
          },
        ],
      },
    ])
  })
})

describe("prepareFilterArtworksParamsForInput", () => {
  it("returns only allowed params when default params are passed", () => {
    const filters = {
      acquireable: false,
      atAuction: false,
      includeArtworksByFollowedArtists: false,
      inquireableOnly: false,
      medium: "*",
      offerable: false,
      priceRange: "*-*",
      sort: "-decayed_merch",
    } as FilterParams

    expect(prepareFilterArtworksParamsForInput(filters)).toEqual({
      acquireable: false,
      atAuction: false,
      includeArtworksByFollowedArtists: false,
      inquireableOnly: false,
      medium: "*",
      offerable: false,
      priceRange: "*-*",
      sort: "-decayed_merch",
    })
  })

  it("returns only allowed params when no params are passed", () => {
    const filters = {} as FilterParams

    expect(prepareFilterArtworksParamsForInput(filters)).toEqual({})
  })

  it("returns only allowed params when extra params are passed", () => {
    const filters = {
      acquireable: false,
      atAuction: false,
      categories: undefined, // TO check
      estimateRange: "",
      inquireableOnly: false,
      medium: "*",
      offerable: false,
      priceRange: "*-*",
      sort: "-decayed_merch",
      includeArtworksByFollowedArtists: false,
    } as FilterParams

    expect(prepareFilterArtworksParamsForInput(filters)).toEqual({
      acquireable: false,
      atAuction: false,
      includeArtworksByFollowedArtists: false,
      inquireableOnly: false,
      medium: "*",
      offerable: false,
      priceRange: "*-*",
      sort: "-decayed_merch",
    })
  })
})

describe("getParamsForInputByFilterType", () => {
  it("returns default params if nothing is passed", () => {
    const result = getParamsForInputByFilterType({}, "geneArtwork")
    expect(result).toEqual({
      sort: "-partner_updated_at",
      priceRange: "*-*",
      medium: "*",
    })
  })

  it("returns the passed and default params", () => {
    const result = getParamsForInputByFilterType({ width: "100-200" }, "geneArtwork")
    expect(result).toEqual({
      sort: "-partner_updated_at",
      priceRange: "*-*",
      medium: "*",
      width: "100-200",
    })
  })

  it("should replace the default params", () => {
    const result = getParamsForInputByFilterType({ priceRange: "100-200" }, "geneArtwork")
    expect(result).toEqual({
      sort: "-partner_updated_at",
      priceRange: "100-200",
      medium: "*",
    })
  })
})

describe("getSelectedFiltersCounts helper", () => {
  const multiSelectFilters = [
    {
      displayText: "Galleries & Institutions",
      paramName: FilterParamName.partnerIDs,
      paramValue: ["sugarlift", "ai-bo-gallery", "lilac-gallery"],
    },
    {
      displayText: "Time Period",
      paramName: FilterParamName.timePeriod,
      paramValue: ["2000-2009"],
    },
    {
      displayText: "Rarity",
      paramName: FilterParamName.attributionClass,
      paramValue: ["unique", "unknown-edition"],
    },
    {
      displayText: "Medium",
      paramName: FilterParamName.medium,
      paramValue: ["prints", "design", "installation", "drawing"],
    },
    {
      displayText: "Material",
      paramName: FilterParamName.materialsTerms,
      paramValue: ["glass", "wood"],
    },
    {
      displayText: "Nationality & Ethnicity",
      paramName: FilterParamName.artistNationalities,
      paramValue: ["british", "japanese"],
    },
    {
      displayText: "Artwork Location",
      paramName: FilterParamName.locationCities,
      paramValue: ["new-york", "miami", "harrison", "denver", "greenport"],
    },
    {
      displayText: "Color",
      paramName: FilterParamName.colors,
      paramValue: ["yellow", "orange", "red"],
    },
    {
      displayText: "Size",
      paramName: FilterParamName.sizes,
      paramValue: ["MEDIUM", "LARGE"],
    },
  ]

  const multiSelectFiltersExpectedResult = {
    partnerIDs: 3,
    majorPeriods: 1,
    attributionClass: 2,
    medium: 4,
    materialsTerms: 2,
    artistNationalities: 2,
    locationCities: 5,
    colors: 3,
    sizes: 2,
  }

  const singleOptionFilters = [
    {
      displayText: "Sort By",
      paramName: FilterParamName.sort,
      paramValue: "year",
    },
    {
      displayText: "Price",
      paramName: FilterParamName.priceRange,
      paramValue: "10000-50000",
    },
  ]

  const singleOptionFiltersExpectedResult = {
    sort: 1,
    priceRange: 1,
  }

  const waysToBuyFilters = [
    {
      displayText: "Make Offer",
      paramName: FilterParamName.waysToBuyMakeOffer,
      paramValue: true,
    },
    {
      displayText: "Bid",
      paramName: FilterParamName.waysToBuyBid,
      paramValue: true,
    },
  ]

  const waysToBuyFiltersExpectedResult = {
    waysToBuy: 2,
  }

  const artistsFilters = [
    {
      displayText: "Artists",
      paramName: FilterParamName.artistIDs,
      paramValue: ["alex-katz", "anne-siems", "cat-sirot", "ceravolo", "andy-warhol"],
    },
    {
      displayText: "Artists",
      paramName: FilterParamName.artistsIFollow,
      paramValue: true,
    },
  ]

  const artistsFiltersExpectedResult = {
    artistIDs: 6,
  }

  it("returns empty object if empty array is passed", () => {
    const result = getSelectedFiltersCounts([])
    expect(result).toEqual({})
  })

  it("counts multiselect filters correctly", () => {
    const result = getSelectedFiltersCounts(multiSelectFilters)
    expect(result).toEqual(multiSelectFiltersExpectedResult)
  })

  it("counts single option filters correctly", () => {
    const result = getSelectedFiltersCounts(singleOptionFilters)
    expect(result).toEqual(singleOptionFiltersExpectedResult)
  })

  it("counts ways to buy options correctly", () => {
    const result = getSelectedFiltersCounts(waysToBuyFilters)
    expect(result).toEqual(waysToBuyFiltersExpectedResult)
  })

  it("counts artists options correctly", () => {
    const result = getSelectedFiltersCounts(artistsFilters)
    expect(result).toEqual(artistsFiltersExpectedResult)
  })

  it("counts custom sizes correctly if only width is specified", () => {
    const result = getSelectedFiltersCounts([
      {
        displayText: "100-199",
        paramName: FilterParamName.width,
        paramValue: "78.74015748031496-117.71653543307086",
      },
    ])
    expect(result).toEqual({
      sizes: 1,
    })
  })

  it("counts custom sizes correctly if only height is specified", () => {
    const result = getSelectedFiltersCounts([
      {
        displayText: "200-299",
        paramName: FilterParamName.height,
        paramValue: "39.37007874015748-78.34645669291338",
      },
    ])
    expect(result).toEqual({
      sizes: 1,
    })
  })

  it("counts custom sizes correctly", () => {
    const result = getSelectedFiltersCounts([
      {
        displayText: "100-199",
        paramName: FilterParamName.width,
        paramValue: "78.74015748031496-117.71653543307086",
      },
      {
        displayText: "200-299",
        paramName: FilterParamName.height,
        paramValue: "39.37007874015748-78.34645669291338",
      },
    ])
    expect(result).toEqual({
      sizes: 2,
    })
  })

  it("counts all filters correctly", () => {
    const result = getSelectedFiltersCounts([
      ...multiSelectFilters,
      ...singleOptionFilters,
      ...waysToBuyFilters,
      ...artistsFilters,
    ])
    expect(result).toEqual({
      ...multiSelectFiltersExpectedResult,
      ...singleOptionFiltersExpectedResult,
      ...waysToBuyFiltersExpectedResult,
      ...artistsFiltersExpectedResult,
    })
  })
})

describe("getUnitedSelectedAndAppliedFilters helper", () => {
  const filters1 = [
    {
      displayText: "Color",
      paramName: FilterParamName.colors,
      paramValue: ["green", "blue"],
    },
    {
      displayText: "Price",
      paramName: FilterParamName.priceRange,
      paramValue: "*-1000",
    },
  ]

  const filters2 = [
    {
      displayText: "Medium",
      paramName: FilterParamName.medium,
      paramValue: ["perfomance-art"],
    },
  ]

  it("returns empty array if both selected and applied filters are passed empty", () => {
    const result = getUnitedSelectedAndAppliedFilters({
      filterType: "artwork",
      selectedFilters: [],
      previouslyAppliedFilters: [],
    })
    expect(result).toEqual([])
  })

  it("returns selected filters if applied filters are passed empty", () => {
    const result = getUnitedSelectedAndAppliedFilters({
      filterType: "artwork",
      selectedFilters: filters1,
      previouslyAppliedFilters: [],
    })
    expect(result).toEqual(filters1)
  })

  it("returns applied filters if selected filters are passed empty", () => {
    const result = getUnitedSelectedAndAppliedFilters({
      filterType: "artwork",
      selectedFilters: [],
      previouslyAppliedFilters: filters2,
    })
    expect(result).toEqual(filters2)
  })

  it("unites selected and applied filters if they don't cross", () => {
    const result = getUnitedSelectedAndAppliedFilters({
      filterType: "artwork",
      selectedFilters: filters1,
      previouslyAppliedFilters: filters2,
    })
    expect(result).toEqual([...filters1, ...filters2])
  })

  it("returns array containing newly selected filters if those filters are already applied", () => {
    const previouslyAppliedFilters = [
      {
        displayText: "Rarity",
        paramName: FilterParamName.attributionClass,
        paramValue: ["open-edition"],
      },
      {
        displayText: "Price",
        paramName: FilterParamName.priceRange,
        paramValue: "1000-5000",
      },
      {
        displayText: "Material",
        paramName: FilterParamName.materialsTerms,
        paramValue: ["glass", "oil"],
      },
    ]

    const newlySelectedFilters = [
      {
        displayText: "Price",
        paramName: FilterParamName.priceRange,
        paramValue: "50000-*",
      },
      {
        displayText: "Material",
        paramName: FilterParamName.materialsTerms,
        paramValue: ["paper", "oil"],
      },
    ]
    const result = getUnitedSelectedAndAppliedFilters({
      filterType: "artwork",
      selectedFilters: newlySelectedFilters,
      previouslyAppliedFilters,
    })

    expect(result).toEqual([
      {
        displayText: "Price",
        paramName: FilterParamName.priceRange,
        paramValue: "50000-*",
      },
      {
        displayText: "Material",
        paramName: FilterParamName.materialsTerms,
        paramValue: ["paper", "oil"],
      },
      {
        displayText: "Rarity",
        paramName: FilterParamName.attributionClass,
        paramValue: ["open-edition"],
      },
    ])
  })

  it("returns only ways to buy filter options that weren't unselected", () => {
    const previouslyAppliedFilters = [
      {
        displayText: "Make Offer",
        paramName: FilterParamName.waysToBuyMakeOffer,
        paramValue: true,
      },
      {
        displayText: "Purchase",
        paramName: FilterParamName.waysToBuyPurchase,
        paramValue: true,
      },
      {
        displayText: "Bid",
        paramName: FilterParamName.waysToBuyBid,
        paramValue: true,
      },
    ]

    const newlySelectedFilters = [
      {
        displayText: "Purchase",
        paramName: FilterParamName.waysToBuyPurchase,
        paramValue: true,
      },
      {
        displayText: "Bid",
        paramName: FilterParamName.waysToBuyBid,
        paramValue: true,
      },
      {
        displayText: "Contact Gallery",
        paramName: FilterParamName.waysToBuyContactGallery,
        paramValue: true,
      },
    ]

    const result = getUnitedSelectedAndAppliedFilters({
      filterType: "artwork",
      selectedFilters: newlySelectedFilters,
      previouslyAppliedFilters,
    })

    expect(result).toEqual([
      {
        displayText: "Purchase",
        paramName: FilterParamName.waysToBuyPurchase,
        paramValue: true,
      },
      {
        displayText: "Bid",
        paramName: FilterParamName.waysToBuyBid,
        paramValue: true,
      },
      {
        displayText: "Contact Gallery",
        paramName: FilterParamName.waysToBuyContactGallery,
        paramValue: true,
      },
      {
        displayText: "Make Offer",
        paramName: FilterParamName.waysToBuyMakeOffer,
        paramValue: true,
      },
    ])
  })

  it("returns only artists options that weren't unselected", () => {
    const previouslyAppliedFilters = [
      {
        displayText: "Artists",
        paramName: FilterParamName.artistIDs,
        paramValue: ["alex-katz", "anne-siems", "cat-sirot", "ceravolo"],
      },
    ]

    const newlySelectedFilters = [
      {
        displayText: "Artists",
        paramName: FilterParamName.artistIDs,
        paramValue: ["anne-siems", "brian-rutenberg", "ceravolo"],
      },
    ]

    const result = getUnitedSelectedAndAppliedFilters({
      filterType: "artwork",
      selectedFilters: newlySelectedFilters,
      previouslyAppliedFilters,
    })

    expect(result).toEqual([
      {
        displayText: "Artists",
        paramName: FilterParamName.artistIDs,
        paramValue: ["anne-siems", "brian-rutenberg", "ceravolo"],
      },
    ])
  })

  it("omits filters with default values", () => {
    const previouslyAppliedFilters = [
      {
        displayText: "Price",
        paramName: FilterParamName.priceRange,
        paramValue: "50000-*",
      },
      {
        displayText: "Size",
        paramName: FilterParamName.sizes,
        paramValue: ["SMALL"],
      },
    ]

    const newlySelectedFilters = [
      {
        displayText: "Medium",
        paramName: FilterParamName.additionalGeneIDs,
        paramValue: ["prints"],
      },
      {
        displayText: "Price",
        paramName: FilterParamName.priceRange,
        paramValue: "*-*",
      },
      {
        displayText: "Size",
        paramName: FilterParamName.sizes,
        paramValue: [],
      },
      {
        displayText: "Color",
        paramName: FilterParamName.colors,
        paramValue: ["blue", "brown"],
      },
    ]

    const result = getUnitedSelectedAndAppliedFilters({
      filterType: "artwork",
      selectedFilters: newlySelectedFilters,
      previouslyAppliedFilters,
    })

    expect(result).toEqual([
      {
        displayText: "Medium",
        paramName: FilterParamName.additionalGeneIDs,
        paramValue: ["prints"],
      },
      {
        displayText: "Color",
        paramName: FilterParamName.colors,
        paramValue: ["blue", "brown"],
      },
    ])
  })
})
