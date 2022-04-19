import { within } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "../ArtworkFilterStore"
import { MockFilterScreen } from "../FilterTestHelper"
import { getEssentialProps } from "./helper"
import { LocationCitiesOptionsScreen } from "./LocationCitiesOptions"

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
    sizeMetric: "cm",
    filterType: "artwork",
    previouslyAppliedFilters: [],
    selectedFilters: [],
  }

  const MockLocationCitiesOptionsScreen = ({
    initialData = initialState,
  }: {
    initialData?: ArtworkFiltersState
  }) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <LocationCitiesOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  describe("no filters are selected", () => {
    it("renders all options present in the aggregation", () => {
      const { getByText } = renderWithWrappersTL(
        <MockLocationCitiesOptionsScreen initialData={initialState} />
      )

      expect(getByText("Paris, France")).toBeTruthy()
      expect(getByText("London, United Kingdom")).toBeTruthy()
      expect(getByText("Milan, Italy")).toBeTruthy()
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

    it("displays the number of the selected filters on the filter modal screen", () => {
      const { getByText } = renderWithWrappersTL(<MockFilterScreen initialState={state} />)

      expect(within(getByText("Artwork Location")).getByText("• 2")).toBeTruthy()
    })

    it("toggles selected filters 'ON' and unselected filters 'OFF", async () => {
      const { getAllByA11yState } = renderWithWrappersTL(
        <MockLocationCitiesOptionsScreen initialData={state} />
      )

      const options = getAllByA11yState({ checked: true })

      expect(options).toHaveLength(2)
      expect(options[0]).toHaveTextContent("Paris, France")
      expect(options[1]).toHaveTextContent("Milan, Italy")
    })
  })
})
