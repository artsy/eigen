import { ArtworkFilterContextState, FilterActions, reducer } from "lib/utils/ArtworkFiltersStore"

let filterState: ArtworkFilterContextState
let filterAction: FilterActions

describe("Reset Filters", () => {
  filterAction = {
    type: "resetFilters",
  }

  it("returns empty arrays/default state values ", () => {
    filterState = {
      appliedFilters: [{ type: "Recently updated", filter: "sort" }],
      selectedFilters: [{ type: "Artwork year (descending)", filter: "sort" }],
      applyFilters: true,
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      appliedFilters: [],
      applyFilters: false,
      selectedFilters: [],
    })
  })

  it("returns empty arrays/default state values ", () => {
    filterState = {
      appliedFilters: [{ type: "Price (low to high)", filter: "sort" }],
      selectedFilters: [{ type: "Artwork year (descending)", filter: "sort" }],
      applyFilters: false,
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      appliedFilters: [],
      applyFilters: false,
      selectedFilters: [],
    })
  })
})

describe("Select Filters", () => {
  it("the previously and newly selected filter option when selectFilters array is not empty ", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      selectedFilters: [{ type: "Artwork year (descending)", filter: "sort" }],
    }

    filterAction = {
      type: "selectFilters",
      payload: { type: "Recently added", filter: "sort" },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      selectedFilters: [{ type: "Recently added", filter: "sort" }],
    })
  })

  it("the newly selected filter option is returned when a previously unselected filter is selected", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      selectedFilters: [],
    }

    filterAction = {
      type: "selectFilters",
      payload: { type: "Artwork year (descending)", filter: "sort" },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      selectedFilters: [{ type: "Artwork year (descending)", filter: "sort" }],
    })
  })
})

describe("Apply Filters", () => {
  it("returns just the applied filter if nothing was previously selected", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [],
      selectedFilters: [],
    }

    filterAction = {
      type: "applyFilters",
      payload: [{ type: "Artwork year (descending)", filter: "sort" }],
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [{ type: "Artwork year (descending)", filter: "sort" }],
      selectedFilters: [],
    })
  })

  it("keeps the filters that were already applied", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [{ type: "Recently updated", filter: "sort" }],
      selectedFilters: [{ type: "Recently updated", filter: "sort" }],
    }

    filterAction = {
      type: "applyFilters",
      payload: [{ type: "Recently updated", filter: "sort" }],
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [{ type: "Recently updated", filter: "sort" }],
      selectedFilters: [],
    })
  })
})
