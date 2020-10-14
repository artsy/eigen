import {
  ArtworkFilterContextState,
  FilterActions,
  FilterArray,
  reducer,
  selectedOptionsUnion,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"

let filterState: ArtworkFilterContextState
let filterAction: FilterActions

describe("Clear All Filters", () => {
  it("clears out the previouslyAppliedFilters if nothing has been applied", () => {
    filterState = {
      appliedFilters: [],
      selectedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: [],
    }

    const r = reducer(filterState, {
      type: "clearAll",
    })

    expect(r).toEqual({
      appliedFilters: [],
      applyFilters: false,
      selectedFilters: [],
      previouslyAppliedFilters: [],
      aggregations: [],
    })
  })

  it("clears out the previouslyAppliedFilters and selectedFilters", () => {
    filterState = {
      appliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      selectedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      applyFilters: true,
      aggregations: [],
    }

    const r = reducer(filterState, {
      type: "clearAll",
    })

    expect(r).toEqual({
      appliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      applyFilters: false,
      selectedFilters: [],
      previouslyAppliedFilters: [],
      aggregations: [],
    })
  })
})

describe("Reset Filters", () => {
  it("returns empty arrays/default state values ", () => {
    filterState = {
      appliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      selectedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      applyFilters: true,
      aggregations: [],
    }

    const r = reducer(filterState, {
      type: "resetFilters",
    })

    expect(r).toEqual({
      appliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      applyFilters: false,
      selectedFilters: [],
      previouslyAppliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      aggregations: [],
    })
  })

  it("returns empty arrays/default state values ", () => {
    filterState = {
      appliedFilters: [{ displayText: "Price (low to high)", paramName: FilterParamName.sort }],
      selectedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      applyFilters: false,
      previouslyAppliedFilters: [{ displayText: "Price (low to high)", paramName: FilterParamName.sort }],
      aggregations: [],
    }

    const r = reducer(filterState, {
      type: "resetFilters",
    })

    expect(r).toEqual({
      appliedFilters: [{ displayText: "Price (low to high)", paramName: FilterParamName.sort }],
      applyFilters: false,
      selectedFilters: [],
      previouslyAppliedFilters: [{ displayText: "Price (low to high)", paramName: FilterParamName.sort }],
      aggregations: [],
    })
  })
})

describe("Select Filters", () => {
  it("selects a single multi-select param option", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
      aggregations: [],
    }

    filterAction = {
      type: "selectFilters",
      payload: {
        paramName: FilterParamName.artist,
        paramValue: "artist-1",
        displayText: "Artist 1",
      },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      aggregations: [],
    })
  })

  it("selects an additional multi-select param option", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      aggregations: [],
    }

    filterAction = {
      type: "selectFilters",
      payload: {
        paramName: FilterParamName.artist,
        paramValue: "artist-2",
        displayText: "Artist 2",
      },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-2",
          displayText: "Artist 2",
        },
      ],
      aggregations: [],
    })
  })

  it("de-selects a multi-select param option", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-2",
          displayText: "Artist 2",
        },
        {
          paramName: FilterParamName.waysToBuyBid,
          paramValue: true,
          displayText: "Bid",
        },
      ],
      aggregations: [],
    }

    filterAction = {
      type: "selectFilters",
      payload: {
        paramName: FilterParamName.artist,
        paramValue: "artist-2",
        displayText: "Artist 2",
      },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
        {
          paramName: FilterParamName.waysToBuyBid,
          paramValue: true,
          displayText: "Bid",
        },
      ],
      aggregations: [],
    })
  })

  it("de-selects a multi-select param option when one is previously applied", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      previouslyAppliedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      selectedFilters: [],
      aggregations: [],
    }

    filterAction = {
      type: "selectFilters",
      payload: {
        paramName: FilterParamName.artist,
        paramValue: "artist-1",
        displayText: "Artist 1",
      },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      previouslyAppliedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      selectedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      aggregations: [],
    })
  })

  it("de-selects a toggle/multi-select option filter when de-selected", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.waysToBuyBid,
          paramValue: true,
          displayText: "Bid",
        },
      ],
      aggregations: [],
    }

    filterAction = {
      type: "selectFilters",
      payload: {
        paramName: FilterParamName.waysToBuyBid,
        paramValue: false,
        displayText: "Bid",
      },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
      aggregations: [],
    })
  })

  it("it allows more than one multi-select filter to be selected", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.waysToBuyBuy,
          paramValue: true,
          displayText: "Buy Now",
        },
      ],
      aggregations: [],
    }

    filterAction = {
      type: "selectFilters",
      payload: {
        paramName: FilterParamName.waysToBuyBid,
        paramValue: true,
        displayText: "Bid",
      },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.waysToBuyBid,
          paramValue: true,
          displayText: "Bid",
        },
        {
          paramName: FilterParamName.waysToBuyBuy,
          paramValue: true,
          displayText: "Buy Now",
        },
      ],
      aggregations: [],
    })
  })

  it("returns the previously and newly selected filter option when selectFilters array is not empty ", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      aggregations: [],
    }

    filterAction = {
      type: "selectFilters",
      payload: { displayText: "Recently added", paramName: FilterParamName.sort },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [{ displayText: "Recently added", paramName: FilterParamName.sort }],
      aggregations: [],
    })
  })

  it("returns the newly selected filter option when a previously unselected filter is selected", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
      aggregations: [],
    }

    filterAction = {
      type: "selectFilters",
      payload: {
        displayText: "Artwork year (descending)",
        paramName: FilterParamName.sort,
      },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      aggregations: [],
    })
  })

  it("does not select a filter that is already applied", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      selectedFilters: [],
      aggregations: [],
    }

    filterAction = {
      type: "selectFilters",
      payload: {
        displayText: "Artwork year (descending)",
        paramName: FilterParamName.sort,
      },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      selectedFilters: [],
      aggregations: [],
    })
  })

  it("does not select the default filter when the filter is not applied", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
      aggregations: [],
    }

    filterAction = {
      type: "selectFilters",
      payload: {
        displayText: "Default",
        paramValue: "-decayed_merch",
        paramName: FilterParamName.sort,
      },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
      aggregations: [],
    })
  })

  it("does not select the default filter when the filter is not applied, even if there are existing selected filters", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          displayText: "Artwork year (descending)",
          paramValue: "-year",
          paramName: FilterParamName.sort,
        },
      ],
      aggregations: [],
    }

    filterAction = {
      type: "selectFilters",
      payload: {
        displayText: "Default",
        paramValue: "-decayed_merch",
        paramName: FilterParamName.sort,
      },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
      aggregations: [],
    })
  })
})

describe("Apply Filters", () => {
  it("unapplies a toggle/multi-select option filter when de-selected", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [
        {
          displayText: "Bid",
          paramName: FilterParamName.waysToBuyBid,
          paramValue: true,
        },
      ],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          displayText: "Bid",
          paramName: FilterParamName.waysToBuyBid,
          paramValue: false,
        },
      ],
      aggregations: [],
    }

    filterAction = {
      type: "applyFilters",
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
      aggregations: [],
    })
  })

  it("it allows more than one multi-select filter to be applied", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.waysToBuyBid,
          paramValue: true,
          displayText: "Bid",
        },
        {
          paramName: FilterParamName.waysToBuyBuy,
          paramValue: true,
          displayText: "Buy Now",
        },
      ],
      aggregations: [],
    }

    filterAction = {
      type: "applyFilters",
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      previouslyAppliedFilters: [
        {
          paramName: FilterParamName.waysToBuyBid,
          paramValue: true,
          displayText: "Bid",
        },
        {
          paramName: FilterParamName.waysToBuyBuy,
          paramValue: true,
          displayText: "Buy Now",
        },
      ],
      appliedFilters: [
        {
          paramName: FilterParamName.waysToBuyBid,
          paramValue: true,
          displayText: "Bid",
        },
        {
          paramName: FilterParamName.waysToBuyBuy,
          paramValue: true,
          displayText: "Buy Now",
        },
      ],
      selectedFilters: [],
      aggregations: [],
    })
  })

  it("applies the selected filters", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      aggregations: [],
    }

    filterAction = {
      type: "applyFilters",
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      selectedFilters: [],
      aggregations: [],
    })
  })

  it("keeps the filters that were already applied", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      selectedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      aggregations: [],
    }

    filterAction = {
      type: "applyFilters",
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      selectedFilters: [],
      aggregations: [],
    })
  })

  it("replaces previously applied filters with newly selected ones", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      selectedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      aggregations: [],
    }

    filterAction = {
      type: "applyFilters",
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      selectedFilters: [],
      aggregations: [],
    })
  })

  it("handles a single artistID option", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      aggregations: [],
    }

    const r = reducer(filterState, {
      type: "applyFilters",
    })

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      previouslyAppliedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      selectedFilters: [],
      aggregations: [],
    })
  })

  it("handles a selecting multiple artistIDs", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-2",
          displayText: "Artist 2",
        },
      ],
      aggregations: [],
    }

    const r = reducer(filterState, {
      type: "applyFilters",
    })

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-2",
          displayText: "Artist 2",
        },
      ],
      previouslyAppliedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-2",
          displayText: "Artist 2",
        },
      ],
      selectedFilters: [],
      aggregations: [],
    })
  })

  it("handles a selecting multiple artistIDs and deselecting one that was previously applied", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [],
      previouslyAppliedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      selectedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-2",
          displayText: "Artist 2",
        },
      ],
      aggregations: [],
    }

    const r = reducer(filterState, {
      type: "applyFilters",
    })

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-2",
          displayText: "Artist 2",
        },
      ],
      previouslyAppliedFilters: [
        {
          paramName: FilterParamName.artist,
          paramValue: "artist-2",
          displayText: "Artist 2",
        },
      ],
      selectedFilters: [],
      aggregations: [],
    })
  })
})

describe("clearFiltersZeroState", () => {
  it("resets the artwork filter when artworks are in zero state", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [
        { displayText: "Recently updated", paramName: FilterParamName.sort },
        { displayText: "Jewelry", paramName: FilterParamName.medium },
      ],
      previouslyAppliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      selectedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      aggregations: [],
    }

    filterAction = {
      type: "clearFiltersZeroState",
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
      aggregations: [],
    })
  })
})

describe("SetInitialFilterState", () => {
  it("sets the payload to currently applied filters and previously applied filters", () => {
    filterState = {
      appliedFilters: [],
      selectedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: [],
    }

    filterAction = {
      type: "setInitialFilterState",
      payload: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      appliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      selectedFilters: [],
      previouslyAppliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      applyFilters: false,
      aggregations: [],
    })
  })
})

describe("selectedOptionsUnion", () => {
  it("correctly unions non-artistID params", () => {
    const previouslyAppliedFilters = [{ displayText: "Recently updated", paramName: FilterParamName.sort }]
    const selectedFilters = [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }]

    expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters })).toEqual([
      { displayText: "Artwork year (descending)", paramName: FilterParamName.sort },
      {
        displayText: "All",
        paramName: "medium",
        paramValue: "*",
      },
      {
        displayText: "All",
        paramName: "priceRange",
        paramValue: "*-*",
      },
      {
        displayText: "All",
        paramName: "dimensionRange",
        paramValue: "*-*",
      },
      {
        displayText: "All",
        paramName: "partnerID",
      },
      {
        displayText: "All",
        paramName: "color",
      },
      {
        displayText: "All",
        paramName: "majorPeriods",
        paramValue: "*-*",
      },
      {
        displayText: "Buy now",
        paramName: "acquireable",
        paramValue: false,
      },
      {
        displayText: "Inquire",
        paramName: "inquireableOnly",
        paramValue: false,
      },
      {
        displayText: "Make offer",
        paramName: "offerable",
        paramValue: false,
      },
      {
        displayText: "Bid",
        paramName: "atAuction",
        paramValue: false,
      },
      {
        displayText: "All artists I follow",
        paramName: "includeArtworksByFollowedArtists",
        paramValue: false,
      },
    ])
  })

  it("correctly unions with a single artistID param", () => {
    const previouslyAppliedFilters = [] as FilterArray
    const selectedFilters = [
      {
        paramName: FilterParamName.artist,
        paramValue: "artist-1",
        displayText: "Artist 1",
      },
    ]

    expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters })).toEqual([
      {
        paramName: FilterParamName.artist,
        paramValue: "artist-1",
        displayText: "Artist 1",
      },
      {
        displayText: "Default",
        paramName: "sort",
        paramValue: "-decayed_merch",
      },
      {
        displayText: "All",
        paramName: "medium",
        paramValue: "*",
      },
      {
        displayText: "All",
        paramName: "priceRange",
        paramValue: "*-*",
      },
      {
        displayText: "All",
        paramName: "dimensionRange",
        paramValue: "*-*",
      },
      {
        displayText: "All",
        paramName: "partnerID",
      },
      {
        displayText: "All",
        paramName: "color",
      },
      {
        displayText: "All",
        paramName: "majorPeriods",
        paramValue: "*-*",
      },
      {
        displayText: "Buy now",
        paramName: "acquireable",
        paramValue: false,
      },
      {
        displayText: "Inquire",
        paramName: "inquireableOnly",
        paramValue: false,
      },
      {
        displayText: "Make offer",
        paramName: "offerable",
        paramValue: false,
      },
      {
        displayText: "Bid",
        paramName: "atAuction",
        paramValue: false,
      },
      {
        displayText: "All artists I follow",
        paramName: "includeArtworksByFollowedArtists",
        paramValue: false,
      },
    ])
  })

  it("correctly unions with a multiple artistID params", () => {
    const previouslyAppliedFilters = [] as FilterArray
    const selectedFilters = [
      {
        paramName: FilterParamName.artist,
        paramValue: "artist-1",
        displayText: "Artist 1",
      },
      {
        paramName: FilterParamName.artist,
        paramValue: "artist-2",
        displayText: "Artist 2",
      },
    ]

    expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters })).toEqual([
      {
        paramName: FilterParamName.artist,
        paramValue: "artist-1",
        displayText: "Artist 1",
      },
      {
        paramName: FilterParamName.artist,
        paramValue: "artist-2",
        displayText: "Artist 2",
      },
      {
        displayText: "Default",
        paramName: "sort",
        paramValue: "-decayed_merch",
      },
      {
        displayText: "All",
        paramName: "medium",
        paramValue: "*",
      },
      {
        displayText: "All",
        paramName: "priceRange",
        paramValue: "*-*",
      },
      {
        displayText: "All",
        paramName: "dimensionRange",
        paramValue: "*-*",
      },
      {
        displayText: "All",
        paramName: "partnerID",
      },
      {
        displayText: "All",
        paramName: "color",
      },
      {
        displayText: "All",
        paramName: "majorPeriods",
        paramValue: "*-*",
      },
      {
        displayText: "Buy now",
        paramName: "acquireable",
        paramValue: false,
      },
      {
        displayText: "Inquire",
        paramName: "inquireableOnly",
        paramValue: false,
      },
      {
        displayText: "Make offer",
        paramName: "offerable",
        paramValue: false,
      },
      {
        displayText: "Bid",
        paramName: "atAuction",
        paramValue: false,
      },
      {
        displayText: "All artists I follow",
        paramName: "includeArtworksByFollowedArtists",
        paramValue: false,
      },
    ])
  })

  it("correctly unions with a multiple artistID params when an artistID has been previously applied", () => {
    const previouslyAppliedFilters = [
      {
        paramName: FilterParamName.artist,
        paramValue: "artist-3",
        displayText: "Artist 3",
      },
    ] as FilterArray
    const selectedFilters = [
      {
        paramName: FilterParamName.artist,
        paramValue: "artist-1",
        displayText: "Artist 1",
      },
      {
        paramName: FilterParamName.artist,
        paramValue: "artist-2",
        displayText: "Artist 2",
      },
    ]

    expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters })).toEqual([
      {
        paramName: FilterParamName.artist,
        paramValue: "artist-1",
        displayText: "Artist 1",
      },
      {
        paramName: FilterParamName.artist,
        paramValue: "artist-2",
        displayText: "Artist 2",
      },
      {
        paramName: FilterParamName.artist,
        paramValue: "artist-3",
        displayText: "Artist 3",
      },
      {
        displayText: "Default",
        paramName: "sort",
        paramValue: "-decayed_merch",
      },
      {
        displayText: "All",
        paramName: "medium",
        paramValue: "*",
      },
      {
        displayText: "All",
        paramName: "priceRange",
        paramValue: "*-*",
      },
      {
        displayText: "All",
        paramName: "dimensionRange",
        paramValue: "*-*",
      },
      {
        displayText: "All",
        paramName: "partnerID",
      },
      {
        displayText: "All",
        paramName: "color",
      },
      {
        displayText: "All",
        paramName: "majorPeriods",
        paramValue: "*-*",
      },
      {
        displayText: "Buy now",
        paramName: "acquireable",
        paramValue: false,
      },
      {
        displayText: "Inquire",
        paramName: "inquireableOnly",
        paramValue: false,
      },
      {
        displayText: "Make offer",
        paramName: "offerable",
        paramValue: false,
      },
      {
        displayText: "Bid",
        paramName: "atAuction",
        paramValue: false,
      },
      {
        displayText: "All artists I follow",
        paramName: "includeArtworksByFollowedArtists",
        paramValue: false,
      },
    ])
  })

  it("correctly unions with a multiple artistID params when a duplicate artistID has been previously applied", () => {
    const previouslyAppliedFilters = [
      {
        paramName: FilterParamName.artist,
        paramValue: "artist-2",
        displayText: "Artist 2",
      },
    ] as FilterArray
    const selectedFilters = [
      {
        paramName: FilterParamName.artist,
        paramValue: "artist-1",
        displayText: "Artist 1",
      },
      {
        paramName: FilterParamName.artist,
        paramValue: "artist-2",
        displayText: "Artist 2",
      },
    ]

    expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters })).toEqual([
      {
        paramName: FilterParamName.artist,
        paramValue: "artist-1",
        displayText: "Artist 1",
      },
      {
        displayText: "Default",
        paramName: "sort",
        paramValue: "-decayed_merch",
      },
      {
        displayText: "All",
        paramName: "medium",
        paramValue: "*",
      },
      {
        displayText: "All",
        paramName: "priceRange",
        paramValue: "*-*",
      },
      {
        displayText: "All",
        paramName: "dimensionRange",
        paramValue: "*-*",
      },
      {
        displayText: "All",
        paramName: "partnerID",
      },
      {
        displayText: "All",
        paramName: "color",
      },
      {
        displayText: "All",
        paramName: "majorPeriods",
        paramValue: "*-*",
      },
      {
        displayText: "Buy now",
        paramName: "acquireable",
        paramValue: false,
      },
      {
        displayText: "Inquire",
        paramName: "inquireableOnly",
        paramValue: false,
      },
      {
        displayText: "Make offer",
        paramName: "offerable",
        paramValue: false,
      },
      {
        displayText: "Bid",
        paramName: "atAuction",
        paramValue: false,
      },
      {
        displayText: "All artists I follow",
        paramName: "includeArtworksByFollowedArtists",
        paramValue: false,
      },
    ])
  })
})
