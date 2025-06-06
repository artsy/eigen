import { fireEvent, screen } from "@testing-library/react-native"
import { Aggregations, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ArtistIDsSaleArtworksOptionsScreen } from "app/Components/ArtworkFilter/Filters/ArtistIDsSaleArtworksOptionsScreen"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ArtistIDsSaleArtworksOptionsScreen", () => {
  const TestRenderer = ({ initialData }: { initialData?: ArtworkFiltersState }) => {
    const data = initialData ?? mockedState
    return (
      <ArtworkFiltersStoreProvider
        runtimeModel={{
          ...getArtworkFiltersModel(),
          ...data,
        }}
      >
        <ArtistIDsSaleArtworksOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("should render all artist options", () => {
    renderWithWrappers(<TestRenderer />)

    expect(screen.getByText("Artists You Follow")).toBeOnTheScreen()
    expect(screen.getByText("All Artists")).toBeOnTheScreen()
    expect(screen.getByText(/Artist A/)).toBeOnTheScreen()
    expect(screen.getByText(/Artist B/)).toBeOnTheScreen()
    expect(screen.getByText(/Artist C/)).toBeOnTheScreen()
    expect(screen.getByText(/Artist D/)).toBeOnTheScreen()
  })

  it("should render artist options sorted by name", () => {
    renderWithWrappers(<TestRenderer />)
    const options = screen.getAllByTestId("multi-select-option-button")

    expect(options[0]).toHaveTextContent("Artists You Follow")
    expect(options[1]).toHaveTextContent("All Artists")
    expect(options[2]).toHaveTextContent(/Artist A/)
    expect(options[3]).toHaveTextContent(/Artist B/)
    expect(options[4]).toHaveTextContent(/Artist C/)
    expect(options[5]).toHaveTextContent(/Artist D/)
  })

  it("should render the followed artists count", () => {
    const injectedState: ArtworkFiltersState = {
      ...mockedState,
      counts: {
        ...mockedState.counts,
        followedArtists: 2,
      },
    }

    renderWithWrappers(<TestRenderer initialData={injectedState} />)

    expect(screen.getByText("Artists You Follow (2)")).toBeTruthy()
  })

  describe("Selecting", () => {
    it("when the single option is selected", () => {
      renderWithWrappers(<TestRenderer />)
      const options = screen.getAllByTestId("multi-select-option-button")

      expect(options[1]).toHaveTextContent("All Artists")
      expect(screen.getByTestId("selected-checkmark-All Artists")).toBeOnTheScreen()

      expect(screen.queryByTestId("selected-checkmark-Artist B")).not.toBeOnTheScreen()

      fireEvent.press(screen.getByText(/Artist B/))

      expect(screen.getByTestId("selected-checkmark-Artist B")).toBeOnTheScreen()
      expect(screen.queryByTestId("selected-checkmark-All Artists")).not.toBeOnTheScreen()
    })

    it("when multiple options are selected", () => {
      renderWithWrappers(<TestRenderer />)

      const options = screen.getAllByTestId("multi-select-option-button")

      expect(options[1]).toHaveTextContent("All Artists")
      expect(screen.getByTestId("selected-checkmark-All Artists")).toBeOnTheScreen()

      expect(screen.queryByTestId("selected-checkmark-Artist A")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("selected-checkmark-Artist B")).not.toBeOnTheScreen()

      fireEvent.press(screen.getByText(/Artist A/))
      fireEvent.press(screen.getByText(/Artist B/))

      expect(screen.getByTestId("selected-checkmark-Artist A")).toBeOnTheScreen()
      expect(screen.getByTestId("selected-checkmark-Artist B")).toBeOnTheScreen()
      expect(screen.queryByTestId("selected-checkmark-All Artists")).not.toBeOnTheScreen()
    })
  })

  describe("Deselecting", () => {
    it("when the single option is selected", () => {
      const injectedState: ArtworkFiltersState = {
        ...mockedState,
        selectedFilters: [
          {
            paramName: FilterParamName.artistIDs,
            paramValue: ["artist-b"],
            displayText: "Artist B",
          },
        ],
      }

      renderWithWrappers(<TestRenderer initialData={injectedState} />)

      const options = screen.getAllByTestId("multi-select-option-button")

      expect(options[3]).toHaveTextContent(/Artist B/)
      expect(screen.getByTestId("selected-checkmark-Artist B")).toBeOnTheScreen()
      expect(screen.queryByTestId("selected-checkmark-All Artists")).not.toBeOnTheScreen()

      fireEvent.press(screen.getByText(/Artist B/))

      expect(screen.queryByTestId("selected-checkmark-Artist B")).not.toBeOnTheScreen()
      expect(screen.getByTestId("selected-checkmark-All Artists")).toBeOnTheScreen()
    })

    it("when multiple options are selected", () => {
      const injectedState: ArtworkFiltersState = {
        ...mockedState,
        selectedFilters: [
          {
            paramName: FilterParamName.artistIDs,
            paramValue: ["artist-a", "artist-b"],
            displayText: "Artist A, Artist B",
          },
        ],
      }

      renderWithWrappers(<TestRenderer initialData={injectedState} />)

      expect(screen.getByTestId("selected-checkmark-Artist A")).toBeOnTheScreen()
      expect(screen.getByTestId("selected-checkmark-Artist B")).toBeOnTheScreen()
      expect(screen.queryByTestId("selected-checkmark-All Artists")).not.toBeOnTheScreen()

      fireEvent.press(screen.getByText(/Artist B/))

      expect(screen.queryByTestId("selected-checkmark-Artist B")).not.toBeOnTheScreen()
      expect(screen.getByTestId("selected-checkmark-Artist A")).toBeOnTheScreen()
    })
  })
})

const mockAggregations: Aggregations = [
  {
    slice: "ARTIST",
    counts: [
      {
        name: "Artist B",
        count: 20,
        value: "artist-b",
      },
      {
        name: "Artist A",
        count: 10,
        value: "artist-a",
      },
      {
        name: "Artist D",
        count: 30,
        value: "artist-d",
      },
      {
        name: "Artist C",
        count: 40,
        value: "artist-c",
      },
    ],
  },
]

const mockedState: ArtworkFiltersState = {
  selectedFilters: [],
  appliedFilters: [],
  previouslyAppliedFilters: [],
  applyFilters: false,
  aggregations: mockAggregations,
  filterType: "artwork",
  counts: {
    total: null,
    followedArtists: null,
  },
  showFilterArtworksModal: false,
  sizeMetric: "cm",
}
