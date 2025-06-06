import { screen } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { MockFilterScreen } from "app/Components/ArtworkFilter/FilterTestHelper"
import { LocationCitiesOptionsScreen } from "app/Components/ArtworkFilter/Filters/LocationCitiesOptions"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

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
    showFilterArtworksModal: false,
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
      <ArtworkFiltersStoreProvider
        runtimeModel={{
          ...getArtworkFiltersModel(),
          ...initialData,
        }}
      >
        <LocationCitiesOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  describe("no filters are selected", () => {
    it("renders all options present in the aggregation", () => {
      renderWithWrappers(<MockLocationCitiesOptionsScreen initialData={initialState} />)

      expect(screen.getByText("Paris, France")).toBeOnTheScreen()
      expect(screen.getByText("London, United Kingdom")).toBeOnTheScreen()
      expect(screen.getByText("Milan, Italy")).toBeOnTheScreen()
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
      renderWithWrappers(<MockFilterScreen initialState={state} />)

      expect(screen.getByText("Artwork Location • 2")).toBeOnTheScreen()
    })

    it("toggles selected filters 'ON' and unselected filters 'OFF", async () => {
      renderWithWrappers(<MockLocationCitiesOptionsScreen initialData={state} />)

      const options = screen.getAllByTestId("multi-select-option-button")

      expect(options).toHaveLength(3)
      expect(options[0]).toHaveTextContent("Paris, France")
      expect(options[1]).toHaveTextContent("London, United Kingdom")
      expect(options[2]).toHaveTextContent("Milan, Italy")
    })
  })
})
