import { FilterParamName, InitialState } from "lib/Components/ArtworkFilter/FilterArtworksHelpers"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Box, CheckIcon, Theme } from "palette"
import React from "react"
import { ReactTestRenderer } from "react-test-renderer"
import { FakeNavigator as MockNavigator } from "../../../Bidding/__tests__/Helpers/FakeNavigator"
import { ArtworkFilterContext, ArtworkFilterContextState } from "../../ArtworkFiltersStore"
import { OptionListItem } from "../../FilterModal"
import { InnerOptionListItem } from "../SingleSelectOption"
import { SortOptionsScreen } from "../SortOptions"

describe("Sort Options Screen", () => {
  let mockNavigator: MockNavigator
  let state: ArtworkFilterContextState

  beforeEach(() => {
    mockNavigator = new MockNavigator()
    state = {
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
  })

  const MockSortScreen = ({ initialState }: InitialState) => {
    return (
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state: initialState,
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            dispatch: null,
          }}
        >
          <SortOptionsScreen navigator={mockNavigator as any} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )
  }

  const selectedSortOption = (componentTree: ReactTestRenderer) => {
    const innerOptions = componentTree.root.findAllByType(InnerOptionListItem)
    const selectedOption = innerOptions.filter((item) => item.findAllByType(Box).length > 0)[0]
    return selectedOption
  }

  it("renders the correct number of sort options", () => {
    const tree = renderWithWrappers(<MockSortScreen initialState={state} />)
    expect(tree.root.findAllByType(OptionListItem)).toHaveLength(7)
  })

  describe("selectedSortOption", () => {
    it("returns the default option if there are no selected or applied filters", () => {
      const tree = renderWithWrappers(<MockSortScreen initialState={state} />)
      const selectedOption = selectedSortOption(tree)
      expect(extractText(selectedOption)).toContain("Default")
    })

    it("prefers an applied filter over the default filter", () => {
      state = {
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

      const tree = renderWithWrappers(<MockSortScreen initialState={state} />)
      const selectedOption = selectedSortOption(tree)
      expect(extractText(selectedOption)).toContain("Recently added")
    })

    it("prefers the selected filter over the default filter", () => {
      state = {
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

      const tree = renderWithWrappers(<MockSortScreen initialState={state} />)
      const selectedOption = selectedSortOption(tree)
      expect(extractText(selectedOption)).toContain("Recently added")
    })

    it("prefers the selected filter over an applied filter", () => {
      state = {
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

      const tree = renderWithWrappers(<MockSortScreen initialState={state} />)
      const selectedOption = selectedSortOption(tree)
      expect(extractText(selectedOption)).toContain("Recently added")
    })
  })

  it("allows only one sort filter to be selected at a time", () => {
    state = {
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
    const tree = renderWithWrappers(<MockSortScreen initialState={state} />)
    const selectedRow = selectedSortOption(tree)
    expect(extractText(selectedRow)).toEqual("Price (high to low)")
    expect(selectedRow.findAllByType(CheckIcon)).toHaveLength(1)
  })
})
