import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
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
import { OptionListItem as MultiSelectOptionListItem } from "../MultiSelectOption"
import { TimePeriodMultiOptionsScreen } from "../TimePeriodMultiOptions"
import { getEssentialProps } from "./helper"

describe("TimePeriodMultiOptions Screen", () => {
  const defaultState: ArtworkFilterContextState = {
    aggregations: [
      {
        slice: "MAJOR_PERIOD",
        counts: [
          {
            count: 100,
            name: "2020",
            value: "2020",
          },
          {
            count: 200,
            name: "2010",
            value: "2010",
          },
          {
            count: 50,
            name: "In the year 2000!",
            value: "In the year 2000!",
          },
        ],
      },
    ],
    appliedFilters: [],
    applyFilters: false,
    counts: {
      total: null,
      followedArtists: null,
    },
    filterType: "artwork",
    previouslyAppliedFilters: [],
    selectedFilters: [],
  }

  const MockTimePeriodOptionsScreen = ({ initialState }: InitialState) => {
    const [filterState, dispatch] = React.useReducer(reducer, initialState)

    return (
      <ArtworkFilterContext.Provider value={{ state: filterState, dispatch }}>
        <TimePeriodMultiOptionsScreen {...getEssentialProps()} />
      </ArtworkFilterContext.Provider>
    )
  }

  describe("before any filters are selected", () => {
    const state: ArtworkFilterContextState = defaultState

    it("displays 'All' in the filter modal screen", () => {
      const tree = renderWithWrappers(<MockFilterScreen initialState={state} />)
      const items = tree.root.findAllByType(FilterModalOptionListItem)
      const item = items.find((i) => extractText(i).startsWith("Time period"))

      expect(item).not.toBeUndefined()
      if (item) {
        expect(extractText(item)).toContain("All")
      }
    })

    it("renders all options present in the aggregation", () => {
      const tree = renderWithWrappers(<MockTimePeriodOptionsScreen initialState={state} />)
      expect(tree.root.findAllByType(MultiSelectOptionListItem)).toHaveLength(4)

      const items = tree.root.findAllByType(MultiSelectOptionListItem)
      expect(items.map(extractText)).toEqual(["All", "2020-today", "2010-2019", "In the year 2000!"])
    })
  })

  describe("when filters are selected", () => {
    const state: ArtworkFilterContextState = {
      ...defaultState,
      selectedFilters: [
        {
          displayText: "Foo",
          paramName: FilterParamName.timePeriod,
          paramValue: ["2020", "In the year 2000!"],
        },
      ],
    }

    it("displays a comma-separated list of the selected filters on the filter modal screen", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ ARUseNewArtworkFilters: true })

      const tree = renderWithWrappers(<MockFilterScreen initialState={state} />)
      const items = tree.root.findAllByType(FilterModalOptionListItem)
      const item = items.find((i) => extractText(i).startsWith("Time period"))

      expect(item).not.toBeUndefined()
      if (item) {
        expect(extractText(item)).toContain("2020-today, In the year 2000!")
      }
    })

    it("toggles selected filters 'ON' and unselected filters 'OFF", () => {
      const tree = renderWithWrappers(<MockTimePeriodOptionsScreen initialState={state} />)
      const switches = tree.root.findAllByType(Switch)

      expect(switches[0].props.value).toBe(false)
      expect(switches[1].props.value).toBe(true)
      expect(switches[2].props.value).toBe(false)
      expect(switches[3].props.value).toBe(true)
    })
  })

  describe("when the 'All' option is selected", () => {
    const state: ArtworkFilterContextState = {
      ...defaultState,
      selectedFilters: [
        {
          displayText: "Foo",
          paramName: FilterParamName.timePeriod,
          paramValue: [],
        },
      ],
    }

    it("displays 'All' on the filter modal screen", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ ARUseNewArtworkFilters: true })

      const tree = renderWithWrappers(<MockFilterScreen initialState={state} />)
      const items = tree.root.findAllByType(FilterModalOptionListItem)
      const item = items.find((i) => extractText(i).startsWith("Time period"))

      expect(item).not.toBeUndefined()
      if (item) {
        expect(extractText(item)).toContain("All")
      }
    })

    it("toggles the 'All' filter 'ON' and the other filters 'OFF", () => {
      const tree = renderWithWrappers(<MockTimePeriodOptionsScreen initialState={state} />)
      const switches = tree.root.findAllByType(Switch)

      expect(switches[0].props.value).toBe(true)
      expect(switches[1].props.value).toBe(false)
      expect(switches[2].props.value).toBe(false)
      expect(switches[3].props.value).toBe(false)
    })
  })
})
