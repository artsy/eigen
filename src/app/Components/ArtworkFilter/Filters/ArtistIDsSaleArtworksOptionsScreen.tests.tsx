import { fireEvent } from "@testing-library/react-native"
import { Aggregations, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ArtistIDsSaleArtworksOptionsScreen } from "./ArtistIDsSaleArtworksOptionsScreen"
import { getEssentialProps } from "./helper"

describe("ArtistIDsSaleArtworksOptionsScreen", () => {
  const TestRenderer = ({ initialData }: { initialData?: ArtworkFiltersState }) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData ?? mockedState}>
        <ArtistIDsSaleArtworksOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("should render all artist options", () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)

    expect(getByText("Artists You Follow")).toBeTruthy()
    expect(getByText("All Artists")).toBeTruthy()
    expect(getByText(/Artist A/)).toBeTruthy()
    expect(getByText(/Artist B/)).toBeTruthy()
    expect(getByText(/Artist C/)).toBeTruthy()
    expect(getByText(/Artist D/)).toBeTruthy()
  })

  it("should render artist options sorted by name", () => {
    const { getAllByA11yState } = renderWithWrappers(<TestRenderer />)
    const options = getAllByA11yState({ checked: false })

    expect(options[0]).toHaveTextContent("Artists You Follow")
    expect(options[1]).toHaveTextContent("Artist A")
    expect(options[2]).toHaveTextContent("Artist B")
    expect(options[3]).toHaveTextContent("Artist C")
    expect(options[4]).toHaveTextContent("Artist D")
  })

  it("should render the followed artists count", () => {
    const injectedState: ArtworkFiltersState = {
      ...mockedState,
      counts: {
        ...mockedState.counts,
        followedArtists: 2,
      },
    }

    const { getByText } = renderWithWrappers(<TestRenderer initialData={injectedState} />)

    expect(getByText("Artists You Follow (2)")).toBeTruthy()
  })

  describe("Selecting", () => {
    it("when the single option is selected", () => {
      const { getAllByA11yState, getByText } = renderWithWrappers(<TestRenderer />)

      const prevSelectedOptions = getAllByA11yState({ checked: true })
      expect(prevSelectedOptions).toHaveLength(1)
      expect(prevSelectedOptions[0]).toHaveTextContent("All Artists")

      fireEvent.press(getByText(/Artist B/))

      const selectedOptions = getAllByA11yState({ checked: true })
      expect(selectedOptions).toHaveLength(1)
      expect(selectedOptions[0]).toHaveTextContent(/Artist B/)
    })

    it("when multiple options are selected", () => {
      const { getByText, getAllByA11yState } = renderWithWrappers(<TestRenderer />)

      const prevSelectedOptions = getAllByA11yState({ checked: true })
      expect(prevSelectedOptions).toHaveLength(1)
      expect(prevSelectedOptions[0]).toHaveTextContent("All Artists")

      fireEvent.press(getByText(/Artist A/))
      fireEvent.press(getByText(/Artist B/))

      const selectedOptions = getAllByA11yState({ checked: true })

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

      const { getAllByA11yState, getByText } = renderWithWrappers(
        <TestRenderer initialData={injectedState} />
      )

      const prevSelectedOptions = getAllByA11yState({ checked: true })
      expect(prevSelectedOptions).toHaveLength(1)
      expect(prevSelectedOptions[0]).toHaveTextContent("Artist B")

      fireEvent.press(getByText(/Artist B/))

      const selectedOptions = getAllByA11yState({ checked: true })
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

      const { getAllByA11yState, getByText } = renderWithWrappers(
        <TestRenderer initialData={injectedState} />
      )

      const prevSelectedOptions = getAllByA11yState({ checked: true })
      expect(prevSelectedOptions).toHaveLength(2)
      expect(prevSelectedOptions[0]).toHaveTextContent("Artist A")
      expect(prevSelectedOptions[1]).toHaveTextContent("Artist B")

      fireEvent.press(getByText(/Artist B/))

      const selectedOptions = getAllByA11yState({ checked: true })
      expect(selectedOptions).toHaveLength(1)
      expect(selectedOptions[0]).toHaveTextContent("Artist A")
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
  sizeMetric: "cm",
}
