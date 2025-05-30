import { fireEvent, screen } from "@testing-library/react-native"
import { Aggregations, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { MockFilterScreen } from "app/Components/ArtworkFilter/FilterTestHelper"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { AdditionalGeneIDsOptionsScreen } from "./AdditionalGeneIDsOptions"
import { getEssentialProps } from "./helper"

const MOCK_AGGREGATIONS: Aggregations = [
  {
    slice: "MEDIUM",
    counts: [
      { name: "Prints", count: 2956, value: "prints" },
      { name: "Design", count: 513, value: "design" },
      { name: "Sculpture", count: 277, value: "sculpture" },
      { name: "Work on Paper", count: 149, value: "work-on-paper" },
      { name: "Painting", count: 145, value: "painting" },
      { name: "Drawing", count: 83, value: "drawing" },
      { name: "Jewelry", count: 9, value: "jewelry" },
      { name: "Photography", count: 4, value: "photography" },
    ],
  },
]

describe("AdditionalGeneIDsOptions Screen", () => {
  const initialState: ArtworkFiltersState = {
    selectedFilters: [],
    appliedFilters: [],
    previouslyAppliedFilters: [],
    applyFilters: false,
    aggregations: MOCK_AGGREGATIONS,
    filterType: "artwork",
    counts: {
      total: null,
      followedArtists: null,
    },
    showFilterArtworksModal: false,
    sizeMetric: "cm",
  }

  const MockAdditionalGeneIDsOptionsScreen = ({
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
        <AdditionalGeneIDsOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("renders the options", () => {
    renderWithWrappers(<MockAdditionalGeneIDsOptionsScreen initialData={initialState} />)

    expect(screen.getByText("Prints")).toBeTruthy()
    expect(screen.getByText("Design")).toBeTruthy()
    expect(screen.getByText("Sculpture")).toBeTruthy()
    expect(screen.getByText("Work on Paper")).toBeTruthy()
    expect(screen.getByText("Painting")).toBeTruthy()
    expect(screen.getByText("Drawing")).toBeTruthy()
    expect(screen.getByText("Jewelry")).toBeTruthy()
    expect(screen.getByText("Photography")).toBeTruthy()
  })

  it("displays the number of the selected filters on the filter modal screen", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Prints, Sculpture",
          paramName: FilterParamName.additionalGeneIDs,
          paramValue: ["prints", "sculpture"],
        },
      ],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: MOCK_AGGREGATIONS,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    renderWithWrappers(<MockFilterScreen initialState={injectedState} />)

    expect(screen.getByText("Medium • 2")).toBeOnTheScreen()
  })

  it("toggles selected filters 'ON' and unselected filters 'OFF", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Prints, Sculpture",
          paramName: FilterParamName.additionalGeneIDs,
          paramValue: ["prints", "sculpture"],
        },
      ],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: MOCK_AGGREGATIONS,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    renderWithWrappers(<MockAdditionalGeneIDsOptionsScreen initialData={injectedState} />)
    const option1 = screen.getByText("Prints")
    const option2 = screen.getByText("Sculpture")

    expect(option1).toBeOnTheScreen()
    expect(option2).toBeOnTheScreen()

    const checkbox = screen.getAllByTestId("multi-select-option-checkbox")

    expect(checkbox[0]).toHaveProp("selected", true)
    expect(checkbox[2]).toHaveProp("selected", true)
  })

  it("clears all when clear button is tapped", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Prints, Sculpture",
          paramName: FilterParamName.additionalGeneIDs,
          paramValue: ["prints", "sculpture"],
        },
      ],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: MOCK_AGGREGATIONS,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    renderWithWrappers(<MockAdditionalGeneIDsOptionsScreen initialData={injectedState} />)

    const checkbox = screen.getAllByRole("checkbox")

    expect(checkbox[0]).toBeChecked()
    expect(checkbox[2]).toBeChecked()

    fireEvent.press(screen.getByText("Clear"))

    expect(checkbox[0]).not.toBeChecked()
    expect(checkbox[2]).not.toBeChecked()
  })
})
