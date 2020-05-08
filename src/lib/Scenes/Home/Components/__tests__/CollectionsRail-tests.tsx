import { cloneDeep, first } from "lodash"
import React from "react"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer, { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))
import SwitchBoard from "lib/NativeModules/SwitchBoard"

import { Theme } from "@artsy/palette"
import { CollectionsRailTestsQuery } from "__generated__/CollectionsRailTestsQuery.graphql"
import { CardRailCard } from "lib/Components/Home/CardRailCard"
import { CollectionsRailFragmentContainer } from "../CollectionsRail"

jest.unmock("react-relay")

describe("CollectionsRailFragmentContainer", () => {
  let env: ReturnType<typeof createMockEnvironment>

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
            <Theme>
              <CollectionsRailFragmentContainer collectionsModule={props.homePage?.marketingCollectionsModule!} />
            </Theme>
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
    ReactTestRenderer.create(<TestRenderer />)
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
    collectionsCopy.results.forEach(result => {
      // @ts-ignore
      result.artworksConnection.edges = []
    })
    ReactTestRenderer.create(<TestRenderer />)
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

  it("routes to collection URL", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
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
    // @ts-ignore
    first(tree.root.findAllByType(CardRailCard)).props.onPress()
    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/collection/test-collection-one"
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
