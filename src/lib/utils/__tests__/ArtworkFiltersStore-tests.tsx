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
      appliedFilters: [{ value: "Recently updated", filterType: "sort" }],
      selectedFilters: [{ value: "Artwork year (descending)", filterType: "sort" }],
      previouslyAppliedFilters: [{ value: "Recently updated", filterType: "sort" }],
      applyFilters: true,
    }

    const r = reducer(filterState, {
      type: "clearAll",
    })

    expect(r).toEqual({
      appliedFilters: [{ value: "Recently updated", filterType: "sort" }],
      applyFilters: false,
      selectedFilters: [],
      previouslyAppliedFilters: [],
    })
  })
})

describe("Reset Filters", () => {
  it("returns empty arrays/default state values ", () => {
    filterState = {
      appliedFilters: [{ value: "Recently updated", filterType: "sort" }],
      selectedFilters: [{ value: "Artwork year (descending)", filterType: "sort" }],
      previouslyAppliedFilters: [{ value: "Recently updated", filterType: "sort" }],
      applyFilters: true,
    }

    const r = reducer(filterState, {
      type: "resetFilters",
    })

    expect(r).toEqual({
      appliedFilters: [{ value: "Recently updated", filterType: "sort" }],
      applyFilters: false,
      selectedFilters: [],
      previouslyAppliedFilters: [{ value: "Recently updated", filterType: "sort" }],
    })
  })

  it("returns empty arrays/default state values ", () => {
    filterState = {
      appliedFilters: [{ value: "Price (low to high)", filterType: "sort" }],
      selectedFilters: [{ value: "Artwork year (descending)", filterType: "sort" }],
      applyFilters: false,
      previouslyAppliedFilters: [{ value: "Price (low to high)", filterType: "sort" }],
    }

    const r = reducer(filterState, {
      type: "resetFilters",
    })

    expect(r).toEqual({
      appliedFilters: [{ value: "Price (low to high)", filterType: "sort" }],
      applyFilters: false,
      selectedFilters: [],
      previouslyAppliedFilters: [{ value: "Price (low to high)", filterType: "sort" }],
    })
  })
})

describe("Select Filters", () => {
  it("de-selects a toggle/multi-select option filter when de-selected", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [{ value: true, filterType: "waysToBuyBid" }],
    }

    filterAction = {
      type: "selectFilters",
      payload: { value: false, filterType: "waysToBuyBid" },
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
    let r

    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [{ value: true, filterType: "waysToBuyBuy" }],
    }

    filterAction = {
      type: "selectFilters",
      payload: { value: true, filterType: "waysToBuyBid" },
    }

    r = reducer(filterState, filterAction)
    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        { filterType: "waysToBuyBid", value: true },
        { filterType: "waysToBuyBuy", value: true },
      ],
    })
  })

  it("returns the previously and newly selected filter option when selectFilters array is not empty ", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [{ value: "Artwork year (descending)", filterType: "sort" }],
    }

    filterAction = {
      type: "selectFilters",
      payload: { value: "Recently added", filterType: "sort" },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [{ value: "Recently added", filterType: "sort" }],
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
      payload: { value: "Artwork year (descending)", filterType: "sort" },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [{ value: "Artwork year (descending)", filterType: "sort" }],
    })
  })

  it("does not select a filter that is already applied", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [{ filterType: "sort", value: "Artwork year (descending)" }],
      previouslyAppliedFilters: [{ filterType: "sort", value: "Artwork year (descending)" }],
      selectedFilters: [],
    }

    filterAction = {
      type: "selectFilters",
      payload: { value: "Artwork year (descending)", filterType: "sort" },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [{ filterType: "sort", value: "Artwork year (descending)" }],
      previouslyAppliedFilters: [{ filterType: "sort", value: "Artwork year (descending)" }],
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
      payload: { value: "Default", filterType: "sort" },
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
      selectedFilters: [{ filterType: "sort", value: "Artwork year (descending)" }],
    }

    filterAction = {
      type: "selectFilters",
      payload: { value: "Default", filterType: "sort" },
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
      appliedFilters: [{ value: true, filterType: "waysToBuyBid" }],
      previouslyAppliedFilters: [],
      selectedFilters: [{ value: false, filterType: "waysToBuyBid" }],
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
        { filterType: "waysToBuyBid", value: true },
        { filterType: "waysToBuyBuy", value: true },
      ],
    }

    filterAction = {
      type: "applyFilters",
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      previouslyAppliedFilters: [
        { filterType: "waysToBuyBid", value: true },
        { filterType: "waysToBuyBuy", value: true },
      ],
      appliedFilters: [
        { filterType: "waysToBuyBid", value: true },
        { filterType: "waysToBuyBuy", value: true },
      ],
      selectedFilters: [],
    })
  })

  it("applies the selected filters", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [{ value: "Artwork year (descending)", filterType: "sort" }],
    }

    filterAction = {
      type: "applyFilters",
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [{ value: "Artwork year (descending)", filterType: "sort" }],
      previouslyAppliedFilters: [{ value: "Artwork year (descending)", filterType: "sort" }],
      selectedFilters: [],
    })
  })

  it("keeps the filters that were already applied", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [{ value: "Recently updated", filterType: "sort" }],
      previouslyAppliedFilters: [{ value: "Recently updated", filterType: "sort" }],
      selectedFilters: [{ value: "Recently updated", filterType: "sort" }],
    }

    filterAction = {
      type: "applyFilters",
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [{ value: "Recently updated", filterType: "sort" }],
      previouslyAppliedFilters: [{ value: "Recently updated", filterType: "sort" }],
      selectedFilters: [],
    })
  })

  it("replaces previously applied filters with newly selected ones", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [{ value: "Recently updated", filterType: "sort" }],
      previouslyAppliedFilters: [{ value: "Recently updated", filterType: "sort" }],
      selectedFilters: [{ value: "Artwork year (descending)", filterType: "sort" }],
    }

    filterAction = {
      type: "applyFilters",
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [{ value: "Artwork year (descending)", filterType: "sort" }],
      previouslyAppliedFilters: [{ value: "Artwork year (descending)", filterType: "sort" }],
      selectedFilters: [],
    })
  })
})

describe("clearFiltersZeroState", () => {
  it("resets the artwork filter when artworks are in zero state", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [
        { value: "Recently updated", filterType: "sort" },
        { value: "Jewelry", filterType: "medium" },
      ],
      previouslyAppliedFilters: [{ value: "Recently updated", filterType: "sort" }],
      selectedFilters: [{ value: "Artwork year (descending)", filterType: "sort" }],
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
