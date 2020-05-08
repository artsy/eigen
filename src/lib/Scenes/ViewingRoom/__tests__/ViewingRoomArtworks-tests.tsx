import { ViewingRoomArtworksTestsQuery } from "__generated__/ViewingRoomArtworksTestsQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Schema } from "lib/utils/track"
import React from "react"
import { FlatList, TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ViewingRoomArtworksContainer } from "../ViewingRoomArtworks"

jest.unmock("react-relay")
jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

describe("ViewingRoom", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<ViewingRoomArtworksTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ViewingRoomArtworksTestsQuery {
          viewingRoom(id: "unused") {
            ...ViewingRoomArtworks_viewingRoom
          }
        }
      `}
      render={renderWithLoadProgress(ViewingRoomArtworksContainer)}
      variables={{}}
    />
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders a flatlist with one artwork", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({ artworksConnection: { edges: ["Foo"] } }),
      })
      return result
    })
    expect(tree.root.findAllByType(FlatList)).toHaveLength(1)
    expect(tree.root.findAllByType(TouchableOpacity)).toHaveLength(1)
  })

  it("navigates to artwork screen + calls tracking on press", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({
          slug: "gallery-name-viewing-room-name",
          internalID: "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
          artworksConnection: {
            edges: [
              {
                node: {
                  href: "/artwork/nicolas-party-rocks-ii",
                  internalID: "5deff4b96fz7e7000f36ce37",
                  slug: "nicolas-party-rocks-ii",
                },
              },
            ],
          },
        }),
      })
      return result
    })

    tree.root.findByType(TouchableOpacity).props.onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/artwork/nicolas-party-rocks-ii"
    )

    expect(useTracking().trackEvent).toHaveBeenCalledWith({
      action: Schema.ActionNames.TappedArtworkGroup,
      context_module: Schema.ContextModules.ArtworkGrid,
      context_screen: Schema.PageNames.ViewingRoomArtworks,
      context_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
      context_screen_owner_id: "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
      context_screen_owner_slug: "gallery-name-viewing-room-name",
      destination_screen: Schema.PageNames.ArtworkPage,
      destination_screen_owner_type: Schema.OwnerEntityTypes.Artwork,
      destination_screen_owner_id: "5deff4b96fz7e7000f36ce37",
      destination_screen_owner_slug: "nicolas-party-rocks-ii",
    })
  })
})
