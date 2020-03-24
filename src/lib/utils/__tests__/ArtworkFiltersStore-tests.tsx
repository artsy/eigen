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
      selectedSortOption: "Default",
      applyFilters: true,
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      appliedFilters: [],
      applyFilters: false,
      selectedFilters: [],
      selectedSortOption: "Default",
    })
  })

  it("returns empty arrays/default state values ", () => {
    filterState = {
      appliedFilters: [{ type: "Price (low to high)", filter: "sort" }],
      selectedFilters: [{ type: "Artwork year (descending)", filter: "sort" }],
      selectedSortOption: "Artwork year (descending)",
      applyFilters: false,
    }

    const r = reducer(filterState, filterAction)

    expect(r).toEqual({
      appliedFilters: [],
      applyFilters: false,
      selectedFilters: [],
      selectedSortOption: "Default",
    })
  })
})

describe("Select Filters", () => {
  it("the previously and newly selected filter option when selectFilters array is not empty ", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      selectedFilters: [{ type: "Artwork year (descending)", filter: "sort" }],
      selectedSortOption: "Recently added",
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
      selectedSortOption: "Recently added",
    })
  })

  it("the newly selected filter option is returned when a previously unselected filter is selected", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      selectedFilters: [],
      selectedSortOption: "Artwork year (descending)",
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
      selectedSortOption: "Artwork year (descending)",
    })
  })
})

describe("Apply Filters", () => {
  it("returns just the applied filter if nothing was previously selected", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [],
      selectedFilters: [],
      selectedSortOption: "Artwork year (descending)",
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
      selectedSortOption: "Artwork year (descending)",
    })
  })

  it("keeps the filters that were already applied", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [{ type: "Recently updated", filter: "sort" }],
      selectedFilters: [{ type: "Recently updated", filter: "sort" }],
      selectedSortOption: "Recently updated",
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
      selectedSortOption: "Recently updated",
    })
  })
})
