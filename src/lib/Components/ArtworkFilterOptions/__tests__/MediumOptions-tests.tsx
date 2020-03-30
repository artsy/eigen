import { Box, Theme } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { FakeNavigator as MockNavigator } from "../../../../lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import { OptionListItem } from "../../../../lib/Components/FilterModal"
import { ArtworkFilterContext, ArtworkFilterContextState } from "../../../utils/ArtworkFiltersStore"
import { InnerOptionListItem, MediumOptionsScreen as MediumOptions } from "../MediumOptions"

describe("Medium Options Screen", () => {
  let mockNavigator: MockNavigator

  beforeEach(() => {
    mockNavigator = new MockNavigator()
  })

  const MockMediumScreen = ({ initialState }) => {
    return (
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state: initialState,
            dispatch: null,
          }}
        >
          <MediumOptions navigator={mockNavigator as any} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )
  }

  const selectedMediumOption = component => {
    return component.find(InnerOptionListItem).filterWhere(item => item.find(Box).length > 0)
  }

  it("renders the correct number of medium options", () => {
    const state: ArtworkFilterContextState = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
    }

    const component = mount(<MockMediumScreen initialState={state} />)

    expect(component.find(OptionListItem)).toHaveLength(12)
  })

  describe("selecting a Medium filter", () => {
    it("displays a medium filter option when selected", () => {
      const state: ArtworkFilterContextState = {
        selectedFilters: [{ filterType: "medium", value: "Photography" }],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
      }

      const component = mount(<MockMediumScreen initialState={state} />)
      const selectedOption = selectedMediumOption(component)
      expect(selectedOption.text()).toContain("Photography")
    })

    it("allows only one medium filter to be selected at a time", () => {
      const state: ArtworkFilterContextState = {
        selectedFilters: [
          { filterType: "medium", value: "Jewelry" },
          { filterType: "medium", value: "Prints & multiples" },
        ],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
      }

      const component = mount(<MockMediumScreen initialState={state} />)
      const selectedOption = selectedMediumOption(component)
      expect(selectedOption.text()).toContain("Jewelry")
      expect(selectedOption).toHaveLength(1)
    })
  })
})
