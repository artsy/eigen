import { FilterArray } from "lib/utils/ArtworkFiltersStore"
import { changedFiltersParams, filterArtworksParams, FilterParamName } from "../FilterArtworksHelpers"

describe("changedFiltersParams helper", () => {
  it("when a medium selection changed and sort selection unchanged", () => {
    const appliedFilters = filterArtworksParams([
      {
        displayText: "Default",
        paramValue: "-decayed_merch",
        paramName: FilterParamName.sort,
      },
      {
        displayText: "Performance art",
        paramValue: "performance-art",
        paramName: FilterParamName.medium,
      },
    ])
    expect(
      changedFiltersParams(appliedFilters, [
        {
          displayText: "Default",
          paramValue: "-decayed_merch",
          paramName: FilterParamName.sort,
        },
        {
          displayText: "Photography",
          paramValue: "photography",
          paramName: FilterParamName.medium,
        },
      ])
    ).toEqual({ medium: "photography" })
  })

  it("when a medium and sort selection made from initial state", () => {
    const appliedFilters = filterArtworksParams([])
    expect(
      changedFiltersParams(appliedFilters, [
        {
          displayText: "Recently Updated",
          paramValue: "-partner_updated_at",
          paramName: FilterParamName.sort,
        },
        {
          displayText: "Sculpture",
          paramValue: "sculpture",
          paramName: FilterParamName.medium,
        },
      ])
    ).toEqual({ medium: "sculpture", sort: "-partner_updated_at" })
  })

  it("when medium selection and sort selection changed", () => {
    const appliedFilters = filterArtworksParams([
      {
        displayText: "Default",
        paramValue: "-decayed_merch",
        paramName: FilterParamName.sort,
      },
      {
        displayText: "Sculpture",
        paramValue: "sculpture",
        paramName: FilterParamName.medium,
      },
    ])
    expect(
      changedFiltersParams(appliedFilters, [
        {
          displayText: "Artwork year (ascending)",
          paramValue: "year",
          paramName: FilterParamName.sort,
        },
        { displayText: "All", paramValue: "*", paramName: FilterParamName.medium },
      ])
    ).toEqual({ medium: "*", sort: "year" })
  })

  it("when a medium selection unchanged and sort selection changed", () => {
    const appliedFilters = filterArtworksParams([
      {
        displayText: "Artwork year (descending)",
        paramValue: "-year",
        paramName: FilterParamName.sort,
      },
      {
        displayText: "Painting",
        paramValue: "painting",
        paramName: FilterParamName.medium,
      },
    ])
    expect(
      changedFiltersParams(appliedFilters, [
        {
          displayText: "Artwork year (ascending)",
          paramValue: "year",
          paramName: FilterParamName.sort,
        },
        {
          displayText: "Painting",
          paramValue: "painting",
          paramName: FilterParamName.medium,
        },
      ])
    ).toEqual({ sort: "year" })
  })

  it("when clearing applied filters", () => {
    const appliedFilters = filterArtworksParams([
      {
        displayText: "Artwork year (ascending)",
        paramValue: "year",
        paramName: FilterParamName.sort,
      },
      { displayText: "All", paramValue: "*", paramName: FilterParamName.medium },
      {
        displayText: "All",
        paramValue: "*-*",
        paramName: FilterParamName.priceRange,
      },
    ])
    expect(changedFiltersParams(appliedFilters, [])).toEqual({
      sort: "-decayed_merch",
    })
  })

  it("when clearing applied filters from medium and sort selections made", () => {
    const appliedFilters = filterArtworksParams([
      {
        displayText: "Recently Added",
        paramValue: "-published_at",
        paramName: FilterParamName.sort,
      },
      {
        displayText: "Performance Art",
        paramValue: "performance-art",
        paramName: FilterParamName.medium,
      },
    ])
    expect(changedFiltersParams(appliedFilters, [])).toEqual({ sort: "-decayed_merch", medium: "*" })
  })
})

describe("filterArtworksParams helper", () => {
  let appliedFilters: FilterArray

  it("maps applied filters to relay params when default filters", () => {
    appliedFilters = [
      {
        displayText: "Default",
        paramValue: "-decayed_merch",
        paramName: FilterParamName.sort,
      },
      { displayText: "All", paramValue: "*", paramName: FilterParamName.medium },
      {
        displayText: "All",
        paramValue: "*-*",
        paramName: FilterParamName.priceRange,
      },
      {
        displayText: "Bid",
        paramValue: false,
        paramName: FilterParamName.waysToBuyBid,
      },
      {
        displayText: "Buy",
        paramValue: false,
        paramName: FilterParamName.waysToBuyBuy,
      },
      {
        displayText: "Inquire",
        paramValue: false,
        paramName: FilterParamName.waysToBuyInquire,
      },
      {
        displayText: "Make Offer",
        paramValue: false,
        paramName: FilterParamName.waysToBuyMakeOffer,
      },
    ]
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-decayed_merch",
      medium: "*",
      priceRange: "*-*",
      dimensionRange: "*-*",
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
      priceRange: "*-*",
      dimensionRange: "*-*",
      inquireableOnly: false,
      atAuction: false,
      acquireable: false,
      offerable: false,
    })
  })

  it("maps applied filters to a default filter relay params when a single filter applied", () => {
    appliedFilters = [
      {
        displayText: "Artwork year (descending)",
        paramValue: "-year",
        paramName: FilterParamName.sort,
      },
    ]
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-year",
      medium: "*",
      priceRange: "*-*",
      dimensionRange: "*-*",
      inquireableOnly: false,
      atAuction: false,
      acquireable: false,
      offerable: false,
    })
  })

  it("maps applied filters to relay params when multiple filters", () => {
    appliedFilters = [
      {
        displayText: "Recently updated",
        paramValue: "-partner_updated_at",
        paramName: FilterParamName.sort,
      },
      {
        displayText: "Works on paper",
        paramValue: "work-on-paper",
        paramName: FilterParamName.medium,
      },
      {
        displayText: "$5,000-10,000",
        paramValue: "5000-10000",
        paramName: FilterParamName.priceRange,
      },
      {
        displayText: "Bid",
        paramValue: false,
        paramName: FilterParamName.waysToBuyBid,
      },
      {
        displayText: "Buy",
        paramValue: true,
        paramName: FilterParamName.waysToBuyBuy,
      },
      {
        displayText: "Inquire",
        paramValue: true,
        paramName: FilterParamName.waysToBuyInquire,
      },
      {
        displayText: "Make Offer",
        paramValue: false,
        paramName: FilterParamName.waysToBuyMakeOffer,
      },
    ]
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-partner_updated_at",
      medium: "work-on-paper",
      priceRange: "5000-10000",
      dimensionRange: "*-*",
      inquireableOnly: true,
      atAuction: false,
      acquireable: true,
      offerable: false,
    })
  })
})
