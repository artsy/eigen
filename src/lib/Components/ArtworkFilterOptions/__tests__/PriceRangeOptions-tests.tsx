import { CheckIcon, Theme } from "@artsy/palette"
// @ts-ignore STRICTNESS_MIGRATION
import { mount } from "enzyme"
import { InitialState } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import React from "react"
import { FakeNavigator as MockNavigator } from "../../../../lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import { OptionListItem } from "../../../../lib/Components/FilterModal"
import { ArtworkFilterContext, ArtworkFilterContextState } from "../../../utils/ArtworkFiltersStore"
import { PriceRangeOptionsScreen } from "../PriceRangeOptions"
import { InnerOptionListItem } from "../SingleSelectOption"

describe("Price Range Options Screen", () => {
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

  const MockPriceRangeScreen = ({ initialState }: InitialState) => {
    return (
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state: initialState,
            dispatch: null as any /* STRICTNESS_MIGRATION */,
          }}
        >
          <PriceRangeOptionsScreen navigator={mockNavigator as any} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )
  }

  const selectedPriceRangeOption = (component: any /* STRICTNESS_MIGRATION */) => {
    return component
      .find(InnerOptionListItem)
      .filterWhere((item: any /* STRICTNESS_MIGRATION */) => item.find(CheckIcon).length > 0)
  }

  it("renders the correct number of sort options", () => {
    const component = mount(<MockPriceRangeScreen initialState={state} />)
    expect(component.find(OptionListItem)).toHaveLength(6)
  })

  describe("selectedPriceRangeOption", () => {
    it("returns the default option if there are no selected or applied filters", () => {
      const component = mount(<MockPriceRangeScreen initialState={state} />)
      const selectedOption = selectedPriceRangeOption(component)
      expect(selectedOption.text()).toContain("All")
    })

    it("prefers an applied filter over the default filter", () => {
      state = {
        selectedFilters: [],
        appliedFilters: [{ filterType: "priceRange", value: "$5,000-10,000" }],
        previouslyAppliedFilters: [{ filterType: "priceRange", value: "$5,000-10,000" }],
        applyFilters: false,
      }

      const component = mount(<MockPriceRangeScreen initialState={state} />)
      const selectedOption = selectedPriceRangeOption(component)
      expect(selectedOption.text()).toContain("$5,000-10,000")
    })

    it("prefers the selected filter over the default filter", () => {
      state = {
        selectedFilters: [{ filterType: "priceRange", value: "$5,000-10,000" }],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
      }

      const component = mount(<MockPriceRangeScreen initialState={state} />)
      const selectedOption = selectedPriceRangeOption(component)
      expect(selectedOption.text()).toContain("$5,000-10,000")
    })

    it("prefers the selected filter over an applied filter", () => {
      state = {
        selectedFilters: [{ filterType: "priceRange", value: "$5,000-10,000" }],
        appliedFilters: [{ filterType: "priceRange", value: "$10,000-20,000" }],
        previouslyAppliedFilters: [{ filterType: "priceRange", value: "$10,000-20,000" }],
        applyFilters: false,
      }

      const component = mount(<MockPriceRangeScreen initialState={state} />)
      const selectedOption = selectedPriceRangeOption(component)
      expect(selectedOption.text()).toContain("$5,000-10,000")
    })
  })
})
