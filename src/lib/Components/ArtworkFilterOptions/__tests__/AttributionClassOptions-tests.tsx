import React from "react"
import { Switch } from "react-native"
import { OptionListItem as FilterModalOptionListItem } from "../../../../lib/Components/FilterModal"
import { MockFilterScreen } from "../../../../lib/Components/FilterModal/__tests__/FilterTestHelper"
import { extractText } from "../../../../lib/tests/extractText"
import { renderWithWrappers } from "../../../../lib/tests/renderWithWrappers"
import { FilterParamName, InitialState } from "../../../../lib/utils/ArtworkFilter/FilterArtworksHelpers"
import {
  ArtworkFilterContext,
  ArtworkFilterContextState,
  reducer,
} from "../../../utils/ArtworkFilter/ArtworkFiltersStore"
import { AttributionClassOptionsScreen } from "../AttributionClassOptions"
import { OptionListItem } from "../MultiSelectOption"
import { getEssentialProps } from "./helper"

describe("AttributionClassOptions Screen", () => {
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

  const MockAttributionClassOptionsScreen = ({ initialState }: InitialState) => {
    const [filterState, dispatch] = React.useReducer(reducer, initialState)

    return (
      <ArtworkFilterContext.Provider value={{ state: filterState, dispatch }}>
        <AttributionClassOptionsScreen {...getEssentialProps()} />
      </ArtworkFilterContext.Provider>
    )
  }

  it("renders the options", () => {
    const tree = renderWithWrappers(<MockAttributionClassOptionsScreen initialState={state} />)
    expect(tree.root.findAllByType(OptionListItem)).toHaveLength(4)
    const items = tree.root.findAllByType(OptionListItem)
    expect(items.map(extractText)).toEqual(["Unique", "Limited Edition", "Open Edition", "Unknown Edition"])
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
    const items = tree.root.findAllByType(FilterModalOptionListItem)
    expect(extractText(items[items.length - 1])).toContain("All")
  })

  it("displays all the selected filters on the filter modal screen", () => {
    state = {
      selectedFilters: [
        {
          displayText: "Unique, Unknown edition",
          paramName: FilterParamName.attributionClass,
          paramValue: ["unique", "unknown edition"],
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
    const items = tree.root.findAllByType(FilterModalOptionListItem)

    expect(extractText(items[1])).toContain("Unique, Unknown edition")
  })

  it("toggles selected filters 'ON' and unselected filters 'OFF", () => {
    const initialState: ArtworkFilterContextState = {
      selectedFilters: [
        {
          displayText: "Unique, Unknown edition",
          paramName: FilterParamName.attributionClass,
          paramValue: ["unique", "unknown edition"],
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

    const tree = renderWithWrappers(<MockAttributionClassOptionsScreen initialState={initialState} />)
    const switches = tree.root.findAllByType(Switch)

    expect(switches[0].props.value).toBe(true)
    expect(switches[1].props.value).toBe(false)
    expect(switches[2].props.value).toBe(false)
    expect(switches[3].props.value).toBe(true)
  })
})
