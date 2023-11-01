import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { MockFilterScreen } from "app/Components/ArtworkFilter/FilterTestHelper"
import { ArtistSeriesOptionsScreen } from "app/Components/ArtworkFilter/Filters/ArtistSeriesOptions.tsx"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { getEssentialProps } from "./helper"

describe(ArtistSeriesOptionsScreen, () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtistSeriesFilter: true })
  })

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
      const { getByText } = renderWithWrappers(
        <MockArtistSeriesOptionsScreen initialData={initialState} />
      )

      expect(getByText("Portraits")).toBeTruthy()
      expect(getByText("Flowers")).toBeTruthy()
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
      const { getByText } = renderWithWrappers(<MockFilterScreen initialState={state} />)

      expect(getByText("Artist Series • 2")).toBeTruthy()
    })

    it("toggles selected filters 'ON' and unselected filters 'OFF", async () => {
      const { getAllByA11yState } = renderWithWrappers(
        <MockArtistSeriesOptionsScreen initialData={state} />
      )

      const options = getAllByA11yState({ checked: true })

      expect(options).toHaveLength(2)
      expect(options[0]).toHaveTextContent("Portraits")
      expect(options[1]).toHaveTextContent("Flowers")
    })
  })
})
