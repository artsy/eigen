import { ArtistSeriesArtworksTestsQuery } from "__generated__/ArtistSeriesArtworksTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { ArtistSeriesArtworksFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesArtworks"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

jest.unmock("react-relay")

describe("Artist Series Artworks", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
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
            <ArtworkFiltersStoreProvider>
              <ArtistSeriesArtworksFragmentContainer artistSeries={props.artistSeries} />
            </ArtworkFiltersStoreProvider>
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
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
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
    expect(extractText(tree.root)).toContain(
      "No results found\nPlease try another search.Clear filters"
    )
  })
})
