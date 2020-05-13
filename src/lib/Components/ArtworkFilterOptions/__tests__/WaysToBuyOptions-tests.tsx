import { Theme } from "@artsy/palette"
// @ts-ignore STRICTNESS_MIGRATION
import { mount } from "enzyme"
import { MockFilterScreen } from "lib/Components/__tests__/FilterModal-tests"
import React from "react"
import { Switch } from "react-native"
import { FakeNavigator as MockNavigator } from "../../../../lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import { OptionListItem as FilterModalOptionListItem } from "../../../../lib/Components/FilterModal"
import { ArtworkFilterContext, ArtworkFilterContextState, reducer } from "../../../utils/ArtworkFiltersStore"
import { OptionListItem } from "../MultiSelectOption"
import { WaysToBuyOptionsScreen } from "../WaysToBuyOptions"

describe("Ways to Buy Options Screen", () => {
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
  const MockWaysToBuyScreen = ({ initialState }) => {
    const [filterState, dispatch] = React.useReducer(reducer, initialState)

    return (
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state: filterState,
            dispatch,
          }}
        >
          <WaysToBuyOptionsScreen navigator={mockNavigator as any} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )
  }

  it("renders the correct ways to buy options", () => {
    const component = mount(<MockWaysToBuyScreen initialState={state} />)

    expect(component.find(OptionListItem)).toHaveLength(4)

    expect(
      component
        .find(OptionListItem)
        .at(0)
        .text()
    ).toBe("Buy now")

    expect(
      component
        .find(OptionListItem)
        .at(1)
        .text()
    ).toBe("Make offer")

    expect(
      component
        .find(OptionListItem)
        .at(2)
        .text()
    ).toBe("Bid")

    expect(
      component
        .find(OptionListItem)
        .at(3)
        .text()
    ).toBe("Inquire")
  })

  it("displays the default text when no filter selected on the filter modal screen", () => {
    state = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
    }

    const filterModal = mount(<MockFilterScreen initialState={state} />)

    expect(
      filterModal
        .find(FilterModalOptionListItem)
        .at(3)
        .text()
    ).toContain("All")
  })

  it("displays all the selected filters on the filter modal screen", () => {
    state = {
      selectedFilters: [
        { value: true, filterType: "waysToBuyBuy" },
        { value: true, filterType: "waysToBuyInquire" },
        { value: true, filterType: "waysToBuyBid" },
      ],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
    }

    const filterModal = mount(<MockFilterScreen initialState={state} />)

    expect(
      filterModal
        .find(FilterModalOptionListItem)
        .at(3)
        .text()
    ).toContain("Buy now")

    expect(
      filterModal
        .find(FilterModalOptionListItem)
        .at(3)
        .text()
    ).toContain("Inquire")

    expect(
      filterModal
        .find(FilterModalOptionListItem)
        .at(3)
        .text()
    ).toContain("Bid")
  })

  it("toggles selected filters 'ON' and unselected filters 'OFF", () => {
    const initialState: ArtworkFilterContextState = {
      selectedFilters: [{ value: true, filterType: "waysToBuyBuy" }],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
    }

    const waysToBuyScreen = mount(<MockWaysToBuyScreen initialState={initialState} />)

    expect(
      waysToBuyScreen
        .find(Switch)
        .at(0)
        .props().value
    ).toBe(true)

    expect(
      waysToBuyScreen
        .find(Switch)
        .at(1)
        .props().value
    ).toBe(false)

    expect(
      waysToBuyScreen
        .find(Switch)
        .at(2)
        .props().value
    ).toBe(false)

    expect(
      waysToBuyScreen
        .find(Switch)
        .at(3)
        .props().value
    ).toBe(false)
  })

  it("it toggles applied filters 'ON' and unapplied filters 'OFF", () => {
    const initialState: ArtworkFilterContextState = {
      selectedFilters: [],
      appliedFilters: [{ value: true, filterType: "waysToBuyInquire" }],
      previouslyAppliedFilters: [{ value: true, filterType: "waysToBuyInquire" }],
      applyFilters: false,
    }

    const waysToBuyScreen = mount(<MockWaysToBuyScreen initialState={initialState} />)

    expect(
      waysToBuyScreen
        .find(Switch)
        .at(0)
        .props().value
    ).toBe(false)

    expect(
      waysToBuyScreen
        .find(Switch)
        .at(1)
        .props().value
    ).toBe(false)

    expect(
      waysToBuyScreen
        .find(Switch)
        .at(2)
        .props().value
    ).toBe(false)

    expect(
      waysToBuyScreen
        .find(Switch)
        .at(3)
        .props().value
    ).toBe(true)
  })
})
