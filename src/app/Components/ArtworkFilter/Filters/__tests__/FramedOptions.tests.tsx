import { fireEvent, screen } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { MockFilterScreen } from "app/Components/ArtworkFilter/FilterTestHelper"
import { FramedOptionsScreen } from "app/Components/ArtworkFilter/Filters/FramedOptions.tsx"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe(FramedOptionsScreen, () => {
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

  const MockFramedOptionsScreen = ({
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
        <FramedOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  describe("no filters are selected", () => {
    it("renders all options", () => {
      renderWithWrappers(<MockFramedOptionsScreen initialData={initialState} />)

      expect(screen.getByText("Show only framed works")).toBeTruthy()
    })
  })

  describe("a filter is selected", () => {
    const state: ArtworkFiltersState = {
      ...initialState,
      selectedFilters: [
        {
          displayText: "Show only framed works",
          paramName: FilterParamName.framed,
          paramValue: true,
        },
      ],
    }

    it("displays the number of the selected filters on the filter modal screen", () => {
      renderWithWrappers(<MockFilterScreen initialState={state} />)

      expect(screen.getByText("Framed • 1")).toBeTruthy()
    })

    it("toggles selected filters 'ON' and unselected filters 'OFF", async () => {
      renderWithWrappers(<MockFramedOptionsScreen initialData={state} />)

      const options = screen.getAllByTestId("multi-select-option-button")
      const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

      expect(options).toHaveLength(1)
      expect(options[0]).toHaveTextContent("Show only framed works")

      expect(checkboxes[0]).toHaveProp("selected", true)

      fireEvent.press(options[0])

      expect(checkboxes[0]).toHaveProp("selected", false)

      fireEvent.press(options[0])

      expect(checkboxes[0]).toHaveProp("selected", true)
    })
  })
})
