import {
  Fair2ArtworksTestsQuery,
  Fair2ArtworksTestsQueryRawResponse,
} from "__generated__/Fair2ArtworksTestsQuery.graphql"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { Fair2ArtworksFragmentContainer } from "lib/Scenes/Fair2/Components/Fair2Artworks"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { ArtworkFilterContext, ArtworkFilterContextState } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

jest.unmock("react-relay")

describe("Fair2Artworks", () => {
  let state: ArtworkFilterContextState

  beforeEach(() => {
    state = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: [],
    }
  })

  const getWrapper = (fixture = FAIR_2_ARTWORKS_FIXTURE) => {
    const env = createMockEnvironment()

    const tree = renderWithWrappers(
      <QueryRenderer<Fair2ArtworksTestsQuery>
        environment={env}
        query={graphql`
          query Fair2ArtworksTestsQuery($fairID: String!) @raw_response_type {
            fair(id: $fairID) {
              ...Fair2Artworks_fair
            }
          }
        `}
        variables={{ fairID: "art-basel-hong-kong-2020" }}
        render={({ props, error }) => {
          if (error) {
            console.log(error)
            return null
          }

          if (!props || !props.fair) {
            return null
          }
          return (
            <ArtworkFilterContext.Provider value={{ state, dispatch: jest.fn() }}>
              <Fair2ArtworksFragmentContainer fair={props.fair} />
            </ArtworkFilterContext.Provider>
          )
        }}
      />
    )

    env.mock.resolveMostRecentOperation({ errors: [], data: fixture })

    return tree
  }

  it("renders a grid of artworks", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(1)
  })

  it("renders null if there are no artworks", () => {
    const wrapper = getWrapper({
      fair: {
        ...FAIR_2_ARTWORKS_FIXTURE.fair,
        fairArtworks: {
          ...FAIR_2_ARTWORKS_FIXTURE.fair?.fairArtworks,
          edges: [],
          counts: {
            total: 0,
            followedArtists: 0,
          },
        },
      },
    } as Fair2ArtworksTestsQueryRawResponse)

    expect(wrapper.root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(0)
    expect(wrapper.root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(0)
    expect(wrapper.root.findAllByType(FilteredArtworkGridZeroState)).toHaveLength(1)
    expect(extractText(wrapper.root)).toContain("Unfortunately, there are no works that meet your criteria.")
  })
})

const FAIR_2_ARTWORKS_FIXTURE: Fair2ArtworksTestsQueryRawResponse = {
  fair: {
    id: "random-relay-id",
    slug: "art-basel-hong-kong-2020",
    internalID: "BSON-id-random",
    fairArtworks: {
      __isArtworkConnectionInterface: "FilterArtworksConnection",
      id: "fa123",
      counts: {
        total: 2,
        followedArtists: 0,
      },
      pageInfo: {
        hasNextPage: false,
        startCursor: "123",
        endCursor: "abc",
      },
      aggregations: [],
      edges: [
        {
          node: {
            __typename: "Artwork",
            id: "ggg123",
            slug: "yayoi-kusama-pumpkin-2222222222222222",
            href: "/artwork/yayoi-kusama-pumpkin-2222222222222222",
            internalID: "zzz123",
            artistNames: "Andy Warhol",
            image: {
              aspectRatio: 1.27,
              url: "https://test.artsy.net/image",
            },
            title: "Pumpkin",
            date: "2020",
            saleMessage: "Contact For Price",
            partner: {
              name: "Important Auction House",
              id: "ahabc123",
            },
            sale: {
              isAuction: true,
              isClosed: false,
              id: "saleabc123",
              endAt: "2020-01-22",
              displayTimelyAt: "live in 3d",
            },
            saleArtwork: {
              lotLabel: "1A",
              counts: {
                bidderPositions: 0,
              },
              currentBid: {
                display: "USD $2222",
              },
              id: "idabc123",
            },
          },
          id: "nodeidabc",
          cursor: "aaaaa",
        },
        {
          node: {
            __typename: "Artwork",
            artistNames: "Andy Warhol",
            id: "abc123",
            slug: "yayoi-kusama-pumpkin-33333333333333333",
            href: "/artwork/yayoi-kusama-pumpkin-33333333333333333",
            internalID: "xxx123",
            image: {
              aspectRatio: 1.43,

              url: "https://test.artsy.net/image2",
            },
            title: "Pumpkin",
            date: "2020",
            saleMessage: "Contact For Price",
            partner: {
              name: "Important Gallery",
              id: "galleryabc123",
            },
            sale: null,
            saleArtwork: null,
          },
          id: "nodeid123",
          cursor: "aaaaabbbbb",
        },
      ],
    },
  },
}
