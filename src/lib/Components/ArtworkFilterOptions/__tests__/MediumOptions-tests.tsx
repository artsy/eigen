import { Box, CheckIcon, Theme } from "@artsy/palette"
// @ts-ignore STRICTNESS_MIGRATION
import { mount } from "enzyme"
import React, { Dispatch } from "react"
import { act, create } from "react-test-renderer"
import { FakeNavigator as MockNavigator } from "../../../../lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import { OptionListItem } from "../../../../lib/Components/FilterModal"
import {
  ArtworkFilterContext,
  ArtworkFilterContextState,
  FilterActions,
  reducer,
} from "../../../utils/ArtworkFiltersStore"
import { MediumOptionsScreen } from "../MediumOptions"
import { InnerOptionListItem, SingleSelectOptionListItemRow } from "../SingleSelectOption"

describe("Medium Options Screen", () => {
  let state: ArtworkFilterContextState
  let mockNavigator: MockNavigator

  beforeEach(() => {
    mockNavigator = new MockNavigator()
    state = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
    }
  })

  // @ts-ignore STRICTNESS_MIGRATION
  const MockMediumScreen = ({ initialState }) => {
    const [filterState, dispatch] = React.useReducer(reducer, initialState)

    return (
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state: filterState,
            dispatch,
          }}
        >
          <MediumOptionsScreen navigator={mockNavigator as any} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )
  }

  // @ts-ignore STRICTNESS_MIGRATION
  const selectedMediumOption = component => {
    // @ts-ignore STRICTNESS_MIGRATION
    return component.find(InnerOptionListItem).filterWhere(item => item.find(Box).length > 0)
  }

  it("renders the correct number of medium options", () => {
    const component = mount(<MockMediumScreen initialState={state} />)

    expect(component.find(OptionListItem)).toHaveLength(12)
  })

  describe("selecting a Medium filter", () => {
    it("displays the default medium if no selected filters", () => {
      const component = mount(<MockMediumScreen initialState={state} />)
      const selectedOption = selectedMediumOption(component)
      expect(selectedOption.text()).toContain("All")
    })

    it("displays a medium filter option when selected", () => {
      state = {
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
      const initialState: ArtworkFilterContextState = {
        selectedFilters: [{ filterType: "medium", value: "Sculpture" }],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
      }

      const mediumScreen = mount(<MockMediumScreen initialState={initialState} />)

      const selectedRow = mediumScreen.find(SingleSelectOptionListItemRow).at(3)
      expect(selectedRow.text()).toEqual("Sculpture")
      expect(selectedRow.find(CheckIcon)).toHaveLength(1)
    })

    it("allows only one medium filter to be selected at a time when several medium options are tapped", () => {
      const dispatch: Dispatch<FilterActions> = () => {
        return {
          type: "selectFilters",
          payload: { value: "All", filterType: "medium" },
        }
      }
      const mediumScreen = create(
        <Theme>
          <ArtworkFilterContext.Provider
            value={{
              state,
              dispatch,
            }}
          >
            <MediumOptionsScreen navigator={mockNavigator as any} />
          </ArtworkFilterContext.Provider>
        </Theme>
      ).root

      const firstMediumOptionInstance = mediumScreen.findAllByType(SingleSelectOptionListItemRow)[0]
      const secondMediumOptionInstance = mediumScreen.findAllByType(SingleSelectOptionListItemRow)[1]
      const thirdMediumOptionInstance = mediumScreen.findAllByType(SingleSelectOptionListItemRow)[3]
      const selectedOptionIcon = mediumScreen.findAllByType(CheckIcon)

      act(() => firstMediumOptionInstance.props.onPress())
      act(() => secondMediumOptionInstance.props.onPress())
      act(() => thirdMediumOptionInstance.props.onPress())

      expect(selectedOptionIcon).toHaveLength(1)
    })
  })
})
