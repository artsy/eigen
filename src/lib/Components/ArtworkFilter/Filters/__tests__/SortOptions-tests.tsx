import { FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { ArtworkFiltersState } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Box, CheckIcon } from "palette"
import React from "react"
import { ReactTestRenderer } from "react-test-renderer"
import { InnerOptionListItem, OptionListItem } from "../SingleSelectOption"
import { SortOptionsScreen } from "../SortOptions"
import { getEssentialProps } from "./helper"

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
  }

  const MockSortScreen = ({ initialData = initialState }: { initialData?: ArtworkFiltersState }) => (
    <ArtworkFiltersStoreProvider initialData={initialData}>
      <SortOptionsScreen {...getEssentialProps()} />
    </ArtworkFiltersStoreProvider>
  )

  const selectedSortOption = (componentTree: ReactTestRenderer) => {
    const innerOptions = componentTree.root.findAllByType(InnerOptionListItem)
    const selectedOption = innerOptions.filter((item) => item.findAllByType(Box).length > 0)[0]
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
            displayText: "Recently added",

            paramName: FilterParamName.sort,
            paramValue: "Recently added",
          },
        ],
        previouslyAppliedFilters: [
          {
            displayText: "Recently added",

            paramName: FilterParamName.sort,
            paramValue: "Recently added",
          },
        ],
        applyFilters: false,
        aggregations: [],
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: null,
        },
      }

      const tree = renderWithWrappers(<MockSortScreen initialData={injectedState} />)

      const selectedOption = selectedSortOption(tree)
      expect(extractText(selectedOption)).toContain("Recently added")
    })

    it("prefers the selected filter over the default filter", () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [
          {
            displayText: "Recently added",

            paramName: FilterParamName.sort,
            paramValue: "Recently added",
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
      }

      const tree = renderWithWrappers(<MockSortScreen initialData={injectedState} />)

      const selectedOption = selectedSortOption(tree)
      expect(extractText(selectedOption)).toContain("Recently added")
    })

    it("prefers the selected filter over an applied filter", () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [
          {
            displayText: "Recently added",

            paramName: FilterParamName.sort,
            paramValue: "Recently added",
          },
        ],
        appliedFilters: [
          {
            displayText: "Recently updated",

            paramName: FilterParamName.sort,
            paramValue: "Recently updated",
          },
        ],
        previouslyAppliedFilters: [
          {
            displayText: "Recently updated",

            paramName: FilterParamName.sort,
            paramValue: "Recently updated",
          },
        ],
        applyFilters: false,
        aggregations: [],
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: null,
        },
      }

      const tree = renderWithWrappers(<MockSortScreen initialData={injectedState} />)

      const selectedOption = selectedSortOption(tree)
      expect(extractText(selectedOption)).toContain("Recently added")
    })
  })

  it("allows only one sort filter to be selected at a time", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Price (high to low)",

          paramName: FilterParamName.sort,
          paramValue: "Price (high to low)",
        },
        {
          displayText: "Price (low to high)",

          paramName: FilterParamName.sort,
          paramValue: "Price (low to high)",
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
    }

    const tree = renderWithWrappers(<MockSortScreen initialData={injectedState} />)

    const selectedRow = selectedSortOption(tree)
    expect(extractText(selectedRow)).toEqual("Price (high to low)")
    expect(selectedRow.findAllByType(CheckIcon)).toHaveLength(1)
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
      }

      const tree = renderWithWrappers(<MockSortScreen initialData={injectedState} />)

      const selectedRow = selectedSortOption(tree)

      expect(extractText(selectedRow)).toEqual("Gallery Curated")
      expect(selectedRow.findAllByType(CheckIcon)).toHaveLength(1)
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
      }

      const tree = renderWithWrappers(<MockSortScreen initialData={injectedState} />)

      const selectedRow = selectedSortOption(tree)

      expect(extractText(selectedRow)).toEqual("Most recent sale date")
      expect(selectedRow.findAllByType(CheckIcon)).toHaveLength(1)
    })
  })
})
