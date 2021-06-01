import { createStore } from "easy-peasy"
import { FilterArray, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { selectedOptionsUnion } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { ArtworkFiltersModel, ArtworkFiltersState } from "../ArtworkFilterStore"

let filterState: ArtworkFiltersState

const getFilterArtworksStore = (state: ArtworkFiltersState) =>
  createStore<ArtworkFiltersModel>({ ...ArtworkFiltersModel, ...state })

describe("Reset Filters", () => {
  it("returns empty arrays/default state values ", () => {
    filterState = {
      appliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      selectedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      applyFilters: true,
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().resetFiltersAction()

    expect(filterArtworksStore.getState()).toEqual({
      appliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      applyFilters: false,
      selectedFilters: [],
      previouslyAppliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    })
  })

  it("returns empty arrays/default state values ", () => {
    filterState = {
      appliedFilters: [{ displayText: "Price (low to high)", paramName: FilterParamName.sort }],
      selectedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      applyFilters: false,
      previouslyAppliedFilters: [{ displayText: "Price (low to high)", paramName: FilterParamName.sort }],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().resetFiltersAction()

    expect(filterArtworksStore.getState()).toEqual({
      appliedFilters: [{ displayText: "Price (low to high)", paramName: FilterParamName.sort }],
      applyFilters: false,
      selectedFilters: [],
      previouslyAppliedFilters: [{ displayText: "Price (low to high)", paramName: FilterParamName.sort }],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
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
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().selectFiltersAction({
      paramName: FilterParamName.artistIDs,
      paramValue: "artist-1",
      displayText: "Artist 1",
    })

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    })
  })

  it("selects an additional multi-select param option", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().selectFiltersAction({
      paramName: FilterParamName.artistIDs,
      paramValue: "artist-2",
      displayText: "Artist 2",
    })

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-2",
          displayText: "Artist 2",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    })
  })

  it("de-selects a multi-select param option", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
        {
          paramName: FilterParamName.artistIDs,
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
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().selectFiltersAction({
      paramName: FilterParamName.artistIDs,
      paramValue: "artist-2",
      displayText: "Artist 2",
    })

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.artistIDs,
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
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    })
  })

  it("de-selects a multi-select param option when one is previously applied", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      previouslyAppliedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().selectFiltersAction({
      paramName: FilterParamName.artistIDs,
      paramValue: "artist-1",
      displayText: "Artist 1",
    })

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: false,
      appliedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      previouslyAppliedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      selectedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
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
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().selectFiltersAction({
      paramName: FilterParamName.waysToBuyBid,
      paramValue: false,
      displayText: "Bid",
    })

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
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
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().selectFiltersAction({
      paramName: FilterParamName.waysToBuyBid,
      paramValue: true,
      displayText: "Bid",
    })

    expect(filterArtworksStore.getState()).toEqual({
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
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    })
  })

  it("returns the previously and newly selected filter option when selectFilters array is not empty ", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore
      .getActions()
      .selectFiltersAction({ displayText: "Recently added", paramName: FilterParamName.sort })

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [{ displayText: "Recently added", paramName: FilterParamName.sort }],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    })
  })

  it("returns the newly selected filter option when a previously unselected filter is selected", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().selectFiltersAction({
      displayText: "Artwork year (descending)",
      paramName: FilterParamName.sort,
    })

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    })
  })

  it("does not select a filter that is already applied", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().selectFiltersAction({
      displayText: "Artwork year (descending)",
      paramName: FilterParamName.sort,
    })

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: false,
      appliedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    })
  })

  it("does not select the default filter when the filter is not applied", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().selectFiltersAction({
      displayText: "Default",
      paramValue: "-decayed_merch",
      paramName: FilterParamName.sort,
    })

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
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
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().selectFiltersAction({
      displayText: "Default",
      paramValue: "-decayed_merch",
      paramName: FilterParamName.sort,
    })

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
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
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().applyFiltersAction()

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: true,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
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
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().applyFiltersAction()

    expect(filterArtworksStore.getState()).toEqual({
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
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    })
  })

  it("applies the selected filters", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().applyFiltersAction()

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: true,
      appliedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    })
  })

  it("keeps the filters that were already applied", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      selectedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().applyFiltersAction()

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: true,
      appliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    })
  })

  it("applies false ways to buy filters correctly", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [{ paramName: FilterParamName.waysToBuyBuy, paramValue: true, displayText: "Buy now" }],
      previouslyAppliedFilters: [{ paramName: FilterParamName.waysToBuyBuy, paramValue: true, displayText: "Buy now" }],
      selectedFilters: [{ paramName: FilterParamName.waysToBuyBuy, paramValue: false, displayText: "Buy now" }],
      aggregations: [],
      filterType: "artwork",
      counts: { total: null, followedArtists: null },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().applyFiltersAction()

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: true,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: { total: null, followedArtists: null },
    })
  })

  it("replaces previously applied filters with newly selected ones", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      selectedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().applyFiltersAction()

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: true,
      appliedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    })
  })

  it("handles a single artistID option", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().applyFiltersAction()

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: true,
      appliedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      previouslyAppliedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    })
  })

  it("handles a selecting multiple artistIDs", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-2",
          displayText: "Artist 2",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().applyFiltersAction()

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: true,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      appliedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-2",
          displayText: "Artist 2",
        },
      ],
      previouslyAppliedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
        {
          paramName: FilterParamName.artistIDs,
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
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ],
      selectedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-2",
          displayText: "Artist 2",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().applyFiltersAction()

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: true,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      appliedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-2",
          displayText: "Artist 2",
        },
      ],
      previouslyAppliedFilters: [
        {
          paramName: FilterParamName.artistIDs,
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
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().clearFiltersZeroStateAction()

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: true,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    })
  })

  it("clears out the selectedFilters", () => {
    filterState = {
      appliedFilters: [],
      selectedFilters: [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [],
      applyFilters: true,
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().clearFiltersZeroStateAction()

    expect(filterArtworksStore.getState()).toEqual({
      appliedFilters: [],
      applyFilters: true,
      selectedFilters: [],
      previouslyAppliedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
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
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore
      .getActions()
      .setInitialFilterStateAction([{ displayText: "Recently updated", paramName: FilterParamName.sort }])

    expect(filterArtworksStore.getState()).toEqual({
      appliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      selectedFilters: [],
      previouslyAppliedFilters: [{ displayText: "Recently updated", paramName: FilterParamName.sort }],
      applyFilters: false,
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    })
  })
})

describe("selectedOptionsUnion", () => {
  describe("artworks", () => {
    it("correctly unions non-artistID params", () => {
      const previouslyAppliedFilters = [{ displayText: "Recently updated", paramName: FilterParamName.sort }]
      const selectedFilters = [{ displayText: "Artwork year (descending)", paramName: FilterParamName.sort }]

      expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters })).toEqual([
        { displayText: "Artwork year (descending)", paramName: FilterParamName.sort },
        {
          displayText: "All",
          paramName: "estimateRange",
          paramValue: "",
        },
        {
          displayText: "All",
          paramName: "medium",
          paramValue: "*",
        },
        {
          displayText: "All",
          paramName: "materialsTerms",
          paramValue: [],
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
          paramName: "partnerIDs",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "locationCities",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "colors",
        },
        {
          displayText: "All",
          paramName: "majorPeriods",
          paramValue: [],
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
        {
          displayText: "All",
          paramName: "artistIDs",
          paramValue: [],
        },
        {
          displayText: "Grid",
          paramName: "viewAs",
          paramValue: false,
        },
        {
          displayText: "All",
          paramName: "attributionClass",
          paramValue: "",
        },
      ])
    })

    it("correctly unions with a single artistID param", () => {
      const previouslyAppliedFilters = [] as FilterArray
      const selectedFilters = [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
      ]

      expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters })).toEqual([
        {
          paramName: FilterParamName.artistIDs,
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
          paramName: "estimateRange",
          paramValue: "",
        },
        {
          displayText: "All",
          paramName: "medium",
          paramValue: "*",
        },
        {
          displayText: "All",
          paramName: "materialsTerms",
          paramValue: [],
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
          paramName: "partnerIDs",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "locationCities",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "colors",
        },
        {
          displayText: "All",
          paramName: "majorPeriods",
          paramValue: [],
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
        {
          displayText: "All",
          paramName: "artistIDs",
          paramValue: [],
        },
        {
          displayText: "Grid",
          paramName: "viewAs",
          paramValue: false,
        },
        {
          displayText: "All",
          paramName: "attributionClass",
          paramValue: "",
        },
      ])
    })

    it("correctly unions with a multiple artistID params", () => {
      const previouslyAppliedFilters = [] as FilterArray
      const selectedFilters = [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-2",
          displayText: "Artist 2",
        },
      ]

      expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters })).toEqual([
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
        {
          paramName: FilterParamName.artistIDs,
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
          paramName: "estimateRange",
          paramValue: "",
        },
        {
          displayText: "All",
          paramName: "medium",
          paramValue: "*",
        },
        {
          displayText: "All",
          paramName: "materialsTerms",
          paramValue: [],
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
          paramName: "partnerIDs",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "locationCities",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "colors",
        },
        {
          displayText: "All",
          paramName: "majorPeriods",
          paramValue: [],
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
        {
          displayText: "All",
          paramName: "artistIDs",
          paramValue: [],
        },
        {
          displayText: "Grid",
          paramName: "viewAs",
          paramValue: false,
        },
        {
          displayText: "All",
          paramName: "attributionClass",
          paramValue: "",
        },
      ])
    })

    it("correctly unions with a multiple artistID params when an artistID has been previously applied", () => {
      const previouslyAppliedFilters = [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-3",
          displayText: "Artist 3",
        },
      ] as FilterArray
      const selectedFilters = [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-2",
          displayText: "Artist 2",
        },
      ]

      expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters })).toEqual([
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-2",
          displayText: "Artist 2",
        },
        {
          paramName: FilterParamName.artistIDs,
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
          paramName: "estimateRange",
          paramValue: "",
        },
        {
          displayText: "All",
          paramName: "medium",
          paramValue: "*",
        },
        {
          displayText: "All",
          paramName: "materialsTerms",
          paramValue: [],
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
          paramName: "partnerIDs",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "locationCities",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "colors",
        },
        {
          displayText: "All",
          paramName: "majorPeriods",
          paramValue: [],
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
        {
          displayText: "All",
          paramName: "artistIDs",
          paramValue: [],
        },
        {
          displayText: "Grid",
          paramName: "viewAs",
          paramValue: false,
        },
        {
          displayText: "All",
          paramName: "attributionClass",
          paramValue: "",
        },
      ])
    })

    it("correctly unions with a multiple artistID params when a duplicate artistID has been previously applied", () => {
      const previouslyAppliedFilters = [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-2",
          displayText: "Artist 2",
        },
      ] as FilterArray
      const selectedFilters = [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-1",
          displayText: "Artist 1",
        },
        {
          paramName: FilterParamName.artistIDs,
          paramValue: "artist-2",
          displayText: "Artist 2",
        },
      ]

      expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters })).toEqual([
        {
          paramName: FilterParamName.artistIDs,
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
          paramName: "estimateRange",
          paramValue: "",
        },
        {
          displayText: "All",
          paramName: "medium",
          paramValue: "*",
        },
        {
          displayText: "All",
          paramName: "materialsTerms",
          paramValue: [],
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
          paramName: "partnerIDs",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "locationCities",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "colors",
        },
        {
          displayText: "All",
          paramName: "majorPeriods",
          paramValue: [],
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
        {
          displayText: "All",
          paramName: "artistIDs",
          paramValue: [],
        },
        {
          displayText: "Grid",
          paramName: "viewAs",
          paramValue: false,
        },
        {
          displayText: "All",
          paramName: "attributionClass",
          paramValue: "",
        },
      ])
    })
  })

  describe("saleArtworks", () => {
    it("correctly sets selected filter", () => {
      const previouslyAppliedFilters = [{ displayText: "Lot number ascending", paramName: FilterParamName.sort }]
      const selectedFilters = [{ displayText: "Lot number descending", paramName: FilterParamName.sort }]

      expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters, filterType: "saleArtwork" })).toEqual([
        { displayText: "Lot number descending", paramName: FilterParamName.sort },
        {
          displayText: "All",
          paramName: "estimateRange",
          paramValue: "",
        },
        {
          displayText: "All",
          paramName: "medium",
          paramValue: "*",
        },
        {
          displayText: "All",
          paramName: "materialsTerms",
          paramValue: [],
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
          paramName: "partnerIDs",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "locationCities",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "colors",
        },
        {
          displayText: "All",
          paramName: "majorPeriods",
          paramValue: [],
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
        {
          displayText: "All",
          paramName: "artistIDs",
          paramValue: [],
        },
        {
          displayText: "Grid",
          paramName: "viewAs",
          paramValue: false,
        },
        {
          displayText: "All",
          paramName: "attributionClass",
          paramValue: "",
        },
      ])
    })

    it("correctly selects a single artistID", () => {
      const previouslyAppliedFilters = [] as FilterArray
      const selectedFilters = [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1"],
          displayText: "Artist 1",
        },
      ]

      expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters, filterType: "saleArtwork" })).toEqual([
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1"],
          displayText: "Artist 1",
        },
        {
          displayText: "Lot number ascending",
          paramName: "sort",
          paramValue: "position",
        },
        {
          displayText: "All",
          paramName: "estimateRange",
          paramValue: "",
        },
        {
          displayText: "All",
          paramName: "medium",
          paramValue: "*",
        },
        {
          displayText: "All",
          paramName: "materialsTerms",
          paramValue: [],
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
          paramName: "partnerIDs",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "locationCities",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "colors",
        },
        {
          displayText: "All",
          paramName: "majorPeriods",
          paramValue: [],
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
        {
          displayText: "Grid",
          paramName: "viewAs",
          paramValue: false,
        },
        {
          displayText: "All",
          paramName: "attributionClass",
          paramValue: "",
        },
      ])
    })

    it("correctly selects multiple artistIDs", () => {
      const previouslyAppliedFilters = [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: [],
          displayText: "All",
        },
      ] as FilterArray
      const selectedFilters = [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1", "artist-2"],
          displayText: "All",
        },
      ]

      expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters, filterType: "saleArtwork" })).toEqual([
        {
          displayText: "All",
          paramName: "artistIDs",
          paramValue: ["artist-1", "artist-2"],
        },
        {
          displayText: "Lot number ascending",
          paramName: "sort",
          paramValue: "position",
        },
        {
          displayText: "All",
          paramName: "estimateRange",
          paramValue: "",
        },
        {
          displayText: "All",
          paramName: "medium",
          paramValue: "*",
        },
        {
          displayText: "All",
          paramName: "materialsTerms",
          paramValue: [],
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
          paramName: "partnerIDs",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "locationCities",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "colors",
        },
        {
          displayText: "All",
          paramName: "majorPeriods",
          paramValue: [],
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
        {
          displayText: "Grid",
          paramName: "viewAs",
          paramValue: false,
        },
        {
          displayText: "All",
          paramName: "attributionClass",
          paramValue: "",
        },
      ])
    })
  })

  describe("showArtworks", () => {
    it("correctly sets defaults", () => {
      const previouslyAppliedFilters = [] as FilterArray
      const selectedFilters = [] as FilterArray

      expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters, filterType: "showArtwork" })).toEqual([
        { displayText: "Gallery Curated", paramName: FilterParamName.sort, paramValue: "partner_show_position" },
        {
          displayText: "All",
          paramName: "estimateRange",
          paramValue: "",
        },
        {
          displayText: "All",
          paramName: "medium",
          paramValue: "*",
        },
        {
          displayText: "All",
          paramName: "materialsTerms",
          paramValue: [],
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
          paramName: "partnerIDs",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "locationCities",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "colors",
        },
        {
          displayText: "All",
          paramName: "majorPeriods",
          paramValue: [],
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
        {
          displayText: "All",
          paramName: "artistIDs",
          paramValue: [],
        },
        {
          displayText: "Grid",
          paramName: "viewAs",
          paramValue: false,
        },
        {
          displayText: "All",
          paramName: "attributionClass",
          paramValue: "",
        },
      ])
    })
  })
})

describe("SetFilterCounts", () => {
  it("Sets the filter counts", () => {
    filterState = {
      appliedFilters: [],
      selectedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().setFiltersCountAction({ total: 1000, followedArtists: 100 })

    expect(filterArtworksStore.getState()).toEqual({
      appliedFilters: [],
      applyFilters: false,
      selectedFilters: [],
      previouslyAppliedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: 1000,
        followedArtists: 100,
      },
    })
  })
})
