import { MockFilterScreen } from "lib/Components/FilterModal/__tests__/FilterTestHelper"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { FilterParamName, InitialState } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React from "react"
import { Switch } from "react-native"
import { OptionListItem as FilterModalOptionListItem } from "../../../../lib/Components/FilterModal"
import {
  ArtworkFilterContext,
  ArtworkFilterContextState,
  reducer,
} from "../../../utils/ArtworkFilter/ArtworkFiltersStore"
import { OptionListItem } from "../MultiSelectOption"
import { WaysToBuyOptionsScreen } from "../WaysToBuyOptions"
import { getEssentialProps } from "./helper"

describe("Ways to Buy Options Screen", () => {
  let state: ArtworkFilterContextState

  beforeEach(() => {
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

  const MockWaysToBuyScreen = ({ initialState }: InitialState) => {
    const [filterState, dispatch] = React.useReducer(reducer, initialState)

    return (
      <ArtworkFilterContext.Provider
        value={{
          state: filterState,
          dispatch,
        }}
      >
        <WaysToBuyOptionsScreen {...getEssentialProps()} />
      </ArtworkFilterContext.Provider>
    )
  }

  it("renders the correct ways to buy options", () => {
    const tree = renderWithWrappers(<MockWaysToBuyScreen initialState={state} />)

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
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const tree = renderWithWrappers(<MockFilterScreen initialState={state} />)
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
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const tree = renderWithWrappers(<MockFilterScreen initialState={state} />)
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
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const tree = renderWithWrappers(<MockWaysToBuyScreen initialState={initialState} />)
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
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const tree = renderWithWrappers(<MockWaysToBuyScreen initialState={initialState} />)
    const switches = tree.root.findAllByType(Switch)

    expect(switches[0].props.value).toBe(false)

    expect(switches[1].props.value).toBe(false)

    expect(switches[2].props.value).toBe(false)

    expect(switches[3].props.value).toBe(true)
  })
})
