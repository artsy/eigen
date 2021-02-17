import { ArtistSeriesArtworksTestsQuery } from "__generated__/ArtistSeriesArtworksTestsQuery.graphql"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { ArtistSeriesArtworksFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesArtworks"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { ArtworkFilterContext, ArtworkFilterContextState } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

jest.unmock("react-relay")

describe("Artist Series Artworks", () => {
  let env: ReturnType<typeof createMockEnvironment>
  let state: ArtworkFilterContextState

  beforeEach(() => {
    env = createMockEnvironment()
    state = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }
  })

  const TestRenderer = () => (
    <QueryRenderer<ArtistSeriesArtworksTestsQuery>
      environment={env}
      query={graphql`
        query ArtistSeriesArtworksTestsQuery @relay_test_operation {
          artistSeries(id: "pumpkins") {
            ...ArtistSeriesArtworks_artistSeries
          }
        }
      `}
      variables={{ artistSeriesID: "pumpkins" }}
      render={({ props, error }) => {
        if (props?.artistSeries) {
          return (
            <ArtworkFilterContext.Provider value={{ state, dispatch: jest.fn() }}>
              <ArtistSeriesArtworksFragmentContainer artistSeries={props.artistSeries} />
            </ArtworkFilterContext.Provider>
          )
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, mockResolvers))
    })
    return tree
  }

  it("renders an artwork grid if artworks", () => {
    const tree = getWrapper()
    expect(tree.root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(1)
  })

  it("renders a null component if no artworks", () => {
    const tree = getWrapper({
      ArtistSeries: () => ({
        artistSeriesArtworks: {
          counts: {
            total: 0,
          },
        },
      }),
    })

    expect(tree.root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(0)
    expect(tree.root.findAllByType(FilteredArtworkGridZeroState)).toHaveLength(1)
    expect(extractText(tree.root)).toContain("No results found\nPlease try another search.Clear filtersClear filters")
  })
})
