import { fireEvent, screen } from "@testing-library/react-native"
import { Aggregations, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ArtistIDsSaleArtworksOptionsScreen } from "./ArtistIDsSaleArtworksOptionsScreen"
import { getEssentialProps } from "./helper"

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

    expect(screen.getByText("Artists You Follow")).toBeTruthy()
    expect(screen.getByText("All Artists")).toBeTruthy()
    expect(screen.getByText(/Artist A/)).toBeTruthy()
    expect(screen.getByText(/Artist B/)).toBeTruthy()
    expect(screen.getByText(/Artist C/)).toBeTruthy()
    expect(screen.getByText(/Artist D/)).toBeTruthy()
  })

  it("should render artist options sorted by name", () => {
    const { getAllByA11yState } = renderWithWrappers(<TestRenderer />)
    const options = getAllByA11yState({ checked: false })

    expect(options[0]).toHaveTextContent("Artists You Follow")
    expect(options[1]).toHaveTextContent("Artist A (10)")
    expect(options[2]).toHaveTextContent("Artist B (20)")
    expect(options[3]).toHaveTextContent("Artist C (40)")
    expect(options[4]).toHaveTextContent("Artist D (30)")
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

      const prevSelectedOptions = screen.getAllByA11yState({ checked: true })
      expect(prevSelectedOptions).toHaveLength(1)
      expect(prevSelectedOptions[0]).toHaveTextContent("All Artists")

      fireEvent.press(screen.getByText(/Artist B/))

      const selectedOptions = screen.getAllByA11yState({ checked: true })
      expect(selectedOptions).toHaveLength(1)
      expect(selectedOptions[0]).toHaveTextContent(/Artist B/)
    })

    it("when multiple options are selected", () => {
      renderWithWrappers(<TestRenderer />)

      const prevSelectedOptions = screen.getAllByA11yState({ checked: true })
      expect(prevSelectedOptions).toHaveLength(1)
      expect(prevSelectedOptions[0]).toHaveTextContent("All Artists")

      fireEvent.press(screen.getByText(/Artist A/))
      fireEvent.press(screen.getByText(/Artist B/))

      const selectedOptions = screen.getAllByA11yState({ checked: true })

      expect(selectedOptions).toHaveLength(2)
      expect(selectedOptions[0]).toHaveTextContent(/Artist A/)
      expect(selectedOptions[1]).toHaveTextContent(/Artist B/)
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

      const prevSelectedOptions = screen.getAllByA11yState({ checked: true })
      expect(prevSelectedOptions).toHaveLength(1)
      expect(prevSelectedOptions[0]).toHaveTextContent("Artist B (20)")

      fireEvent.press(screen.getByText(/Artist B/))

      const selectedOptions = screen.getAllByA11yState({ checked: true })
      expect(selectedOptions).toHaveLength(1)
      expect(selectedOptions[0]).toHaveTextContent("All Artists")
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

      const prevSelectedOptions = screen.getAllByA11yState({ checked: true })
      expect(prevSelectedOptions).toHaveLength(2)
      expect(prevSelectedOptions[0]).toHaveTextContent("Artist A (10)")
      expect(prevSelectedOptions[1]).toHaveTextContent("Artist B (20)")

      fireEvent.press(screen.getByText(/Artist B/))

      const selectedOptions = screen.getAllByA11yState({ checked: true })
      expect(selectedOptions).toHaveLength(1)
      expect(selectedOptions[0]).toHaveTextContent("Artist A (10)")
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
