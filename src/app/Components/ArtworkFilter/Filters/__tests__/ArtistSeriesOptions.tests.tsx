import { fireEvent, screen } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { MockFilterScreen } from "app/Components/ArtworkFilter/FilterTestHelper"
import { ArtistSeriesOptionsScreen } from "app/Components/ArtworkFilter/Filters/ArtistSeriesOptions.tsx"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe(ArtistSeriesOptionsScreen, () => {
  const initialState: ArtworkFiltersState = {
    aggregations: [
      {
        slice: "ARTIST_SERIES",
        counts: [
          {
            count: 1626,
            name: "Portraits",
            value: "andy-warhol-portraits",
          },
          {
            count: 379,
            name: "Flowers",
            value: "andy-warhol-flowers",
          },
          {
            count: 162,
            name: "Posters",
            value: "andy-warhol-posters",
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

  const MockArtistSeriesOptionsScreen = ({
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
        <ArtistSeriesOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  describe("no filters are selected", () => {
    it("renders all options present in the aggregation", () => {
      renderWithWrappers(<MockArtistSeriesOptionsScreen initialData={initialState} />)

      expect(screen.getByText("Portraits")).toBeOnTheScreen()
      expect(screen.getByText("Flowers")).toBeOnTheScreen()
    })
  })

  describe("a filter is selected", () => {
    const state: ArtworkFiltersState = {
      ...initialState,
      selectedFilters: [
        {
          displayText: "Portraits, Flowers",
          paramName: FilterParamName.artistSeriesIDs,
          paramValue: ["andy-warhol-portraits", "andy-warhol-flowers"],
        },
      ],
    }

    it("displays the number of the selected filters on the filter modal screen", () => {
      renderWithWrappers(<MockFilterScreen initialState={state} />)

      expect(screen.getByText("Artist Series • 2")).toBeOnTheScreen()
    })

    it("toggles selected filters 'ON' and unselected filters 'OFF", async () => {
      renderWithWrappers(<MockArtistSeriesOptionsScreen initialData={state} />)

      const options = screen.getAllByTestId("multi-select-option-button")
      const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

      expect(options).toHaveLength(3)
      expect(options[0]).toHaveTextContent("Portraits")
      expect(options[1]).toHaveTextContent("Flowers")
      expect(options[2]).toHaveTextContent("Posters")

      expect(checkboxes[0]).toHaveProp("selected", true)
      expect(checkboxes[1]).toHaveProp("selected", true)
      expect(checkboxes[2]).toHaveProp("selected", false)

      fireEvent.press(options[0])

      expect(checkboxes[0]).toHaveProp("selected", false)
      expect(checkboxes[1]).toHaveProp("selected", true)
      expect(checkboxes[2]).toHaveProp("selected", false)

      fireEvent.press(options[2])

      expect(checkboxes[0]).toHaveProp("selected", false)
      expect(checkboxes[1]).toHaveProp("selected", true)
      expect(checkboxes[2]).toHaveProp("selected", true)
    })
  })
})
