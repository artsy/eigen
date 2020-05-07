import { Theme } from "@artsy/palette"
import { ViewingRoomArtworkRailTestsQuery } from "__generated__/ViewingRoomArtworkRailTestsQuery.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Schema } from "lib/utils/track"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ArtworkCard, ViewingRoomArtworkRailContainer } from "../ViewingRoomArtworkRail"

jest.unmock("react-relay")
jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

describe("ViewingRoomArtworkRail", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <Theme>
      <QueryRenderer<ViewingRoomArtworkRailTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query ViewingRoomArtworkRailTestsQuery {
            viewingRoom(id: "unused") {
              ...ViewingRoomArtworkRail_viewingRoom
            }
          }
        `}
        render={renderWithLoadProgress(ViewingRoomArtworkRailContainer)}
        variables={{}}
      />
    </Theme>
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })
  it("renders a title for the rail", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation)
      return result
    })
    expect(tree.root.findAllByType(SectionTitle)).toHaveLength(1)
  })

  it("navigates to the artworks screen + calls tracking when tapped", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({
          slug: "gallery-name-viewing-room-name",
          internalID: "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
        }),
      })
      return result
    })
    tree.root.findByType(SectionTitle).props.onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/viewing-room/gallery-name-viewing-room-name/artworks"
    )
    expect(useTracking().trackEvent).toHaveBeenCalledWith({
      action_name: Schema.ActionNames.TappedArtworkGroup,
      context_module: Schema.ContextModules.ViewingRoomArtworkRail,
      destination_screen: Schema.PageNames.ViewingRoomArtworks,
      destination_screen_owner_id: "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
      destination_screen_owner_slug: "gallery-name-viewing-room-name",
      type: "header",
    })
  })

  it("renders one artwork card per edge", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({ artworks: { edges: ["1", "2", "3"] } }),
      })
      return result
    })
    expect(tree.root.findAllByType(ArtworkCard)).toHaveLength(3)
  })

  it("navigates to an artwork + calls tracking when a card is tapped", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({
          artworks: {
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

    tree.root.findByType(ArtworkCard).props.onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/artwork/nicolas-party-rocks-ii"
    )
    expect(useTracking().trackEvent).toHaveBeenCalledWith({
      action_name: Schema.ActionNames.TappedArtworkGroup,
      context_module: Schema.ContextModules.ViewingRoomArtworkRail,
      destination_screen: Schema.PageNames.ArtworkPage,
      destination_screen_owner_id: "5deff4b96fz7e7000f36ce37",
      destination_screen_owner_slug: "nicolas-party-rocks-ii",
      type: "thumbnail",
    })
  })
})
