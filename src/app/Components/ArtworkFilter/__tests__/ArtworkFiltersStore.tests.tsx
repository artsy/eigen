import { FilterArray, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  getArtworkFiltersModel,
  selectedOptionsUnion,
  ArtworkFiltersModel,
  ArtworkFiltersState,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { createStore } from "easy-peasy"

let filterState: ArtworkFiltersState

const getFilterArtworksStore = (state: ArtworkFiltersState) =>
  createStore<ArtworkFiltersModel>({ ...getArtworkFiltersModel(), ...state })

describe("Reset Filters", () => {
  it("returns empty arrays/default state values ", () => {
    filterState = {
      appliedFilters: [{ displayText: "Recently Updated", paramName: FilterParamName.sort }],
      selectedFilters: [
        { displayText: "Artwork Year (Descending)", paramName: FilterParamName.sort },
      ],
      previouslyAppliedFilters: [
        { displayText: "Recently Updated", paramName: FilterParamName.sort },
      ],
      applyFilters: true,
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().resetFiltersAction()

    expect(filterArtworksStore.getState()).toEqual({
      appliedFilters: [{ displayText: "Recently Updated", paramName: FilterParamName.sort }],
      applyFilters: false,
      selectedFilters: [],
      previouslyAppliedFilters: [
        { displayText: "Recently Updated", paramName: FilterParamName.sort },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    })
  })

  it("returns empty arrays/default state values ", () => {
    filterState = {
      appliedFilters: [{ displayText: "Price (Low to High)", paramName: FilterParamName.sort }],
      selectedFilters: [
        { displayText: "Artwork Year (Descending)", paramName: FilterParamName.sort },
      ],
      applyFilters: false,
      previouslyAppliedFilters: [
        { displayText: "Price (Low to High)", paramName: FilterParamName.sort },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().resetFiltersAction()

    expect(filterArtworksStore.getState()).toEqual({
      appliedFilters: [{ displayText: "Price (Low to High)", paramName: FilterParamName.sort }],
      applyFilters: false,
      selectedFilters: [],
      previouslyAppliedFilters: [
        { displayText: "Price (Low to High)", paramName: FilterParamName.sort },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().selectFiltersAction({
      paramName: FilterParamName.artistIDs,
      paramValue: ["artist-1"],
      displayText: "Artist 1",
    })

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1"],
          displayText: "Artist 1",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
          paramValue: ["artist-1"],
          displayText: "Artist 1",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().selectFiltersAction({
      paramName: FilterParamName.artistIDs,
      paramValue: ["artist-1", "artist-2"],
      displayText: "Artist 1, Artist 2",
    })

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1", "artist-2"],
          displayText: "Artist 1, Artist 2",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
          paramValue: ["artist-1", "artist-2"],
          displayText: "Artist 1, Artist 2",
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().selectFiltersAction({
      paramName: FilterParamName.artistIDs,
      paramValue: ["artist-2"],
      displayText: "Artist 2",
    })

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-2"],
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    })
  })

  it("de-selects a multi-select param option when one is previously applied", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1"],
          displayText: "Artist 1",
        },
      ],
      previouslyAppliedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1"],
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().selectFiltersAction({
      paramName: FilterParamName.artistIDs,
      paramValue: ["artist-1"],
      displayText: "Artist 1",
    })

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: false,
      appliedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1"],
          displayText: "Artist 1",
        },
      ],
      previouslyAppliedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1"],
          displayText: "Artist 1",
        },
      ],
      selectedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1"],
          displayText: "Artist 1",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    })
  })

  it("it allows more than one multi-select filter to be selected", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.waysToBuyPurchase,
          paramValue: true,
          displayText: "Purchase",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
          paramName: FilterParamName.waysToBuyPurchase,
          paramValue: true,
          displayText: "Purchase",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    })
  })

  it("returns the previously and newly selected filter option when selectFilters array is not empty ", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        { displayText: "Artwork Year (Descending)", paramName: FilterParamName.sort },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore
      .getActions()
      .selectFiltersAction({ displayText: "Recently Added", paramName: FilterParamName.sort })

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [{ displayText: "Recently Added", paramName: FilterParamName.sort }],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().selectFiltersAction({
      displayText: "Artwork Year (Descending)",
      paramName: FilterParamName.sort,
    })

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        { displayText: "Artwork Year (Descending)", paramName: FilterParamName.sort },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    })
  })

  it("does not select a filter that is already applied", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [
        { displayText: "Artwork Year (Descending)", paramName: FilterParamName.sort },
      ],
      previouslyAppliedFilters: [
        { displayText: "Artwork Year (Descending)", paramName: FilterParamName.sort },
      ],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().selectFiltersAction({
      displayText: "Artwork Year (Descending)",
      paramName: FilterParamName.sort,
    })

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: false,
      appliedFilters: [
        { displayText: "Artwork Year (Descending)", paramName: FilterParamName.sort },
      ],
      previouslyAppliedFilters: [
        { displayText: "Artwork Year (Descending)", paramName: FilterParamName.sort },
      ],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().selectFiltersAction({
      displayText: "Recommended",
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    })
  })

  it("does not select the default filter when the filter is not applied, even if there are existing selected filters", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          displayText: "Artwork Year (Descending)",
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().selectFiltersAction({
      displayText: "Recommended",
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
          paramName: FilterParamName.waysToBuyPurchase,
          paramValue: true,
          displayText: "Purchase",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
          paramName: FilterParamName.waysToBuyPurchase,
          paramValue: true,
          displayText: "Purchase",
        },
      ],
      appliedFilters: [
        {
          paramName: FilterParamName.waysToBuyBid,
          paramValue: true,
          displayText: "Bid",
        },
        {
          paramName: FilterParamName.waysToBuyPurchase,
          paramValue: true,
          displayText: "Purchase",
        },
      ],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    })
  })

  it("applies the selected filters", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        { displayText: "Artwork Year (Descending)", paramName: FilterParamName.sort },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().applyFiltersAction()

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: true,
      appliedFilters: [
        { displayText: "Artwork Year (Descending)", paramName: FilterParamName.sort },
      ],
      previouslyAppliedFilters: [
        { displayText: "Artwork Year (Descending)", paramName: FilterParamName.sort },
      ],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    })
  })

  it("keeps the filters that were already applied", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [{ displayText: "Recently Updated", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [
        { displayText: "Recently Updated", paramName: FilterParamName.sort },
      ],
      selectedFilters: [{ displayText: "Recently Updated", paramName: FilterParamName.sort }],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().applyFiltersAction()

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: true,
      appliedFilters: [{ displayText: "Recently Updated", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [
        { displayText: "Recently Updated", paramName: FilterParamName.sort },
      ],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    })
  })

  it("applies false ways to buy filters correctly", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [
        { paramName: FilterParamName.waysToBuyPurchase, paramValue: true, displayText: "Purchase" },
      ],
      previouslyAppliedFilters: [
        { paramName: FilterParamName.waysToBuyPurchase, paramValue: true, displayText: "Purchase" },
      ],
      selectedFilters: [
        {
          paramName: FilterParamName.waysToBuyPurchase,
          paramValue: false,
          displayText: "Purchase",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: { total: null, followedArtists: null },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    })
  })

  it("replaces previously applied filters with newly selected ones", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [{ displayText: "Recently Updated", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [
        { displayText: "Recently Updated", paramName: FilterParamName.sort },
      ],
      selectedFilters: [
        { displayText: "Artwork Year (Descending)", paramName: FilterParamName.sort },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().applyFiltersAction()

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: true,
      appliedFilters: [
        { displayText: "Artwork Year (Descending)", paramName: FilterParamName.sort },
      ],
      previouslyAppliedFilters: [
        { displayText: "Artwork Year (Descending)", paramName: FilterParamName.sort },
      ],
      selectedFilters: [],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
          paramValue: ["artist-1"],
          displayText: "Artist 1",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore.getActions().applyFiltersAction()

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: true,
      appliedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1"],
          displayText: "Artist 1",
        },
      ],
      previouslyAppliedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1"],
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
          paramValue: ["artist-1", "artist-2"],
          displayText: "Artist 1, Artist 2",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
          paramValue: ["artist-1", "artist-2"],
          displayText: "Artist 1, Artist 2",
        },
      ],
      previouslyAppliedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1", "artist-2"],
          displayText: "Artist 1, Artist 2",
        },
      ],
      selectedFilters: [],
      aggregations: [],
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    })
  })

  it("handles a selecting multiple artistIDs and deselecting one that was previously applied", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [],
      previouslyAppliedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1"],
          displayText: "Artist 1",
        },
      ],
      selectedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1", "artist-2"],
          displayText: "Artist 1, Artist 2",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
          paramValue: ["artist-1", "artist-2"],
          displayText: "Artist 1, Artist 2",
        },
      ],
      previouslyAppliedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1", "artist-2"],
          displayText: "Artist 1, Artist 2",
        },
      ],
      selectedFilters: [],
      aggregations: [],
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    })
  })
})

describe("clearFiltersZeroState", () => {
  it("resets the artwork filter when artworks are in zero state", () => {
    filterState = {
      applyFilters: true,
      appliedFilters: [
        { displayText: "Recently Updated", paramName: FilterParamName.sort },
        { displayText: "Jewelry", paramName: FilterParamName.medium },
      ],
      previouslyAppliedFilters: [
        { displayText: "Recently Updated", paramName: FilterParamName.sort },
      ],
      selectedFilters: [
        { displayText: "Artwork Year (Descending)", paramName: FilterParamName.sort },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    })
  })

  it("clears out the selectedFilters", () => {
    filterState = {
      appliedFilters: [],
      selectedFilters: [
        { displayText: "Artwork Year (Descending)", paramName: FilterParamName.sort },
      ],
      previouslyAppliedFilters: [],
      applyFilters: true,
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)
    filterArtworksStore
      .getActions()
      .setInitialFilterStateAction([
        { displayText: "Recently Updated", paramName: FilterParamName.sort },
      ])

    expect(filterArtworksStore.getState()).toEqual({
      appliedFilters: [{ displayText: "Recently Updated", paramName: FilterParamName.sort }],
      selectedFilters: [],
      previouslyAppliedFilters: [
        { displayText: "Recently Updated", paramName: FilterParamName.sort },
      ],
      applyFilters: false,
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    })
  })
})

describe("selectedOptionsUnion", () => {
  describe("artworks", () => {
    it("correctly unions params", () => {
      const previouslyAppliedFilters = [
        { displayText: "Recently Updated", paramName: FilterParamName.sort },
      ]
      const selectedFilters = [
        { displayText: "Artwork Year (Descending)", paramName: FilterParamName.sort },
      ]

      expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters })).toEqual([
        { displayText: "Artwork Year (Descending)", paramName: FilterParamName.sort },
        {
          displayText: "All",
          paramName: "artistSeriesIDs",
          paramValue: [],
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
          paramName: "organizations",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "priceRange",
          paramValue: "*-*",
        },
        {
          displayText: "All",
          paramName: "sizes",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "state",
          paramValue: "ALL",
        },
        {
          displayText: "All",
          paramName: "partnerIDs",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "keyword",
          paramValue: "",
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
          displayText: "Purchase",
          paramName: "acquireable",
          paramValue: false,
        },
        {
          displayText: "Contact Gallery",
          paramName: "inquireableOnly",
          paramValue: false,
        },
        {
          displayText: "Make Offer",
          paramName: "offerable",
          paramValue: false,
        },
        {
          displayText: "Bid",
          paramName: "atAuction",
          paramValue: false,
        },
        {
          displayText: "All Artists I Follow",
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
          paramValue: "grid",
        },
        {
          displayText: "All",
          paramName: "attributionClass",
          paramValue: "",
        },
      ])
    })

    it("correctly unions with a single selected artist", () => {
      const previouslyAppliedFilters = [] as FilterArray
      const selectedFilters = [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1"],
          displayText: "Artist 1",
        },
      ]

      expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters })).toEqual([
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1"],
          displayText: "Artist 1",
        },
        {
          displayText: "Recommended",
          paramName: "sort",
          paramValue: "-decayed_merch",
        },
        {
          displayText: "All",
          paramName: "artistSeriesIDs",
          paramValue: [],
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
          paramName: "organizations",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "priceRange",
          paramValue: "*-*",
        },
        {
          displayText: "All",
          paramName: "sizes",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "state",
          paramValue: "ALL",
        },
        {
          displayText: "All",
          paramName: "partnerIDs",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "keyword",
          paramValue: "",
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
          displayText: "Purchase",
          paramName: "acquireable",
          paramValue: false,
        },
        {
          displayText: "Contact Gallery",
          paramName: "inquireableOnly",
          paramValue: false,
        },
        {
          displayText: "Make Offer",
          paramName: "offerable",
          paramValue: false,
        },
        {
          displayText: "Bid",
          paramName: "atAuction",
          paramValue: false,
        },
        {
          displayText: "All Artists I Follow",
          paramName: "includeArtworksByFollowedArtists",
          paramValue: false,
        },
        {
          displayText: "Grid",
          paramName: "viewAs",
          paramValue: "grid",
        },
        {
          displayText: "All",
          paramName: "attributionClass",
          paramValue: "",
        },
      ])
    })

    it("correctly unions with multiple selected artists", () => {
      const previouslyAppliedFilters = [] as FilterArray
      const selectedFilters = [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1", "artist-2"],
          displayText: "Artist 1, Artist 2",
        },
      ]

      expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters })).toEqual([
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1", "artist-2"],
          displayText: "Artist 1, Artist 2",
        },
        {
          displayText: "Recommended",
          paramName: "sort",
          paramValue: "-decayed_merch",
        },
        {
          displayText: "All",
          paramName: "artistSeriesIDs",
          paramValue: [],
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
          paramName: "organizations",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "priceRange",
          paramValue: "*-*",
        },
        {
          displayText: "All",
          paramName: "sizes",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "state",
          paramValue: "ALL",
        },
        {
          displayText: "All",
          paramName: "partnerIDs",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "keyword",
          paramValue: "",
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
          displayText: "Purchase",
          paramName: "acquireable",
          paramValue: false,
        },
        {
          displayText: "Contact Gallery",
          paramName: "inquireableOnly",
          paramValue: false,
        },
        {
          displayText: "Make Offer",
          paramName: "offerable",
          paramValue: false,
        },
        {
          displayText: "Bid",
          paramName: "atAuction",
          paramValue: false,
        },
        {
          displayText: "All Artists I Follow",
          paramName: "includeArtworksByFollowedArtists",
          paramValue: false,
        },
        {
          displayText: "Grid",
          paramName: "viewAs",
          paramValue: "grid",
        },
        {
          displayText: "All",
          paramName: "attributionClass",
          paramValue: "",
        },
      ])
    })

    it("correctly unions with multiple selected artists when an artist has been previously applied", () => {
      const previouslyAppliedFilters = [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-3"],
          displayText: "Artist 3",
        },
      ] as FilterArray
      const selectedFilters = [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1", "artist-2"],
          displayText: "Artist 1, Artist 2",
        },
      ]

      expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters })).toEqual([
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1", "artist-2"],
          displayText: "Artist 1, Artist 2",
        },
        {
          displayText: "Recommended",
          paramName: "sort",
          paramValue: "-decayed_merch",
        },
        {
          displayText: "All",
          paramName: "artistSeriesIDs",
          paramValue: [],
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
          paramName: "organizations",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "priceRange",
          paramValue: "*-*",
        },
        {
          displayText: "All",
          paramName: "sizes",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "state",
          paramValue: "ALL",
        },
        {
          displayText: "All",
          paramName: "partnerIDs",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "keyword",
          paramValue: "",
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
          displayText: "Purchase",
          paramName: "acquireable",
          paramValue: false,
        },
        {
          displayText: "Contact Gallery",
          paramName: "inquireableOnly",
          paramValue: false,
        },
        {
          displayText: "Make Offer",
          paramName: "offerable",
          paramValue: false,
        },
        {
          displayText: "Bid",
          paramName: "atAuction",
          paramValue: false,
        },
        {
          displayText: "All Artists I Follow",
          paramName: "includeArtworksByFollowedArtists",
          paramValue: false,
        },
        {
          displayText: "Grid",
          paramName: "viewAs",
          paramValue: "grid",
        },
        {
          displayText: "All",
          paramName: "attributionClass",
          paramValue: "",
        },
      ])
    })

    it("correctly unions with multiple selected artists when a duplicate artist has been previously applied", () => {
      const previouslyAppliedFilters = [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-2"],
          displayText: "Artist 2",
        },
      ] as FilterArray
      const selectedFilters = [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1", "artist-2"],
          displayText: "Artist 1, Artist 2",
        },
      ]

      expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters })).toEqual([
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1", "artist-2"],
          displayText: "Artist 1, Artist 2",
        },
        {
          displayText: "Recommended",
          paramName: "sort",
          paramValue: "-decayed_merch",
        },
        {
          displayText: "All",
          paramName: "artistSeriesIDs",
          paramValue: [],
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
          paramName: "organizations",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "priceRange",
          paramValue: "*-*",
        },
        {
          displayText: "All",
          paramName: "sizes",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "state",
          paramValue: "ALL",
        },
        {
          displayText: "All",
          paramName: "partnerIDs",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "keyword",
          paramValue: "",
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
          displayText: "Purchase",
          paramName: "acquireable",
          paramValue: false,
        },
        {
          displayText: "Contact Gallery",
          paramName: "inquireableOnly",
          paramValue: false,
        },
        {
          displayText: "Make Offer",
          paramName: "offerable",
          paramValue: false,
        },
        {
          displayText: "Bid",
          paramName: "atAuction",
          paramValue: false,
        },
        {
          displayText: "All Artists I Follow",
          paramName: "includeArtworksByFollowedArtists",
          paramValue: false,
        },
        {
          displayText: "Grid",
          paramName: "viewAs",
          paramValue: "grid",
        },
        {
          displayText: "All",
          paramName: "attributionClass",
          paramValue: "",
        },
      ])
    })

    it("correctly unions params when an artistID has been previously applied", () => {
      const previouslyAppliedFilters = [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1"],
          displayText: "Artist 1",
        },
      ] as FilterArray
      const selectedFilters = [
        {
          displayText: "2010-2020",
          paramName: FilterParamName.timePeriod,
          paramValue: ["2010-2020"],
        },
        {
          displayText: "Purchase",
          paramName: FilterParamName.waysToBuyPurchase,
          paramValue: true,
        },
      ]

      expect(selectedOptionsUnion({ selectedFilters, previouslyAppliedFilters })).toEqual([
        {
          displayText: "2010-2020",
          paramName: "majorPeriods",
          paramValue: ["2010-2020"],
        },
        {
          displayText: "Purchase",
          paramName: "acquireable",
          paramValue: true,
        },
        {
          paramName: "artistIDs",
          paramValue: ["artist-1"],
          displayText: "Artist 1",
        },
        {
          displayText: "Recommended",
          paramName: "sort",
          paramValue: "-decayed_merch",
        },
        {
          displayText: "All",
          paramName: "artistSeriesIDs",
          paramValue: [],
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
          paramName: "organizations",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "priceRange",
          paramValue: "*-*",
        },
        {
          displayText: "All",
          paramName: "sizes",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "state",
          paramValue: "ALL",
        },
        {
          displayText: "All",
          paramName: "partnerIDs",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "keyword",
          paramValue: "",
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
          displayText: "Contact Gallery",
          paramName: "inquireableOnly",
          paramValue: false,
        },
        {
          displayText: "Make Offer",
          paramName: "offerable",
          paramValue: false,
        },
        {
          displayText: "Bid",
          paramName: "atAuction",
          paramValue: false,
        },
        {
          displayText: "All Artists I Follow",
          paramName: "includeArtworksByFollowedArtists",
          paramValue: false,
        },
        {
          displayText: "Grid",
          paramName: "viewAs",
          paramValue: "grid",
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
      const previouslyAppliedFilters = [
        { displayText: "Lot Number Ascending", paramName: FilterParamName.sort },
      ]
      const selectedFilters = [
        { displayText: "Lot Number Descending", paramName: FilterParamName.sort },
      ]

      expect(
        selectedOptionsUnion({
          selectedFilters,
          previouslyAppliedFilters,
          filterType: "saleArtwork",
        })
      ).toEqual([
        { displayText: "Lot Number Descending", paramName: FilterParamName.sort },
        {
          displayText: "All",
          paramName: "artistSeriesIDs",
          paramValue: [],
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
          paramName: "organizations",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "priceRange",
          paramValue: "*-*",
        },
        {
          displayText: "All",
          paramName: "sizes",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "state",
          paramValue: "ALL",
        },
        {
          displayText: "All",
          paramName: "partnerIDs",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "keyword",
          paramValue: "",
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
          displayText: "Purchase",
          paramName: "acquireable",
          paramValue: false,
        },
        {
          displayText: "Contact Gallery",
          paramName: "inquireableOnly",
          paramValue: false,
        },
        {
          displayText: "Make Offer",
          paramName: "offerable",
          paramValue: false,
        },
        {
          displayText: "Bid",
          paramName: "atAuction",
          paramValue: false,
        },
        {
          displayText: "All Artists I Follow",
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
          paramValue: "grid",
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

      expect(
        selectedOptionsUnion({
          selectedFilters,
          previouslyAppliedFilters,
          filterType: "saleArtwork",
        })
      ).toEqual([
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1"],
          displayText: "Artist 1",
        },
        {
          displayText: "Lot Number Ascending",
          paramName: "sort",
          paramValue: "position",
        },
        {
          displayText: "All",
          paramName: "artistSeriesIDs",
          paramValue: [],
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
          paramName: "organizations",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "priceRange",
          paramValue: "*-*",
        },
        {
          displayText: "All",
          paramName: "sizes",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "state",
          paramValue: "ALL",
        },
        {
          displayText: "All",
          paramName: "partnerIDs",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "keyword",
          paramValue: "",
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
          displayText: "Purchase",
          paramName: "acquireable",
          paramValue: false,
        },
        {
          displayText: "Contact Gallery",
          paramName: "inquireableOnly",
          paramValue: false,
        },
        {
          displayText: "Make Offer",
          paramName: "offerable",
          paramValue: false,
        },
        {
          displayText: "Bid",
          paramName: "atAuction",
          paramValue: false,
        },
        {
          displayText: "All Artists I Follow",
          paramName: "includeArtworksByFollowedArtists",
          paramValue: false,
        },
        {
          displayText: "Grid",
          paramName: "viewAs",
          paramValue: "grid",
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

      expect(
        selectedOptionsUnion({
          selectedFilters,
          previouslyAppliedFilters,
          filterType: "saleArtwork",
        })
      ).toEqual([
        {
          displayText: "All",
          paramName: "artistIDs",
          paramValue: ["artist-1", "artist-2"],
        },
        {
          displayText: "Lot Number Ascending",
          paramName: "sort",
          paramValue: "position",
        },
        {
          displayText: "All",
          paramName: "artistSeriesIDs",
          paramValue: [],
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
          paramName: "organizations",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "priceRange",
          paramValue: "*-*",
        },
        {
          displayText: "All",
          paramName: "sizes",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "state",
          paramValue: "ALL",
        },
        {
          displayText: "All",
          paramName: "partnerIDs",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "keyword",
          paramValue: "",
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
          displayText: "Purchase",
          paramName: "acquireable",
          paramValue: false,
        },
        {
          displayText: "Contact Gallery",
          paramName: "inquireableOnly",
          paramValue: false,
        },
        {
          displayText: "Make Offer",
          paramName: "offerable",
          paramValue: false,
        },
        {
          displayText: "Bid",
          paramName: "atAuction",
          paramValue: false,
        },
        {
          displayText: "All Artists I Follow",
          paramName: "includeArtworksByFollowedArtists",
          paramValue: false,
        },
        {
          displayText: "Grid",
          paramName: "viewAs",
          paramValue: "grid",
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

      expect(
        selectedOptionsUnion({
          selectedFilters,
          previouslyAppliedFilters,
          filterType: "showArtwork",
        })
      ).toEqual([
        {
          displayText: "Gallery Curated",
          paramName: FilterParamName.sort,
          paramValue: "partner_show_position",
        },
        {
          displayText: "All",
          paramName: "artistSeriesIDs",
          paramValue: [],
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
          paramName: "organizations",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "priceRange",
          paramValue: "*-*",
        },
        {
          displayText: "All",
          paramName: "sizes",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "state",
          paramValue: "ALL",
        },
        {
          displayText: "All",
          paramName: "partnerIDs",
          paramValue: [],
        },
        {
          displayText: "All",
          paramName: "keyword",
          paramValue: "",
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
          displayText: "Purchase",
          paramName: "acquireable",
          paramValue: false,
        },
        {
          displayText: "Contact Gallery",
          paramName: "inquireableOnly",
          paramValue: false,
        },
        {
          displayText: "Make Offer",
          paramName: "offerable",
          paramValue: false,
        },
        {
          displayText: "Bid",
          paramName: "atAuction",
          paramValue: false,
        },
        {
          displayText: "All Artists I Follow",
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
          paramValue: "grid",
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    })
  })
})

describe("SetSelectedFiltersAction", () => {
  it("set the selected filters when the previously selected filters is empty", () => {
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)

    filterArtworksStore.getActions().setSelectedFiltersAction([
      {
        displayText: "Artwork Year (Descending)",
        paramName: FilterParamName.sort,
        paramValue: "-year",
      },
    ])

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          displayText: "Artwork Year (Descending)",
          paramName: FilterParamName.sort,
          paramValue: "-year",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    })
  })

  it("replace the previously selected filters with passed filters", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1"],
          displayText: "Artist 1",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)

    filterArtworksStore.getActions().setSelectedFiltersAction([
      {
        displayText: "Artwork Year (Descending)",
        paramName: FilterParamName.sort,
        paramValue: "-year",
      },
    ])

    expect(filterArtworksStore.getState()).toEqual({
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          displayText: "Artwork Year (Descending)",
          paramName: FilterParamName.sort,
          paramValue: "-year",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    })
  })

  it("should reset the selected filters if empty filters are passed", () => {
    filterState = {
      applyFilters: false,
      appliedFilters: [],
      previouslyAppliedFilters: [],
      selectedFilters: [
        {
          paramName: FilterParamName.artistIDs,
          paramValue: ["artist-1"],
          displayText: "Artist 1",
        },
      ],
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    const filterArtworksStore = getFilterArtworksStore(filterState)

    filterArtworksStore.getActions().setSelectedFiltersAction([])

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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    })
  })
})
