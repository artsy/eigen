import { fireEvent, screen } from "@testing-library/react-native"
import { Aggregations, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ArtistIDsArtworksOptionsScreen } from "./ArtistIDsArtworksOptions"
import { getEssentialProps } from "./helper"

describe("Artist options screen", () => {
  const mockAggregations: Aggregations = [
    {
      slice: "ARTIST",
      counts: [
        {
          name: "Artist 1",
          count: 2956,
          value: "artist-1",
        },
        {
          name: "Artist 2",
          count: 513,
          value: "artist-2",
        },
        {
          name: "Artist 3",
          count: 277,
          value: "artist-3",
        },
        {
          name: "Artist 4",
          count: 149,
          value: "artist-4",
        },
        {
          name: "Artist 5",
          count: 145,
          value: "artist-5",
        },
      ],
    },
    {
      slice: "FOLLOWED_ARTISTS",
      counts: [
        {
          name: "followed_artists",
          count: 2,
          value: "followed_artists",
        },
      ],
    },
  ]

  const MockArtistScreen = ({ initialData }: { initialData?: ArtworkFiltersState }) => {
    return (
      <ArtworkFiltersStoreProvider
        runtimeModel={{
          ...getArtworkFiltersModel(),
          ...initialData,
        }}
      >
        <ArtistIDsArtworksOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("shows the correct number of artist options", () => {
    const injectedState: ArtworkFiltersState = {
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
    renderWithWrappers(<MockArtistScreen initialData={injectedState} />)

    const checkboxes = screen.getAllByRole("checkbox")

    expect(checkboxes).toHaveLength(6)
  })

  describe("selecting an artist option", () => {
    it("selects only the option that is tapped", () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [
          {
            paramName: FilterParamName.artistIDs,
            paramValue: ["artist-2"],
            displayText: "Artist 2",
          },
        ],
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

      renderWithWrappers(<MockArtistScreen initialData={injectedState} />)

      const options = screen.getAllByTestId("multi-select-option-button")
      const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

      expect(options[2]).toHaveTextContent("Artist 2")
      expect(checkboxes[2]).toHaveProp("selected", true)
    })

    it("allows multiple artist options to be selected", () => {
      const injectedState: ArtworkFiltersState = {
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

      renderWithWrappers(<MockArtistScreen initialData={injectedState} />)

      const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

      fireEvent.press(screen.getByText("All Artists I Follow"))
      fireEvent.press(screen.getByText("Artist 1"))
      fireEvent.press(screen.getByText("Artist 2"))

      expect(checkboxes[0]).toHaveProp("selected", true)
      expect(checkboxes[1]).toHaveProp("selected", true)
      expect(checkboxes[2]).toHaveProp("selected", true)
      expect(checkboxes[3]).toHaveProp("selected", false)
      expect(checkboxes[4]).toHaveProp("selected", false)
      expect(checkboxes[5]).toHaveProp("selected", false)
    })

    it("deselects artist option if it is already selected and then tapped again", () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [
          {
            paramName: FilterParamName.artistIDs,
            paramValue: ["artist-2"],
            displayText: "Artist 2",
          },
        ],
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

      renderWithWrappers(<MockArtistScreen initialData={injectedState} />)

      const options = screen.getAllByTestId("multi-select-option-button")
      const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

      expect(options[2]).toHaveTextContent("Artist 2")
      expect(checkboxes[2]).toHaveProp("selected", true)

      fireEvent.press(screen.getByText("Artist 2"))

      expect(checkboxes[2]).toHaveProp("selected", false)
    })
  })

  describe("Artists I follow option", () => {
    it("should be visible if there are followed artists in the aggregation", () => {
      const injectedState: ArtworkFiltersState = {
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

      renderWithWrappers(<MockArtistScreen initialData={injectedState} />)

      expect(screen.getByText("All Artists I Follow")).toBeOnTheScreen()
    })

    it("should be visible if counts has followedArtists ", () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
        aggregations: mockAggregations,
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: 10,
        },
        showFilterArtworksModal: false,
        sizeMetric: "cm",
      }

      renderWithWrappers(<MockArtistScreen initialData={injectedState} />)

      expect(screen.getByText("All Artists I Follow")).toBeOnTheScreen()
    })

    it("should be hidden if there are no followed artists in the aggregation", () => {
      const aggregations: Aggregations = [
        {
          slice: "ARTIST",
          counts: [
            {
              name: "Artist 1",
              count: 2956,
              value: "artist-1",
            },
          ],
        },
      ]

      const injectedState: ArtworkFiltersState = {
        selectedFilters: [],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
        aggregations,
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: null,
        },
        showFilterArtworksModal: false,
        sizeMetric: "cm",
      }

      renderWithWrappers(<MockArtistScreen initialData={injectedState} />)

      expect(screen.queryByText("All Artists I Follow")).not.toBeOnTheScreen()
    })
  })
})
