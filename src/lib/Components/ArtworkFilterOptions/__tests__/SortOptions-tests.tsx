import { Box, Theme } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { FakeNavigator as MockNavigator } from "../../../../lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import { OptionListItem } from "../../../../lib/Components/FilterModal"
import { ArtworkFilterContext, ArtworkFilterContextState } from "../../../utils/ArtworkFiltersStore"
import { InnerOptionListItem, SortOptionsScreen as SortOptions } from "../SortOptions"

describe("Sort Options Screen", () => {
  let mockNavigator: MockNavigator

  beforeEach(() => {
    mockNavigator = new MockNavigator()
  })

  const MockSortScreen = ({ initialState }) => {
    return (
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state: initialState,
            dispatch: null,
          }}
        >
          <SortOptions navigator={mockNavigator as any} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )
  }

  const selectedSortOption = component => {
    return component.find(InnerOptionListItem).filterWhere(item => item.find(Box).length > 0)
  }

  it("renders the correct number of sort options", () => {
    const state = {
      selectedFilters: [],
      appliedFilters: [],
      applyFilters: false,
    }

    const component = mount(<MockSortScreen initialState={state} />)
    expect(component.find(OptionListItem)).toHaveLength(7)
  })

  describe("selectedSortOption", () => {
    it("returns the default option if there are no selected or applied filters", () => {
      const state: ArtworkFilterContextState = {
        selectedFilters: [],
        appliedFilters: [],
        applyFilters: false,
      }

      const component = mount(<MockSortScreen initialState={state} />)
      const selectedOption = selectedSortOption(component)
      expect(selectedOption.text()).toContain("Default")
    })

    it("prefers an applied filter over the default filter", () => {
      const state: ArtworkFilterContextState = {
        selectedFilters: [],
        appliedFilters: [{ filterType: "sort", value: "Recently added" }],
        applyFilters: false,
      }

      const component = mount(<MockSortScreen initialState={state} />)
      const selectedOption = selectedSortOption(component)
      expect(selectedOption.text()).toContain("Recently added")
    })
    it("prefers the selected filter over the default filter", () => {
      const state: ArtworkFilterContextState = {
        selectedFilters: [{ filterType: "sort", value: "Recently added" }],
        appliedFilters: [],
        applyFilters: false,
      }

      const component = mount(<MockSortScreen initialState={state} />)
      const selectedOption = selectedSortOption(component)
      expect(selectedOption.text()).toContain("Recently added")
    })
    it("prefers the selected filter over an applied filter", () => {
      const state: ArtworkFilterContextState = {
        selectedFilters: [{ filterType: "sort", value: "Recently added" }],
        appliedFilters: [{ filterType: "sort", value: "Recently updated" }],
        applyFilters: false,
      }

      const component = mount(<MockSortScreen initialState={state} />)
      const selectedOption = selectedSortOption(component)
      expect(selectedOption.text()).toContain("Recently added")
    })
  })
})
