import { OptionListItem as FilterModalOptionListItem } from "lib/Components/ArtworkFilter"
import { OptionListItem as MultiSelectOptionListItem } from "../MultiSelectOption"

import { FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Check } from "palette"
import React from "react"
import { MockFilterScreen } from "../../__tests__/FilterTestHelper"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "../../ArtworkFilterStore"
import { LocationCitiesOptionsScreen } from "../LocationCitiesOptions"
import { getEssentialProps } from "./helper"

describe(LocationCitiesOptionsScreen, () => {
  const initialState: ArtworkFiltersState = {
    aggregations: [
      {
        slice: "LOCATION_CITY",
        counts: [
          {
            count: 44,
            name: "Paris, France",
            value: "Paris, France",
          },
          {
            count: 30,
            name: "London, United Kingdom",
            value: "London, United Kingdom",
          },
          {
            count: 26,
            name: "Milan, Italy",
            value: "Milan, Italy",
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

  const MockLocationCitiesOptionsScreen = ({ initialData = initialState }: { initialData?: ArtworkFiltersState }) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <LocationCitiesOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  describe("no filters are selected", () => {
    it("renders all options present in the aggregation", () => {
      const tree = renderWithWrappers(<MockLocationCitiesOptionsScreen initialData={initialState} />)

      expect(tree.root.findAllByType(MultiSelectOptionListItem)).toHaveLength(3)

      const items = tree.root.findAllByType(MultiSelectOptionListItem)
      expect(items.map(extractText)).toEqual(["Paris, France", "London, United Kingdom", "Milan, Italy"])
    })
  })

  describe("a filter is selected", () => {
    const state: ArtworkFiltersState = {
      ...initialState,
      selectedFilters: [
        {
          displayText: "Paris, France, Milan, Italy",
          paramName: FilterParamName.locationCities,
          paramValue: ["Paris, France", "Milan, Italy"],
        },
      ],
    }

    it("displays a comma-separated list of the selected filters on the filter modal screen", () => {
      const tree = renderWithWrappers(<MockFilterScreen initialState={state} />)

      const items = tree.root.findAllByType(FilterModalOptionListItem)
      const item = items.find((i) => extractText(i).startsWith("Artwork location"))

      expect(item).not.toBeUndefined()
      if (item) {
        expect(extractText(item)).toContain("Paris, France, Milan, Italy")
      }
    })

    it("toggles selected filters 'ON' and unselected filters 'OFF", async () => {
      const tree = renderWithWrappers(<MockLocationCitiesOptionsScreen initialData={state} />)

      const options = tree.root.findAllByType(Check)

      expect(options[0].props.selected).toBe(true)
      expect(options[1].props.selected).toBe(false)
      expect(options[2].props.selected).toBe(true)
    })
  })
})
