import { fireEvent } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { MockFilterScreen } from "app/Components/ArtworkFilter/FilterTestHelper"
import { AvailabilityOptionsScreen } from "app/Components/ArtworkFilter/Filters/AvailabilityOptions.tsx"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { getEssentialProps } from "./helper"

describe(AvailabilityOptionsScreen, () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableAvailabilityFilter: true })
  })

  const initialState: ArtworkFiltersState = {
    aggregations: [],
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

  const MockAvailabilityOptionsScreen = ({
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
        <AvailabilityOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  describe("no filters are selected", () => {
    it("renders all options", () => {
      const { getByText } = renderWithWrappers(
        <MockAvailabilityOptionsScreen initialData={initialState} />
      )

      expect(getByText("Only works for sale")).toBeTruthy()
    })
  })

  describe("a filter is selected", () => {
    const state: ArtworkFiltersState = {
      ...initialState,
      selectedFilters: [
        {
          displayText: "Only works for sale",
          paramName: FilterParamName.forSale,
          paramValue: true,
        },
      ],
    }

    it("displays the number of the selected filters on the filter modal screen", () => {
      const { getByText } = renderWithWrappers(<MockFilterScreen initialState={state} />)

      expect(getByText("Availability • 1")).toBeTruthy()
    })

    it("toggles selected filters 'ON' and unselected filters 'OFF", async () => {
      const { getAllByA11yState } = renderWithWrappers(
        <MockAvailabilityOptionsScreen initialData={state} />
      )

      let options = getAllByA11yState({ checked: true })

      expect(options).toHaveLength(1)
      expect(options[0]).toHaveTextContent("Only works for sale")

      fireEvent.press(options[0])

      options = getAllByA11yState({ checked: false })

      expect(options).toHaveLength(1)
      expect(options[0]).toHaveTextContent("Only works for sale")
    })
  })
})
