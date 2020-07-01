import { FilterParamName, FilterType } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContextState, FilterActions, reducer } from "lib/utils/ArtworkFiltersStore"

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
      appliedFilters: [
        { displayText: "Recently updated", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      selectedFilters: [
        { displayText: "Artwork year (descending)", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      previouslyAppliedFilters: [
        { displayText: "Recently updated", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      applyFilters: true,
      aggregations: [],
    }

    const r = reducer(filterState, {
      type: "clearAll",
    })

    expect(r).toEqual({
      appliedFilters: [
        { displayText: "Recently updated", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
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
      appliedFilters: [
        { displayText: "Recently updated", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      selectedFilters: [
        { displayText: "Artwork year (descending)", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      previouslyAppliedFilters: [
        { displayText: "Recently updated", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      applyFilters: true,
      aggregations: [],
    }

    const r = reducer(filterState, {
      type: "resetFilters",
    })

    expect(r).toEqual({
      appliedFilters: [
        { displayText: "Recently updated", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      applyFilters: false,
      selectedFilters: [],
      previouslyAppliedFilters: [
        { displayText: "Recently updated", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      aggregations: [],
    })
  })

  it("returns empty arrays/default state values ", () => {
    filterState = {
      appliedFilters: [
        { displayText: "Price (low to high)", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      selectedFilters: [
        { displayText: "Artwork year (descending)", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      applyFilters: false,
      previouslyAppliedFilters: [
        { displayText: "Price (low to high)", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      aggregations: [],
    }

    const r = reducer(filterState, {
      type: "resetFilters",
    })

    expect(r).toEqual({
      appliedFilters: [
        { displayText: "Price (low to high)", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      applyFilters: false,
      selectedFilters: [],
      previouslyAppliedFilters: [
        { displayText: "Price (low to high)", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      aggregations: [],
    })
  })
})

describe("Select Filters", () => {
  it("de-selects a toggle/multi-select option filter when de-selected", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          filterType: FilterType.waysToBuyBid,
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
        filterType: FilterType.waysToBuyBid,
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
          filterType: FilterType.waysToBuyBuy,
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
        filterType: FilterType.waysToBuyBid,
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
          filterType: FilterType.waysToBuyBid,
          paramName: FilterParamName.waysToBuyBid,
          paramValue: true,
          displayText: "Bid",
        },
        {
          filterType: FilterType.waysToBuyBuy,
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
      selectedFilters: [
        { displayText: "Artwork year (descending)", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      aggregations: [],
    }

    filterAction = {
      type: "selectFilters",
      payload: { filterType: FilterType.sort, displayText: "Recently added", paramName: FilterParamName.sort },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        { filterType: FilterType.sort, displayText: "Recently added", paramName: FilterParamName.sort },
      ],
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
        filterType: FilterType.sort,
      },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        { displayText: "Artwork year (descending)", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      aggregations: [],
    })
  })

  it("does not select a filter that is already applied", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [
        { filterType: FilterType.sort, displayText: "Artwork year (descending)", paramName: FilterParamName.sort },
      ],
      previouslyAppliedFilters: [
        { filterType: FilterType.sort, displayText: "Artwork year (descending)", paramName: FilterParamName.sort },
      ],
      selectedFilters: [],
      aggregations: [],
    }

    filterAction = {
      type: "selectFilters",
      payload: {
        displayText: "Artwork year (descending)",
        paramName: FilterParamName.sort,
        filterType: FilterType.sort,
      },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [
        { filterType: FilterType.sort, displayText: "Artwork year (descending)", paramName: FilterParamName.sort },
      ],
      previouslyAppliedFilters: [
        { filterType: FilterType.sort, displayText: "Artwork year (descending)", paramName: FilterParamName.sort },
      ],
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
        filterType: FilterType.sort,
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
          filterType: FilterType.sort,
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
        filterType: FilterType.sort,
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
          filterType: FilterType.waysToBuyBid,
        },
      ],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          displayText: "Bid",
          paramName: FilterParamName.waysToBuyBid,
          paramValue: false,
          filterType: FilterType.waysToBuyBid,
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
          filterType: FilterType.waysToBuyBid,
          paramName: FilterParamName.waysToBuyBid,
          paramValue: true,
          displayText: "Bid",
        },
        {
          filterType: FilterType.waysToBuyBuy,
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
          filterType: FilterType.waysToBuyBid,
          paramName: FilterParamName.waysToBuyBid,
          paramValue: true,
          displayText: "Bid",
        },
        {
          filterType: FilterType.waysToBuyBuy,
          paramName: FilterParamName.waysToBuyBuy,
          paramValue: true,
          displayText: "Buy Now",
        },
      ],
      appliedFilters: [
        {
          filterType: FilterType.waysToBuyBid,
          paramName: FilterParamName.waysToBuyBid,
          paramValue: true,
          displayText: "Bid",
        },
        {
          filterType: FilterType.waysToBuyBuy,
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
      selectedFilters: [
        { displayText: "Artwork year (descending)", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      aggregations: [],
    }

    filterAction = {
      type: "applyFilters",
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [
        { displayText: "Artwork year (descending)", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      previouslyAppliedFilters: [
        { displayText: "Artwork year (descending)", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      selectedFilters: [],
      aggregations: [],
    })
  })

  it("keeps the filters that were already applied", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [
        { displayText: "Recently updated", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      previouslyAppliedFilters: [
        { displayText: "Recently updated", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      selectedFilters: [
        { displayText: "Recently updated", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      aggregations: [],
    }

    filterAction = {
      type: "applyFilters",
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [
        { displayText: "Recently updated", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      previouslyAppliedFilters: [
        { displayText: "Recently updated", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      selectedFilters: [],
      aggregations: [],
    })
  })

  it("replaces previously applied filters with newly selected ones", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [
        { displayText: "Recently updated", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      previouslyAppliedFilters: [
        { displayText: "Recently updated", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      selectedFilters: [
        { displayText: "Artwork year (descending)", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      aggregations: [],
    }

    filterAction = {
      type: "applyFilters",
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [
        { displayText: "Artwork year (descending)", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      previouslyAppliedFilters: [
        { displayText: "Artwork year (descending)", paramName: FilterParamName.sort, filterType: FilterType.sort },
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
        { displayText: "Recently updated", paramName: FilterParamName.sort, filterType: FilterType.sort },
        { displayText: "Jewelry", paramName: FilterParamName.medium, filterType: FilterType.medium },
      ],
      previouslyAppliedFilters: [
        { displayText: "Recently updated", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
      selectedFilters: [
        { displayText: "Artwork year (descending)", paramName: FilterParamName.sort, filterType: FilterType.sort },
      ],
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
