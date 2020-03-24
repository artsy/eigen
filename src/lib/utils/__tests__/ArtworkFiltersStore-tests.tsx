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
  it("returns the previously and newly selected filter option when selectFilters array is not empty ", () => {
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

  it("returns the newly selected filter option when a previously unselected filter is selected", () => {
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

  it("does not select a filter that is already applied", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [{ filterType: "sort", value: "Artwork year (descending)" }],
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
      selectedFilters: [],
    })
  })

  it("does not select the default filter when the filter is not applied", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
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
      selectedFilters: [],
    })
  })

  it("does not select the default filter when the filter is not applied, even if there are existing selected filters", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
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
      selectedFilters: [],
    })
  })
})

describe("Apply Filters", () => {
  it("applies the selected filters", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [],
      selectedFilters: [{ value: "Artwork year (descending)", filterType: "sort" }],
    }

    filterAction = {
      type: "applyFilters",
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
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [{ value: "Recently updated", filterType: "sort" }],
      selectedFilters: [],
    })
  })

  it("replaces previously applied filters with newly selected ones", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [{ value: "Recently updated", filterType: "sort" }],
      selectedFilters: [{ value: "Artwork year (descending)", filterType: "sort" }],
    }

    filterAction = {
      type: "applyFilters",
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      applyFilters: true,
      appliedFilters: [{ value: "Artwork year (descending)", filterType: "sort" }],
      selectedFilters: [],
    })
  })
})
