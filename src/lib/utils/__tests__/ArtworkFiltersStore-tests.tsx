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
    }

    const r = reducer(filterState, {
      type: "clearAll",
    })

    expect(r).toEqual({
      appliedFilters: [],
      applyFilters: false,
      selectedFilters: [],
      previouslyAppliedFilters: [],
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
        { filterType: FilterType.waysToBuyBid, paramName: FilterParamName.waysToBuyBid, displayText: "Bid" },
      ],
    }

    filterAction = {
      type: "selectFilters",
      payload: { filterType: FilterType.waysToBuyBid, paramName: FilterParamName.waysToBuyBid, displayText: "Bid" },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
    })
  })

  it("it allows more than one multi-select filter to be selected", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        { filterType: FilterType.waysToBuyBuy, paramName: FilterParamName.waysToBuyBuy, displayText: "Buy Now" },
      ],
    }

    filterAction = {
      type: "selectFilters",
      payload: { filterType: FilterType.waysToBuyBid, paramName: FilterParamName.waysToBuyBid, displayText: "Bid" },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        { filterType: FilterType.waysToBuyBid, paramName: FilterParamName.waysToBuyBid, displayText: "Bid" },
        { filterType: FilterType.waysToBuyBuy, paramName: FilterParamName.waysToBuyBuy, displayText: "Buy Now" },
      ],
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
    })
  })

  it("returns the newly selected filter option when a previously unselected filter is selected", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
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
    })
  })

  it("does not select the default filter when the filter is not applied", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
    }

    filterAction = {
      type: "selectFilters",
      payload: { filterType: FilterType.sort, displayText: "Default", paramName: FilterParamName.sort },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
    })
  })

  it("does not select the default filter when the filter is not applied, even if there are existing selected filters", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        { filterType: FilterType.sort, displayText: "Artwork year (descending)", paramName: FilterParamName.sort },
      ],
    }

    filterAction = {
      type: "selectFilters",
      payload: { filterType: FilterType.sort, displayText: "Default", paramName: FilterParamName.sort },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
    })
  })
})

describe("Apply Filters", () => {
  it("unapplies a toggle/multi-select option filter when de-selected", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [
        { displayText: "Bid", paramName: FilterParamName.waysToBuyBid, filterType: FilterType.waysToBuyBid },
      ],
      previouslyAppliedFilters: [],
      selectedFilters: [
        { displayText: "Bid", paramName: FilterParamName.waysToBuyBid, filterType: FilterType.waysToBuyBid },
      ],
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
    })
  })

  it("it allows more than one multi-select filter to be applied", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        { filterType: FilterType.waysToBuyBid, paramName: FilterParamName.waysToBuyBid, displayText: "Bid" },
        { filterType: FilterType.waysToBuyBuy, paramName: FilterParamName.waysToBuyBuy, displayText: "Buy Now" },
      ],
    }

    filterAction = {
      type: "applyFilters",
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      previouslyAppliedFilters: [
        { filterType: FilterType.waysToBuyBid, paramName: FilterParamName.waysToBuyBid, displayText: "Bid" },
        { filterType: FilterType.waysToBuyBuy, paramName: FilterParamName.waysToBuyBuy, displayText: "Buy Now" },
      ],
      appliedFilters: [
        { filterType: FilterType.waysToBuyBid, paramName: FilterParamName.waysToBuyBid, displayText: "Bid" },
        { filterType: FilterType.waysToBuyBuy, paramName: FilterParamName.waysToBuyBuy, displayText: "Buy Now" },
      ],
      selectedFilters: [],
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
    })
  })
})
