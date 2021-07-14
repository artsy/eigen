import { Aggregations, FilterArray } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  aggregationsWithFollowedArtists,
  changedFiltersParams,
  filterArtworksParams,
  FilterParamName,
  FilterParams,
  getParamsForInputByFilterType,
  prepareFilterArtworksParamsForInput,
  prepareFilterParamsForSaveSearchInput,
  selectedOption,
} from "../ArtworkFilterHelpers"

describe("changedFiltersParams helper", () => {
  it("when a medium selection changed and sort selection unchanged", () => {
    const appliedFilters = filterArtworksParams([
      {
        displayText: "Default",
        paramValue: "-decayed_merch",
        paramName: FilterParamName.sort,
      },
      {
        displayText: "Performance art",
        paramValue: "performance-art",
        paramName: FilterParamName.medium,
      },
    ])
    expect(
      changedFiltersParams(appliedFilters, [
        {
          displayText: "Default",
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
        displayText: "Default",
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
          displayText: "Artwork year (ascending)",
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
        displayText: "Artwork year (descending)",
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
          displayText: "Artwork year (ascending)",
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
        displayText: "Artwork year (ascending)",
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
          displayText: "Default",
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
          displayText: "Default",
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
        displayText: "Default",
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
        displayText: "Buy",
        paramValue: false,
        paramName: FilterParamName.waysToBuyBuy,
      },
      {
        displayText: "Inquire",
        paramValue: false,
        paramName: FilterParamName.waysToBuyInquire,
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
      dimensionRange: "*-*",
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
      dimensionRange: "*-*",
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
        displayText: "Artwork year (descending)",
        paramValue: "-year",
        paramName: FilterParamName.sort,
      },
    ]
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-year",
      medium: "*",
      estimateRange: "",
      priceRange: "*-*",
      dimensionRange: "*-*",
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
        displayText: "Recently updated",
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
        displayText: "Buy",
        paramValue: true,
        paramName: FilterParamName.waysToBuyBuy,
      },
      {
        displayText: "Inquire",
        paramValue: true,
        paramName: FilterParamName.waysToBuyInquire,
      },
      {
        displayText: "Make Offer",
        paramValue: false,
        paramName: FilterParamName.waysToBuyMakeOffer,
      },
      {
        displayText: "All artists I follow",
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
      dimensionRange: "*-*",
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
        paramValue: "artist-1",
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
      dimensionRange: "*-*",
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
        displayText: "Artist 1",
        paramValue: "artist-1",
        paramName: FilterParamName.artistIDs,
      },
      {
        displayText: "Artist 2",
        paramValue: "artist-2",
        paramName: FilterParamName.artistIDs,
      },
    ]
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-decayed_merch",
      medium: "*",
      estimateRange: "",
      priceRange: "*-*",
      dimensionRange: "*-*",
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
          displayText: "Buy",
          paramValue: false,
          paramName: FilterParamName.waysToBuyBuy,
        },
        {
          displayText: "Inquire",
          paramValue: false,
          paramName: FilterParamName.waysToBuyInquire,
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
        dimensionRange: "*-*",
        includeArtworksByFollowedArtists: false,
        inquireableOnly: false,
        atAuction: false,
        acquireable: false,
        offerable: false,
      })
    })
  })
})

describe("selectedOption", () => {
  describe("waysToBuy", () => {
    it("returns the correct result when nothing is selected", () => {
      const selectedOptions = [
        { paramName: FilterParamName.timePeriod, paramValue: "*-*", displayText: "All" },
        {
          paramName: FilterParamName.waysToBuyBuy,
          paramValue: false,
          displayText: "Buy now",
        },
        {
          paramName: FilterParamName.waysToBuyInquire,
          paramValue: false,
          displayText: "Inquire",
        },
        {
          paramName: FilterParamName.waysToBuyMakeOffer,
          paramValue: false,
          displayText: "Make offer",
        },
        {
          paramName: FilterParamName.waysToBuyBid,
          paramValue: false,
          displayText: "Bid",
        },
      ]

      expect(selectedOption({ selectedOptions, filterScreen: "waysToBuy", aggregations: [] })).toEqual("All")
    })

    it("returns the correct result when one item is selected", () => {
      const selectedOptions = [
        { paramName: FilterParamName.timePeriod, paramValue: "*-*", displayText: "All" },
        {
          paramName: FilterParamName.waysToBuyBuy,
          paramValue: true,
          displayText: "Buy now",
        },
        {
          paramName: FilterParamName.waysToBuyInquire,
          paramValue: false,
          displayText: "Inquire",
        },
        {
          paramName: FilterParamName.waysToBuyMakeOffer,
          paramValue: false,
          displayText: "Make offer",
        },
        {
          paramName: FilterParamName.waysToBuyBid,
          paramValue: false,
          displayText: "Bid",
        },
      ]

      expect(selectedOption({ selectedOptions, filterScreen: "waysToBuy", aggregations: [] })).toEqual("Buy now")
    })
    it("returns the correct result when multiple items is selected", () => {
      const selectedOptions = [
        { paramName: FilterParamName.timePeriod, paramValue: "*-*", displayText: "All" },
        {
          paramName: FilterParamName.waysToBuyBuy,
          paramValue: true,
          displayText: "Buy now",
        },
        {
          paramName: FilterParamName.waysToBuyInquire,
          paramValue: false,
          displayText: "Inquire",
        },
        {
          paramName: FilterParamName.waysToBuyMakeOffer,
          paramValue: true,
          displayText: "Make offer",
        },
        {
          paramName: FilterParamName.waysToBuyBid,
          paramValue: false,
          displayText: "Bid",
        },
      ]

      expect(selectedOption({ selectedOptions, filterScreen: "waysToBuy", aggregations: [] })).toEqual(
        "Buy now, Make offer"
      )
    })
  })

  describe("gallery", () => {
    it("returns the correct value in the default case", () => {
      const selectedOptions = [{ paramName: FilterParamName.partnerIDs, displayText: "All" }]

      expect(selectedOption({ selectedOptions, filterScreen: "partnerIDs", aggregations: [] })).toEqual("All")
    })

    it("returns the correct value when an options is selected", () => {
      const selectedOptions = [
        { paramName: FilterParamName.partnerIDs, displayText: "gallery one", filterKey: "gallery" },
      ]

      expect(selectedOption({ selectedOptions, filterScreen: "partnerIDs", aggregations: [] })).toEqual("gallery one")
    })
  })

  describe("artists", () => {
    describe("artworks", () => {
      it("returns the correct value in the default case", () => {
        const selectedOptions = [] as FilterArray

        expect(selectedOption({ selectedOptions, filterScreen: "artistIDs", aggregations: [] })).toEqual("All")
      })

      it("returns the correct value when one artist is selected", () => {
        const selectedOptions = [
          {
            paramName: FilterParamName.artistIDs,
            paramValue: "artist-1",
            displayText: "Artist 1",
          },
        ]

        expect(selectedOption({ selectedOptions, filterScreen: "artistIDs", aggregations: [] })).toEqual("Artist 1")
      })

      it("returns the correct value when multiple artists are selected", () => {
        const selectedOptions = [
          {
            paramName: FilterParamName.artistIDs,
            paramValue: "artist-1",
            displayText: "Z Artist 1",
          },
          {
            paramName: FilterParamName.artistIDs,
            paramValue: "artist-2",
            displayText: "Artist 2",
          },
        ]

        expect(selectedOption({ selectedOptions, filterScreen: "artistIDs", aggregations: [] })).toEqual(
          "Artist 2, 1 more"
        )
      })

      it("returns the correct value when multiple artists and Artist I follow are selected", () => {
        const selectedOptions = [
          {
            paramName: FilterParamName.artistIDs,
            paramValue: "artist-1",
            displayText: "Z Artist 1",
          },
          {
            paramName: FilterParamName.artistIDs,
            paramValue: "artist-2",
            displayText: "Artist 2",
          },
          {
            paramName: FilterParamName.artistsIFollow,
            paramValue: true,
            displayText: "All artists I follow",
          },
        ]

        expect(selectedOption({ selectedOptions, filterScreen: "artistIDs", aggregations: [] })).toEqual(
          "All artists I follow, 2 more"
        )
      })
    })

    describe("saleArtworks", () => {
      const aggregations: Aggregations = [
        {
          slice: "ARTIST",
          counts: [
            { count: 21, name: "Banksy", value: "banksy" },
            { count: 21, name: "Andy Warhol", value: "andy-warhol" },
          ],
        },
        { slice: "MEDIUM", counts: [{ count: 21, name: "Prints", value: "prints" }] },
      ]
      it("returns the correct value in the default case", () => {
        const selectedOptions = [] as FilterArray

        expect(
          selectedOption({ selectedOptions, filterScreen: "artistIDs", aggregations, filterType: "saleArtwork" })
        ).toEqual("All")
      })

      it("returns the correct value when one artist is selected", () => {
        const selectedOptions = [
          {
            paramName: FilterParamName.artistIDs,
            paramValue: ["banksy"],
            displayText: "Artists",
          },
        ]

        expect(
          selectedOption({ selectedOptions, filterScreen: "artistIDs", aggregations, filterType: "saleArtwork" })
        ).toEqual("Banksy")
      })

      it("returns the correct value when multiple artists are selected", () => {
        const selectedOptions = [
          {
            paramName: FilterParamName.artistIDs,
            paramValue: ["banksy", "andy-warhol"],
            displayText: "Artists",
          },
        ]

        expect(
          selectedOption({ selectedOptions, filterScreen: "artistIDs", aggregations, filterType: "saleArtwork" })
        ).toEqual("Andy Warhol, 1 more")
      })
    })
  })

  describe("materialsTerms", () => {
    it("returns the correct result when nothing is selected", () => {
      const selectedOptions = [{ paramName: FilterParamName.materialsTerms, paramValue: [], displayText: "All" }]

      expect(selectedOption({ selectedOptions, filterScreen: "materialsTerms", aggregations: [] })).toEqual("All")
    })

    it("returns the correct result when one item is selected", () => {
      const selectedOptions = [
        { paramName: FilterParamName.timePeriod, paramValue: "*-*", displayText: "All" },
        {
          paramName: FilterParamName.materialsTerms,
          paramValue: ["screen print"],
          displayText: "Screen print",
        },
      ]

      expect(selectedOption({ selectedOptions, filterScreen: "materialsTerms", aggregations: [] })).toEqual(
        "Screen print"
      )
    })
    it("returns the correct result when multiple items is selected", () => {
      const selectedOptions = [
        { paramName: FilterParamName.timePeriod, paramValue: "*-*", displayText: "All" },
        {
          paramName: FilterParamName.materialsTerms,
          paramValue: ["screen print", "paper"],
          displayText: "Screen print, Paper",
        },
      ]

      expect(selectedOption({ selectedOptions, filterScreen: "materialsTerms", aggregations: [] })).toEqual(
        "Screen print, Paper"
      )
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
      dimensionRange: "*-*",
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
      dimensionRange: "*-*",
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
      dimensionRange: "*-*",
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
      dimensionRange: "*-*",
      includeArtworksByFollowedArtists: false,
      inquireableOnly: false,
      medium: "*",
      offerable: false,
      priceRange: "*-*",
      sort: "-decayed_merch",
    })
  })
})

describe("prepareFilterParamsForSaveSearchInput", () => {
  it("returns fields in the saved search criteria format", () => {
    const filters = filterArtworksParams([
      {
        displayText: "Large (over 100cm)",
        paramName: FilterParamName.dimensionRange,
        paramValue: "40.0-*",
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
    ])

    expect(prepareFilterParamsForSaveSearchInput(filters)).toEqual({
      priceRange: "5000-10000",
      attributionClass: ["limited edition"],
      additionalGeneIDs: ["prints"],
      atAuction: true,
      majorPeriods: ["1990"],
      colors: ["yellow", "red"],
      locationCities: ["London, United Kingdom"],
      materialsTerms: ["paper"],
      dimensionRange: "40.0-*",
      partnerIDs: ["cypress-test-partner-for-automated-testing-purposes", "tate-ward-auctions"],
    })
  })

  it("return nothing if only the sort filter is selected", () => {
    const filters = filterArtworksParams([
      {
        displayText: "Recently updated",
        paramName: FilterParamName.sort,
        paramValue: "-partner_updated_at",
      },
    ])

    expect(prepareFilterParamsForSaveSearchInput(filters)).toEqual({})
  })

  it("returns minPrice and maxPrice fields if only the price filter is selected", () => {
    const filters = filterArtworksParams([
      {
        displayText: "$1,000-5,000",
        paramName: FilterParamName.priceRange,
        paramValue: "1000-5000",
      },
    ])

    expect(prepareFilterParamsForSaveSearchInput(filters)).toEqual({
      priceRange: "1000-5000",
    })
  })

  it("returns minPrice field if only the minimum price filter is specified", () => {
    const filters = filterArtworksParams([
      {
        displayText: "$50,000+",
        paramName: FilterParamName.priceRange,
        paramValue: "50000-*",
      },
    ])

    expect(prepareFilterParamsForSaveSearchInput(filters)).toEqual({
      priceRange: "50000-*",
    })
  })

  it("returns the selected `ways to buy` values", () => {
    const filters = filterArtworksParams([
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
    ])

    expect(prepareFilterParamsForSaveSearchInput(filters)).toEqual({
      atAuction: true,
      inquireableOnly: true,
    })
  })

  it("returns custom filter sizes", () => {
    const filters = filterArtworksParams([
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
      {
        displayText: "Custom size",
        paramName: FilterParamName.dimensionRange,
        paramValue: "0-*",
      },
    ])

    expect(prepareFilterParamsForSaveSearchInput(filters)).toEqual({
      dimensionRange: "0-*",
      width: "39.37007874015748-59.05511811023622",
      height: "78.74015748031496-98.4251968503937",
    })
  })

  it("returns only custom width sizes", () => {
    const filters = filterArtworksParams([
      {
        displayText: "100-150",
        paramName: FilterParamName.width,
        paramValue: "12.5-34.6",
      },
      {
        displayText: "Custom size",
        paramName: FilterParamName.dimensionRange,
        paramValue: "0-*",
      },
    ])

    expect(prepareFilterParamsForSaveSearchInput(filters)).toEqual({
      dimensionRange: "0-*",
      width: "12.5-34.6",
    })
  })

  it("returns only custom max width size", () => {
    const filters = filterArtworksParams([
      {
        displayText: "*-500",
        paramName: FilterParamName.width,
        paramValue: "*-196.8503937007874",
      },
      {
        displayText: "Custom size",
        paramName: FilterParamName.dimensionRange,
        paramValue: "0-*",
      },
    ])

    expect(prepareFilterParamsForSaveSearchInput(filters)).toEqual({
      dimensionRange: "0-*",
      width: "*-196.8503937007874",
    })
  })

  it("returns only custom min height size", () => {
    const filters = filterArtworksParams([
      {
        displayText: "100-150",
        paramName: FilterParamName.width,
        paramValue: "10-*",
      },
      {
        displayText: "Custom size",
        paramName: FilterParamName.dimensionRange,
        paramValue: "0-*",
      },
    ])

    expect(prepareFilterParamsForSaveSearchInput(filters)).toEqual({
      dimensionRange: "0-*",
      width: "10-*",
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
