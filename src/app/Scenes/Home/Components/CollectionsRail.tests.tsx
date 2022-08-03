import { cloneDeep, first } from "lodash"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"

import { navigate } from "app/navigation/navigate"

import { CollectionsRailTestsQuery } from "__generated__/CollectionsRailTestsQuery.graphql"
import { CardRailCard } from "app/Components/Home/CardRailCard"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperationRawPayload } from "app/tests/resolveMostRecentRelayOperation"
import HomeAnalytics from "../homeAnalytics"
import { CollectionsRailFragmentContainer } from "./CollectionsRail"

describe("CollectionsRailFragmentContainer", () => {
  const mockScrollRef = jest.fn()

  const TestRenderer = () => (
    <QueryRenderer<CollectionsRailTestsQuery>
      environment={getRelayEnvironment()}
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

  it("doesn't throw when rendered", () => {
    renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperationRawPayload({
      errors: [],
      data: {
        homePage: {
          marketingCollectionsModule: collectionsModuleMock,
        },
      },
    })
  })

  it("looks correct when rendered with sales missing artworks", () => {
    const collectionsCopy = cloneDeep(collectionsModuleMock)
    collectionsCopy.results.forEach((result) => {
      // @ts-ignore
      result.artworksConnection.edges = []
    })
    renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperationRawPayload({
      errors: [],
      data: {
        homePage: {
          marketingCollectionsModule: collectionsCopy,
        },
      },
    })
  })

  it("routes to collection URL", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperationRawPayload({
      errors: [],
      data: {
        homePage: {
          marketingCollectionsModule: collectionsModuleMock,
        },
      },
    })
    // @ts-ignore
    first(tree.root.findAllByType(CardRailCard)).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/collection/test-collection-one")
  })

  it("tracks collection thumbnail taps", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperationRawPayload({
      errors: [],
      data: {
        homePage: {
          marketingCollectionsModule: collectionsModuleMock,
        },
      },
    })
    // @ts-ignore
    first(tree.root.findAllByType(CardRailCard)).props.onPress()
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
