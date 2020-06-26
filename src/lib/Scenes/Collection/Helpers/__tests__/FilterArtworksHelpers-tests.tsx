import { FilterArray } from "lib/utils/ArtworkFiltersStore"
import { changedFiltersParams, filterArtworksParams, FilterParamName, FilterType } from "../FilterArtworksHelpers"

describe("changedFiltersParams helper", () => {
  it("when a medium selection changed and sort selection unchanged", () => {
    const appliedFilters = filterArtworksParams([
      { filterType: FilterType.sort, displayText: "Default", paramName: FilterParamName.sort },
      { filterType: FilterType.medium, displayText: "Performance art", paramName: FilterParamName.medium },
    ])
    expect(
      changedFiltersParams(appliedFilters, [
        { filterType: FilterType.sort, displayText: "Default", paramName: FilterParamName.sort },
        { filterType: FilterType.medium, displayText: "photography", paramName: FilterParamName.medium },
      ])
    ).toEqual({ medium: "photography" })
  })

  it("when a medium and sort selection made from initial state", () => {
    const appliedFilters = filterArtworksParams([])
    expect(
      changedFiltersParams(appliedFilters, [
        { filterType: FilterType.sort, displayText: "Recently Updated", paramName: FilterParamName.sort },
        { filterType: FilterType.medium, displayText: "Sculpture", paramName: FilterParamName.medium },
      ])
    ).toEqual({ medium: "sculpture", sort: "-partner_updated_at" })
  })

  it("when medium selection and sort selection changed", () => {
    const appliedFilters = filterArtworksParams([
      { filterType: FilterType.sort, displayText: "Default", paramName: FilterParamName.sort },
      { filterType: FilterType.medium, displayText: "Sculpture", paramName: FilterParamName.medium },
    ])
    expect(
      changedFiltersParams(appliedFilters, [
        { filterType: FilterType.sort, displayText: "Artwork year (ascending)", paramName: FilterParamName.sort },
        { filterType: FilterType.medium, displayText: "All", paramName: FilterParamName.medium },
      ])
    ).toEqual({ medium: "*", sort: "year" })
  })

  it("when a medium selection unchanged and sort selection changed", () => {
    const appliedFilters = filterArtworksParams([
      { filterType: FilterType.sort, displayText: "Artwork year (descending)", paramName: FilterParamName.sort },
      { filterType: FilterType.medium, displayText: "Painting", paramName: FilterParamName.medium },
    ])
    expect(
      changedFiltersParams(appliedFilters, [
        { filterType: FilterType.sort, displayText: "Artwork year (ascending)", paramName: FilterParamName.sort },
        { filterType: FilterType.medium, displayText: "Painting", paramName: FilterParamName.medium },
      ])
    ).toEqual({ sort: "year" })
  })

  it("when clearing applied filters", () => {
    const appliedFilters = filterArtworksParams([
      { filterType: FilterType.sort, displayText: "Artwork year (ascending)", paramName: FilterParamName.sort },
      { filterType: FilterType.medium, displayText: "All", paramName: FilterParamName.medium },
      { filterType: FilterType.priceRange, displayText: "All", paramName: FilterParamName.priceRange },
    ])
    expect(changedFiltersParams(appliedFilters, [])).toEqual({
      sort: "-decayed_merch",
    })
  })

  it("when clearing applied filters from medium and sort selections made", () => {
    const appliedFilters = filterArtworksParams([
      { filterType: FilterType.sort, displayText: "Recently Added", paramName: FilterParamName.sort },
      { filterType: FilterType.medium, displayText: "Performance Art", paramName: FilterParamName.medium },
    ])
    expect(changedFiltersParams(appliedFilters, [])).toEqual({ sort: "-decayed_merch", medium: "*" })
  })
})

describe("filterArtworksParams helper", () => {
  let appliedFilters: FilterArray

  it("maps applied filters to relay params when default filters", () => {
    appliedFilters = [
      { filterType: FilterType.sort, displayText: "Default", paramName: FilterParamName.sort },
      { filterType: FilterType.medium, displayText: "All", paramName: FilterParamName.medium },
      { filterType: FilterType.priceRange, displayText: "All", paramName: FilterParamName.priceRange },
      { filterType: FilterType.waysToBuyBid, displayText: "Bid", paramName: FilterParamName.waysToBuyBid },
      { filterType: FilterType.waysToBuyBuy, displayText: "Buy", paramName: FilterParamName.waysToBuyBuy },
      { filterType: FilterType.waysToBuyInquire, displayText: "Inquire", paramName: FilterParamName.waysToBuyInquire },
      {
        filterType: FilterType.waysToBuyMakeOffer,
        displayText: "Make Offer",
        paramName: FilterParamName.waysToBuyMakeOffer,
      },
    ]
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-decayed_merch",
      medium: "*",
      priceRange: "",
      inquireableOnly: false,
      atAuction: false,
      acquireable: false,
      offerable: false,
    })
  })

  it("maps applied filters to relay params when no filters", () => {
    appliedFilters = []
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-decayed_merch",
      medium: "*",
      priceRange: "",
      inquireableOnly: false,
      atAuction: false,
      acquireable: false,
      offerable: false,
    })
  })

  it("maps applied filters to a default filter relay params when a single filter applied", () => {
    appliedFilters = [
      { filterType: FilterType.sort, displayText: "Artwork year (descending)", paramName: FilterParamName.sort },
    ]
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-year",
      medium: "*",
      priceRange: "",
      inquireableOnly: false,
      atAuction: false,
      acquireable: false,
      offerable: false,
    })
  })

  it("maps applied filters to relay params when multiple filters", () => {
    appliedFilters = [
      { filterType: FilterType.sort, displayText: "Recently updated", paramName: FilterParamName.sort },
      { filterType: FilterType.medium, displayText: "Works on paper", paramName: FilterParamName.medium },
      { filterType: FilterType.priceRange, displayText: "$5,000-10,000", paramName: FilterParamName.priceRange },
      { filterType: FilterType.waysToBuyBid, displayText: "Bid", paramName: FilterParamName.waysToBuyBid },
      { filterType: FilterType.waysToBuyBuy, displayText: "Buy", paramName: FilterParamName.waysToBuyBuy },
      { filterType: FilterType.waysToBuyInquire, displayText: "Inquire", paramName: FilterParamName.waysToBuyInquire },
      {
        filterType: FilterType.waysToBuyMakeOffer,
        displayText: "Make Offer",
        paramName: FilterParamName.waysToBuyMakeOffer,
      },
    ]
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-partner_updated_at",
      medium: "work-on-paper",
      priceRange: "5000-10000",
      inquireableOnly: true,
      atAuction: false,
      acquireable: true,
      offerable: false,
    })
  })
})
