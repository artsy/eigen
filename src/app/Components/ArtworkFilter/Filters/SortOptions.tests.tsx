import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ArtworkFiltersState } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { RadioDot } from "palette"
import React from "react"
import { ReactTestRenderer } from "react-test-renderer"
import { getEssentialProps } from "./helper"
import { InnerOptionListItem, OptionListItem } from "./SingleSelectOption"
import { SortOptionsScreen } from "./SortOptions"

describe("Sort Options Screen", () => {
  const initialState: ArtworkFiltersState = {
    selectedFilters: [],
    appliedFilters: [],
    previouslyAppliedFilters: [],
    applyFilters: false,
    aggregations: [],
    filterType: "artwork",
    counts: {
      total: null,
      followedArtists: null,
    },
    sizeMetric: "cm",
  }

  const MockSortScreen = ({
    initialData = initialState,
  }: {
    initialData?: ArtworkFiltersState
  }) => (
    <ArtworkFiltersStoreProvider initialData={initialData}>
      <SortOptionsScreen {...getEssentialProps()} />
    </ArtworkFiltersStoreProvider>
  )

  const selectedSortOption = (componentTree: ReactTestRenderer) => {
    const innerOptions = componentTree.root.findAllByType(InnerOptionListItem)
    const selectedOption = innerOptions.filter(
      (item) => item.findByType(RadioDot).props.selected
    )[0]
    return selectedOption
  }

  it("renders the correct number of sort options", () => {
    const tree = renderWithWrappers(<MockSortScreen initialData={initialState} />)
    expect(tree.root.findAllByType(OptionListItem)).toHaveLength(7)
  })

  describe("selectedSortOption", () => {
    it("returns the default option if there are no selected or applied filters", () => {
      const tree = renderWithWrappers(<MockSortScreen initialData={initialState} />)
      const selectedOption = selectedSortOption(tree)
      expect(extractText(selectedOption)).toContain("Default")
    })

    it("prefers an applied filter over the default filter", () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [],
        appliedFilters: [
          {
            displayText: "Recently Added",

            paramName: FilterParamName.sort,
            paramValue: "Recently Added",
          },
        ],
        previouslyAppliedFilters: [
          {
            displayText: "Recently Added",

            paramName: FilterParamName.sort,
            paramValue: "Recently Added",
          },
        ],
        applyFilters: false,
        aggregations: [],
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: null,
        },
        sizeMetric: "cm",
      }

      const tree = renderWithWrappers(<MockSortScreen initialData={injectedState} />)

      const selectedOption = selectedSortOption(tree)
      expect(extractText(selectedOption)).toContain("Recently Added")
    })

    it("prefers the selected filter over the default filter", () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [
          {
            displayText: "Recently Added",

            paramName: FilterParamName.sort,
            paramValue: "Recently Added",
          },
        ],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
        aggregations: [],
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: null,
        },
        sizeMetric: "cm",
      }

      const tree = renderWithWrappers(<MockSortScreen initialData={injectedState} />)

      const selectedOption = selectedSortOption(tree)
      expect(extractText(selectedOption)).toContain("Recently Added")
    })

    it("prefers the selected filter over an applied filter", () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [
          {
            displayText: "Recently Added",

            paramName: FilterParamName.sort,
            paramValue: "Recently Added",
          },
        ],
        appliedFilters: [
          {
            displayText: "Recently Updated",

            paramName: FilterParamName.sort,
            paramValue: "Recently Updated",
          },
        ],
        previouslyAppliedFilters: [
          {
            displayText: "Recently Updated",

            paramName: FilterParamName.sort,
            paramValue: "Recently Updated",
          },
        ],
        applyFilters: false,
        aggregations: [],
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: null,
        },
        sizeMetric: "cm",
      }

      const tree = renderWithWrappers(<MockSortScreen initialData={injectedState} />)

      const selectedOption = selectedSortOption(tree)
      expect(extractText(selectedOption)).toContain("Recently Added")
    })
  })

  it("allows only one sort filter to be selected at a time", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Price (High to Low)",

          paramName: FilterParamName.sort,
          paramValue: "Price (High to Low)",
        },
        {
          displayText: "Price (Low to High)",

          paramName: FilterParamName.sort,
          paramValue: "Price (Low to High)",
        },
      ],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      sizeMetric: "cm",
    }

    const tree = renderWithWrappers(<MockSortScreen initialData={injectedState} />)

    const selectedRow = selectedSortOption(tree)
    expect(extractText(selectedRow)).toEqual("Price (High to Low)")
    expect(selectedRow.findByType(RadioDot).props.selected).toEqual(true)
  })

  describe("filterType of showArtwork", () => {
    it("has the correct options", () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
        aggregations: [],
        filterType: "showArtwork",
        counts: {
          total: null,
          followedArtists: null,
        },
        sizeMetric: "cm",
      }

      const tree = renderWithWrappers(<MockSortScreen initialData={injectedState} />)

      const selectedRow = selectedSortOption(tree)

      expect(extractText(selectedRow)).toEqual("Gallery Curated")
      expect(selectedRow.findByType(RadioDot).props.selected).toEqual(true)
    })
  })

  describe("filterType of auctionResults", () => {
    it("has the correct options", () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
        aggregations: [],
        filterType: "auctionResult",
        counts: {
          total: null,
          followedArtists: null,
        },
        sizeMetric: "cm",
      }

      const tree = renderWithWrappers(<MockSortScreen initialData={injectedState} />)

      const selectedRow = selectedSortOption(tree)

      expect(extractText(selectedRow)).toEqual("Most Recent Sale Date")
      expect(selectedRow.findByType(RadioDot).props.selected).toEqual(true)
    })
  })
})
