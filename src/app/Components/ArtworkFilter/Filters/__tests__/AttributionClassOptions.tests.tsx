import { screen } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { MockFilterScreen } from "app/Components/ArtworkFilter/FilterTestHelper"
import { AttributionClassOptionsScreen } from "app/Components/ArtworkFilter/Filters/AttributionClassOptions"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("AttributionClassOptions Screen", () => {
  const MockAttributionClassOptionsScreen = ({
    initialData,
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
        <AttributionClassOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("renders the options", () => {
    renderWithWrappers(<MockAttributionClassOptionsScreen />)

    expect(screen.getByText("Unique")).toBeOnTheScreen()
    expect(screen.getByText("Limited Edition")).toBeOnTheScreen()
    expect(screen.getByText("Open Edition")).toBeOnTheScreen()
    expect(screen.getByText("Unknown Edition")).toBeOnTheScreen()
  })

  it("displays all the selected filters on the filter modal screen", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Unique, Unknown Edition",
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    renderWithWrappers(<MockFilterScreen initialState={injectedState} />)

    expect(screen.getByText("Rarity • 2")).toBeTruthy()
  })

  it("toggles selected filters 'ON' and unselected filters 'OFF", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Unique, Unknown Edition",
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
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    renderWithWrappers(<MockAttributionClassOptionsScreen initialData={injectedState} />)
    const options = screen.getAllByTestId("multi-select-option-button")

    expect(options).toHaveLength(4)
    expect(options[0]).toHaveTextContent("Unique")
    expect(options[3]).toHaveTextContent("Unknown Edition")

    const checkbox = screen.getAllByTestId("multi-select-option-checkbox")
    expect(checkbox).toHaveLength(4)

    expect(checkbox[0]).toHaveProp("selected", true)
    expect(checkbox[3]).toHaveProp("selected", true)

    expect(checkbox[1]).toHaveProp("selected", false)
    expect(checkbox[2]).toHaveProp("selected", false)
  })
})
