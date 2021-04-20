import { OptionListItem as FilterModalOptionListItem } from "lib/Components/ArtworkFilter"
import { MockFilterScreen } from "lib/Components/ArtworkFilter/__tests__/FilterTestHelper"
import { FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { ArtworkFiltersState } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Switch } from "react-native"
import { OptionListItem as MultiSelectOptionListItem } from "../MultiSelectOption"
import { TimePeriodOptionsScreen } from "../TimePeriodOptions"
import { getEssentialProps } from "./helper"

describe("TimePeriodOptions Screen", () => {
  const initialState: ArtworkFiltersState = {
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

  const MockTimePeriodOptionsScreen = ({ initialData = initialState }: { initialData?: ArtworkFiltersState }) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <TimePeriodOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  describe("before any filters are selected", () => {
    it("displays 'All' in the filter modal screen", () => {
      const tree = renderWithWrappers(<MockFilterScreen initialState={initialState} />)

      const items = tree.root.findAllByType(FilterModalOptionListItem)
      const item = items.find((i) => extractText(i).startsWith("Time period"))

      expect(item).not.toBeUndefined()

      if (item) {
        expect(extractText(item)).toContain("All")
      }
    })

    it("renders all options present in the aggregation", () => {
      const tree = renderWithWrappers(<MockTimePeriodOptionsScreen initialData={initialState} />)

      expect(tree.root.findAllByType(MultiSelectOptionListItem)).toHaveLength(3)

      const items = tree.root.findAllByType(MultiSelectOptionListItem)
      expect(items.map(extractText)).toEqual(["2020–today", "2010–2019", "In the year 2000!"])
    })
  })

  describe("when filters are selected", () => {
    const state: ArtworkFiltersState = {
      ...initialState,
      selectedFilters: [
        {
          displayText: "2020–today",
          paramName: FilterParamName.timePeriod,
          paramValue: ["2020"],
        },
      ],
    }

    it("displays a comma-separated list of the selected filters on the filter modal screen", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ ARUseImprovedArtworkFilters: true })

      const tree = renderWithWrappers(<MockFilterScreen initialState={state} />)

      const items = tree.root.findAllByType(FilterModalOptionListItem)
      const item = items.find((i) => extractText(i).startsWith("Time period"))

      expect(item).not.toBeUndefined()
      if (item) {
        expect(extractText(item)).toContain("2020–today")
      }
    })

    it("toggles selected filters 'ON' and unselected filters 'OFF", async () => {
      const tree = renderWithWrappers(<MockTimePeriodOptionsScreen initialData={state} />)

      const switches = tree.root.findAllByType(Switch)

      expect(switches[0].props.value).toBe(true)
      expect(switches[1].props.value).toBe(false)
      expect(switches[2].props.value).toBe(false)
    })
  })

  describe("when the 'All' option is selected", () => {
    it("does not display 'All' on the filter modal screen", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ ARUseImprovedArtworkFilters: true })

      const tree = renderWithWrappers(<MockFilterScreen initialState={initialState} />)

      const items = tree.root.findAllByType(FilterModalOptionListItem)
      const item = items.find((i) => extractText(i).startsWith("Time period"))

      expect(item).not.toBeUndefined()
      if (item) {
        expect(extractText(item)).not.toContain("All")
      }
    })
  })
})
