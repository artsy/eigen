import { CollectionsRailTestsQuery } from "__generated__/CollectionsRailTestsQuery.graphql"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { cloneDeep } from "lodash"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { CollectionsRailFragmentContainer } from "./CollectionsRail"
import { fireEvent } from "@testing-library/react-native"

describe("CollectionsRailFragmentContainer", () => {
  let env: ReturnType<typeof createMockEnvironment>
  const mockScrollRef = jest.fn()

  const TestRenderer = () => (
    <QueryRenderer<CollectionsRailTestsQuery>
      environment={env}
      query={graphql`
        query CollectionsRailTestsQuery @raw_response_type {
          homePage {
            marketingCollectionsModule {
              ...CollectionsRail_collectionsModule
            }
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props) {
          return (
            <CollectionsRailFragmentContainer
              title="Collections"
              collectionsModule={props.homePage?.marketingCollectionsModule!}
              scrollRef={mockScrollRef}
            />
          )
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  beforeEach(() => {
    env = createMockEnvironment()
  })

  it("doesn't throw when rendered", () => {
    renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          homePage: {
            marketingCollectionsModule: collectionsModuleMock,
          },
        },
      })
    })
  })

  it("looks correct when rendered with sales missing artworks", () => {
    const collectionsCopy = cloneDeep(collectionsModuleMock)

    collectionsCopy.results.forEach((result) => {
      result.artworksConnection.edges = []
    })

    renderWithWrappers(<TestRenderer />)

    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          homePage: {
            marketingCollectionsModule: collectionsCopy,
          },
        },
      })
    })
  })

  it("routes to collection URL", async () => {
    const tree = renderWithWrappers(<TestRenderer />)

    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          homePage: {
            marketingCollectionsModule: collectionsModuleMock,
          },
        },
      })
    })

    fireEvent.press(await tree.findByTestId("collections-rail-card-test-collection-one"))

    expect(navigate).toHaveBeenCalledWith("/collection/test-collection-one")
  })

  it("tracks collection thumbnail taps", async () => {
    const tree = renderWithWrappers(<TestRenderer />)

    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          homePage: {
            marketingCollectionsModule: collectionsModuleMock,
          },
        },
      })
    })

    fireEvent.press(await tree.findByTestId("collections-rail-card-test-collection-one"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      HomeAnalytics.collectionThumbnailTapEvent("test-collection-one", 0)
    )
  })
})

const artworkNode = {
  node: {
    artwork: {
      image: { url: "https://example.com/image.jpg" },
    },
  },
}
const collectionsModuleMock = {
  results: [
    {
      name: "Test Collection One",
      slug: "test-collection-one",
      artworksConnection: {
        edges: [artworkNode, artworkNode, artworkNode],
      },
    },
    {
      name: "Test Collection Two",
      slug: "test-collection-two",
      artworksConnection: {
        edges: [artworkNode, artworkNode, artworkNode],
      },
    },
  ],
}
