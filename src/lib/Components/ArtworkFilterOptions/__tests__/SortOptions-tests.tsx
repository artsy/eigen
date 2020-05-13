import { Box, CheckIcon, Theme } from "@artsy/palette"
// @ts-ignore STRICTNESS_MIGRATION
import { mount } from "enzyme"
import { InitialState } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import React from "react"
import { FakeNavigator as MockNavigator } from "../../../../lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import { OptionListItem } from "../../../../lib/Components/FilterModal"
import { ArtworkFilterContext, ArtworkFilterContextState } from "../../../utils/ArtworkFiltersStore"
import { InnerOptionListItem, SingleSelectOptionListItemRow } from "../SingleSelectOption"
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
    }
  })

  const MockSortScreen = ({ initialState }: InitialState) => {
    return (
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state: initialState,
            // @ts-ignore STRICTNESS_MIGRATION
            dispatch: null,
          }}
        >
          <SortOptionsScreen navigator={mockNavigator as any} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )
  }

  // @ts-ignore STRICTNESS_MIGRATION
  const selectedSortOption = component => {
    // @ts-ignore STRICTNESS_MIGRATION
    return component.find(InnerOptionListItem).filterWhere(item => item.find(Box).length > 0)
  }

  it("renders the correct number of sort options", () => {
    const component = mount(<MockSortScreen initialState={state} />)
    expect(component.find(OptionListItem)).toHaveLength(7)
  })

  describe("selectedSortOption", () => {
    it("returns the default option if there are no selected or applied filters", () => {
      const component = mount(<MockSortScreen initialState={state} />)
      const selectedOption = selectedSortOption(component)
      expect(selectedOption.text()).toContain("Default")
    })

    it("prefers an applied filter over the default filter", () => {
      state = {
        selectedFilters: [],
        appliedFilters: [{ filterType: "sort", value: "Recently added" }],
        previouslyAppliedFilters: [{ filterType: "sort", value: "Recently added" }],
        applyFilters: false,
      }

      const component = mount(<MockSortScreen initialState={state} />)
      const selectedOption = selectedSortOption(component)
      expect(selectedOption.text()).toContain("Recently added")
    })

    it("prefers the selected filter over the default filter", () => {
      state = {
        selectedFilters: [{ filterType: "sort", value: "Recently added" }],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
      }

      const component = mount(<MockSortScreen initialState={state} />)
      const selectedOption = selectedSortOption(component)
      expect(selectedOption.text()).toContain("Recently added")
    })

    it("prefers the selected filter over an applied filter", () => {
      state = {
        selectedFilters: [{ filterType: "sort", value: "Recently added" }],
        appliedFilters: [{ filterType: "sort", value: "Recently updated" }],
        previouslyAppliedFilters: [{ filterType: "sort", value: "Recently updated" }],
        applyFilters: false,
      }

      const component = mount(<MockSortScreen initialState={state} />)
      const selectedOption = selectedSortOption(component)
      expect(selectedOption.text()).toContain("Recently added")
    })
  })

  it("allows only one sort filter to be selected at a time", () => {
    state = {
      selectedFilters: [{ filterType: "sort", value: "Price (high to low)" }],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
    }
    const sortScreen = mount(<MockSortScreen initialState={state} />)
    const selectedRow = sortScreen.find(SingleSelectOptionListItemRow).at(2)
    expect(selectedRow.text()).toEqual("Price (high to low)")
    expect(selectedRow.find(CheckIcon)).toHaveLength(1)
  })
})
