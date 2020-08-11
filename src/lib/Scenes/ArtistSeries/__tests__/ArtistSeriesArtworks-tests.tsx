import {
  ArtistSeriesArtworksTestsQuery,
  ArtistSeriesArtworksTestsQueryRawResponse,
} from "__generated__/ArtistSeriesArtworksTestsQuery.graphql"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { ArtistSeriesArtworksFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesArtworks"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

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
        query ArtistSeriesArtworksTestsQuery @raw_response_type {
          artistSeries(id: "pumpkins") {
            ...ArtistSeriesArtworks_artistSeries
          }
        }
      `}
      variables={{ artistSeriesID: "pumpkins" }}
      render={({ props, error }) => {
        if (props?.artistSeries) {
          return <ArtistSeriesArtworksFragmentContainer artistSeries={props.artistSeries} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  it("renders an artwork grid if artworks", () => {
    const wrapper = () => {
      const tree = renderWithWrappers(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: {
            ...ArtistSeriesArtworksFixture,
          },
        })
      })
      return tree
    }

    expect(wrapper().root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(1)
  })

  it("renders a null component if no artworks", () => {
    const wrapper = () => {
      const tree = renderWithWrappers(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: {
            ...ArtistSeriesZeroArtworksFixture,
          },
        })
      })
      return tree
    }

    expect(wrapper().root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(0)
  })
})

const ArtistSeriesArtworksFixture: ArtistSeriesArtworksTestsQueryRawResponse = {
  artistSeries: {
    slug: "a-slug",
    artistSeriesArtworks: {
      pageInfo: {
        hasNextPage: false,
        startCursor: "ajdjabnz81",
        endCursor: "aknqa9d81",
      },
      id: null,
      counts: { total: 4 },
      edges: [
        {
          node: {
            id: "12345654321",
            slug: "pumpkins-1",
            image: null,
            title: "Pumpkins 1.0",
            date: null,
            saleMessage: null,
            artistNames: null,
            href: null,
            sale: null,
            saleArtwork: null,
            partner: null,
            __typename: "Artwork",
          },
          cursor: "123456789",
          id: "#8989141",
        },
        {
          node: {
            id: "9874491018",
            slug: "pumpkins-2",
            image: null,
            title: "Pumpkins 2.0",
            date: null,
            saleMessage: null,
            artistNames: null,
            href: null,
            sale: null,
            saleArtwork: null,
            partner: null,
            __typename: "Artwork",
          },
          cursor: "98761511",
          id: "faf91kjg8",
        },
        {
          node: {
            id: "128163456",
            slug: "pumpkins-3",
            image: null,
            title: "Pumpkins 3.0",
            date: null,
            saleMessage: null,
            artistNames: null,
            href: null,
            sale: null,
            saleArtwork: null,
            partner: null,
            __typename: "Artwork",
          },
          cursor: "19017613",
          id: "fja91k30v",
        },
        {
          node: {
            id: "123310456",
            slug: "pumpkins-4",
            image: null,
            title: "Pumpkins 4.0",
            date: null,
            saleMessage: null,
            artistNames: null,
            href: null,
            sale: null,
            saleArtwork: null,
            partner: null,
            __typename: "Artwork",
          },
          cursor: "01827111",
          id: "afd7a91m1",
        },
      ],
    },
  },
}

const ArtistSeriesZeroArtworksFixture: ArtistSeriesArtworksTestsQueryRawResponse = {
  artistSeries: {
    slug: "a-slug",
    artistSeriesArtworks: {
      pageInfo: {
        hasNextPage: false,
        startCursor: "ajdjabnz81",
        endCursor: "aknqa9d81",
      },
      id: null,
      counts: {
        total: 0,
      },
      edges: [],
    },
  },
}
