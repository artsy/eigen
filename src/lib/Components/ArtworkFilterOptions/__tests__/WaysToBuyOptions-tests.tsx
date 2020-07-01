import { Theme } from "@artsy/palette"
import { MockFilterScreen } from "lib/Components/__tests__/FilterTestHelper"
import { FilterParamName, InitialState } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { extractText } from "lib/tests/extractText"
import React from "react"
import { Switch } from "react-native"
import { create } from "react-test-renderer"
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
      aggregations: [],
    }
  })

  const MockWaysToBuyScreen = ({ initialState }: InitialState) => {
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
    const tree = create(<MockWaysToBuyScreen initialState={state} />)

    expect(tree.root.findAllByType(OptionListItem)).toHaveLength(4)

    const listItems = tree.root.findAllByType(OptionListItem)
    const firstListItem = listItems[0]
    expect(extractText(firstListItem)).toBe("Buy now")

    const secondListItem = listItems[1]
    expect(extractText(secondListItem)).toBe("Make offer")

    const thirdListItem = listItems[2]
    expect(extractText(thirdListItem)).toBe("Bid")

    const fourthListItem = listItems[3]
    expect(extractText(fourthListItem)).toBe("Inquire")
  })

  it("displays the default text when no filter selected on the filter modal screen", () => {
    state = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: [],
    }

    const tree = create(<MockFilterScreen initialState={state} />)
    const waysToBuyListItem = tree.root.findAllByType(FilterModalOptionListItem)[1]

    expect(extractText(waysToBuyListItem)).toContain("All")
  })

  it("displays all the selected filters on the filter modal screen", () => {
    state = {
      selectedFilters: [
        {
          displayText: "Buy now",
          paramName: FilterParamName.waysToBuyBuy,
          paramValue: true,
        },
        {
          displayText: "Inquire",
          paramName: FilterParamName.waysToBuyInquire,
          paramValue: true,
        },
        {
          displayText: "Bid",
          paramName: FilterParamName.waysToBuyBid,
          paramValue: true,
        },
      ],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: [],
    }

    const tree = create(<MockFilterScreen initialState={state} />)
    const waysToBuyListItem = tree.root.findAllByType(FilterModalOptionListItem)[1]

    expect(extractText(waysToBuyListItem)).toContain("Buy now, Inquire, Bid")
  })

  it("toggles selected filters 'ON' and unselected filters 'OFF", () => {
    const initialState: ArtworkFilterContextState = {
      selectedFilters: [
        {
          displayText: "Buy now",
          paramName: FilterParamName.waysToBuyBuy,
          paramValue: true,
        },
      ],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: [],
    }

    const tree = create(<MockWaysToBuyScreen initialState={initialState} />)
    const switches = tree.root.findAllByType(Switch)

    expect(switches[0].props.value).toBe(true)

    expect(switches[1].props.value).toBe(false)

    expect(switches[2].props.value).toBe(false)

    expect(switches[3].props.value).toBe(false)
  })

  it("it toggles applied filters 'ON' and unapplied filters 'OFF", () => {
    const initialState: ArtworkFilterContextState = {
      selectedFilters: [],
      appliedFilters: [
        {
          displayText: "Inquire",
          paramName: FilterParamName.waysToBuyInquire,
          paramValue: true,
        },
      ],
      previouslyAppliedFilters: [
        {
          displayText: "Inquire",
          paramName: FilterParamName.waysToBuyInquire,
          paramValue: true,
        },
      ],
      applyFilters: false,
      aggregations: [],
    }

    const tree = create(<MockWaysToBuyScreen initialState={initialState} />)
    const switches = tree.root.findAllByType(Switch)

    expect(switches[0].props.value).toBe(false)

    expect(switches[1].props.value).toBe(false)

    expect(switches[2].props.value).toBe(false)

    expect(switches[3].props.value).toBe(true)
  })
})
