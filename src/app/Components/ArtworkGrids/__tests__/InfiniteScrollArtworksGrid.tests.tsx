import { Button } from "@artsy/palette-mobile"
import { InfiniteScrollArtworksGridTestsQuery } from "__generated__/InfiniteScrollArtworksGridTestsQuery.graphql"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

describe("Artist Series Artworks", () => {
  let env: ReturnType<typeof createMockEnvironment>
  const relayMock = {
    loadMore: jest.fn(),
    hasMore: () => {
      return true
    },
    isLoading: jest.fn(),
  }
  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<InfiniteScrollArtworksGridTestsQuery>
      environment={env}
      query={graphql`
        query InfiniteScrollArtworksGridTestsQuery @raw_response_type {
          artworksConnection(first: 10) {
            pageInfo {
              hasNextPage
              startCursor
              endCursor
            }
            edges {
              node {
                slug
                id
                image(includeAll: false) {
                  aspectRatio
                }
                ...ArtworkGridItem_artwork
              }
            }
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.artworksConnection) {
          return (
            <InfiniteScrollArtworksGridContainer
              // @ts-ignore
              connection={artworksConnection}
              loadMore={relayMock.loadMore}
              hasMore={relayMock.hasMore}
            />
          )
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  it("renders component with default props", () => {
    const wrapper = () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: {
            ...artworksConnection,
          },
        })
      })
      return tree
    }
    expect(wrapper().root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(1)
    expect(wrapper().root.findAllByType(Button)).toHaveLength(0)
  })
})

const artworksConnection: InfiniteScrollArtworksGridTestsQuery["response"] = {
  artworksConnection: {
    pageInfo: {
      hasNextPage: true,
      startCursor: "1234567890",
      endCursor: "098765432",
    },
    edges: [
      {
        node: {
          slug: "any-slug-1",
          id: "957118411401",
          image: {
            aspectRatio: 1.0,
          },
          " $fragmentSpreads": null as any,
        },
      },
      {
        node: {
          slug: "any-slug-11",
          id: "957118411411",
          image: {
            aspectRatio: 1.0,
          },
          " $fragmentSpreads": null as any,
        },
      },
      {
        node: {
          slug: "any-slug-12",
          id: "957118411412",
          image: {
            aspectRatio: 1.0,
          },
          " $fragmentSpreads": null as any,
        },
      },
      {
        node: {
          slug: "any-slug-13",
          id: "957118411413",
          image: {
            aspectRatio: 1.0,
          },
          " $fragmentSpreads": null as any,
        },
      },
      {
        node: {
          slug: "any-slug-14",
          id: "957118411414",
          image: {
            aspectRatio: 1.0,
          },
          " $fragmentSpreads": null as any,
        },
      },
      {
        node: {
          slug: "any-slug-15",
          id: "957118411415",
          image: {
            aspectRatio: 1.0,
          },
          " $fragmentSpreads": null as any,
        },
      },
      {
        node: {
          slug: "any-slug-16",
          id: "957118411416",
          image: {
            aspectRatio: 1.0,
          },
          " $fragmentSpreads": null as any,
        },
      },
      {
        node: {
          slug: "any-slug-17",
          id: "957118411417",
          image: {
            aspectRatio: 1.0,
          },
          " $fragmentSpreads": null as any,
        },
      },
      {
        node: {
          slug: "any-slug-18",
          id: "957118411418",
          image: {
            aspectRatio: 1.0,
          },
          " $fragmentSpreads": null as any,
        },
      },
      {
        node: {
          slug: "any-slug-19",
          id: "957118411419",
          image: {
            aspectRatio: 1.0,
          },
          " $fragmentSpreads": null as any,
        },
      },
    ],
  },
}
