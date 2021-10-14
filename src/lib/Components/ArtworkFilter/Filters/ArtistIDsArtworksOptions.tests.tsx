import { Aggregations, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { TouchableRow } from "lib/Components/TouchableRow"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers, renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import { Check } from "palette"
import React from "react"
import { act, ReactTestRenderer } from "react-test-renderer"
import { ArtistIDsArtworksOptionsScreen } from "./ArtistIDsArtworksOptions"
import { getEssentialProps } from "./helper"
import { OptionListItem } from "./MultiSelectOption"

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

  const selectedArtistOptions = (componentTree: ReactTestRenderer) => {
    const artistOptions = componentTree.root.findAllByType(OptionListItem)
    const selectedOptions = artistOptions.filter((item) => {
      return item.findByType(Check).props.selected === true
    })
    return selectedOptions
  }

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
    }
    const tree = renderWithWrappers(<MockArtistScreen initialData={injectedState} />)

    // Includes a button for each artist + one for followed artists,
    // but our FlatList is configured to only show 4 in the initial render pass
    expect(tree.root.findAllByType(Check)).toHaveLength(6)
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
      }

      const component = renderWithWrappers(<MockArtistScreen initialData={injectedState} />)

      const selectedOption = selectedArtistOptions(component)[0]
      expect(extractText(selectedOption)).toEqual("Artist 2")
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
      }

      const tree = renderWithWrappers(<MockArtistScreen initialData={injectedState} />)

      const firstOptionInstance = tree.root.findAllByType(TouchableRow)[0] // Artists I follow
      const secondOptionInstance = tree.root.findAllByType(TouchableRow)[1] // Artist 1
      const thirdOptionInstance = tree.root.findAllByType(TouchableRow)[2] // Artist 2

      act(() => firstOptionInstance.props.onPress())
      act(() => secondOptionInstance.props.onPress())
      act(() => thirdOptionInstance.props.onPress())

      const selectedOptions = selectedArtistOptions(tree)
      expect(selectedOptions).toHaveLength(3)
      expect(extractText(selectedOptions[0])).toMatch("All Artists I Follow")
      expect(extractText(selectedOptions[1])).toMatch("Artist 1")
      expect(extractText(selectedOptions[2])).toMatch("Artist 2")
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
      }

      const tree = renderWithWrappers(<MockArtistScreen initialData={injectedState} />)

      const secondOptionInstance = tree.root.findAllByType(TouchableRow)[2] // Artists I follow, Artist 1, Artist 2
      const selectedOptionsBeforeTapping = selectedArtistOptions(tree)
      expect(selectedOptionsBeforeTapping).toHaveLength(1)
      expect(extractText(selectedOptionsBeforeTapping[0])).toEqual("Artist 2")

      act(() => secondOptionInstance.props.onPress())

      const selectedOptions = selectedArtistOptions(tree)
      expect(selectedOptions).toHaveLength(0)
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
      }

      const { queryByText } = renderWithWrappersTL(<MockArtistScreen initialData={injectedState} />)

      // Artists I followed option should be hidden
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
      }

      const { queryByText } = renderWithWrappersTL(<MockArtistScreen initialData={injectedState} />)

      // Artists I followed option should be hidden
      expect(queryByText("All Artists I Follow")).toBeFalsy()
    })
  })
})
