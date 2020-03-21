import { ArtworkFilterContextState, FilterActions, reducer } from "lib/utils/ArtworkFiltersStore"

let filterState: ArtworkFilterContextState
let filterAction: FilterActions

describe("Reset Filters", () => {
  filterAction = {
    type: "resetFilters",
  }

  it("returns empty arrays/default state values ", () => {
    filterState = {
      appliedFilters: [{ value: "Recently updated", filterType: "sort" }],
      selectedFilters: [{ value: "Artwork year (descending)", filterType: "sort" }],
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
      appliedFilters: [{ value: "Price (low to high)", filterType: "sort" }],
      selectedFilters: [{ value: "Artwork year (descending)", filterType: "sort" }],
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
      selectedFilters: [{ value: "Recently added", filterType: "sort" }],
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
      payload: { value: "Artwork year (descending)", filterType: "sort" },
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: false,
      appliedFilters: [],
      selectedFilters: [{ value: "Artwork year (descending)", filterType: "sort" }],
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
      payload: [{ value: "Artwork year (descending)", filterType: "sort" }],
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [{ value: "Artwork year (descending)", filterType: "sort" }],
      selectedFilters: [],
    })
  })

  it("keeps the filters that were already applied", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [{ value: "Recently updated", filterType: "sort" }],
      selectedFilters: [{ value: "Recently updated", filterType: "sort" }],
    }

    filterAction = {
      type: "applyFilters",
      payload: [{ value: "Recently updated", filterType: "sort" }],
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [{ value: "Recently updated", filterType: "sort" }],
      selectedFilters: [],
    })
  })
})
