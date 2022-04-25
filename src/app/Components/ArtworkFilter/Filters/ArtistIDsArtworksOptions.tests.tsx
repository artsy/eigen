import { fireEvent } from "@testing-library/react-native"
import { Aggregations, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
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
      <ArtworkFiltersStoreProvider initialData={initialData}>
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
      sizeMetric: "cm",
    }
    const { getAllByA11yState } = renderWithWrappersTL(
      <MockArtistScreen initialData={injectedState} />
    )

    expect(getAllByA11yState({ checked: false })).toHaveLength(6)
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
        sizeMetric: "cm",
      }

      const { getAllByA11yState } = renderWithWrappersTL(
        <MockArtistScreen initialData={injectedState} />
      )
      const selectedOptions = getAllByA11yState({ checked: true })

      expect(selectedOptions[0]).toHaveTextContent("Artist 2")
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
        sizeMetric: "cm",
      }

      const { getByText, getAllByA11yState } = renderWithWrappersTL(
        <MockArtistScreen initialData={injectedState} />
      )

      fireEvent.press(getByText("All Artists I Follow"))
      fireEvent.press(getByText("Artist 1"))
      fireEvent.press(getByText("Artist 2"))

      const selectedOptions = getAllByA11yState({ checked: true })

      expect(selectedOptions).toHaveLength(3)
      expect(selectedOptions[0]).toHaveTextContent("All Artists I Follow")
      expect(selectedOptions[1]).toHaveTextContent("Artist 1")
      expect(selectedOptions[2]).toHaveTextContent("Artist 2")
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
        sizeMetric: "cm",
      }

      const { queryByA11yState, getAllByA11yState, getByText } = renderWithWrappersTL(
        <MockArtistScreen initialData={injectedState} />
      )

      const selectedOptionsBeforeTapping = getAllByA11yState({ checked: true })
      expect(selectedOptionsBeforeTapping).toHaveLength(1)
      expect(selectedOptionsBeforeTapping[0]).toHaveTextContent("Artist 2")

      fireEvent.press(getByText("Artist 2"))

      expect(queryByA11yState({ checked: true })).toBeFalsy()
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
        sizeMetric: "cm",
      }

      const { queryByText } = renderWithWrappersTL(<MockArtistScreen initialData={injectedState} />)

      expect(queryByText("All Artists I Follow")).toBeTruthy()
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
        sizeMetric: "cm",
      }

      const { queryByText } = renderWithWrappersTL(<MockArtistScreen initialData={injectedState} />)

      expect(queryByText("All Artists I Follow")).toBeTruthy()
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
        sizeMetric: "cm",
      }

      const { queryByText } = renderWithWrappersTL(<MockArtistScreen initialData={injectedState} />)

      expect(queryByText("All Artists I Follow")).toBeFalsy()
    })
  })
})
