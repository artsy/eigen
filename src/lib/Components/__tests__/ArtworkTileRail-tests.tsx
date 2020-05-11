import { Theme } from "@artsy/palette"
import { ArtworkTileRailTestsQuery } from "__generated__/ArtworkTileRailTestsQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema } from "lib/utils/track"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ArtworkCard, ArtworkTileRail, tappedArtworkGroupThumbnail } from "../ArtworkTileRail"

jest.unmock("react-relay")
jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

describe("ArtworkTileRail", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <Theme>
      <QueryRenderer<ArtworkTileRailTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query ArtworkTileRailTestsQuery {
            viewingRoom(id: "whatever") {
              artworksConnection {
                ...ArtworkTileRail_artworksConnection
              }
            }
          }
        `}
        render={({ props, error }) => {
          if (props?.viewingRoom) {
            return (
              <Theme>
                <ArtworkTileRail
                  artworksConnection={props.viewingRoom.artworksConnection! /* STRICTNESS_MIGRATION */}
                  contextModule={Schema.ContextModules.ViewingRoomArtworkRail}
                />
              </Theme>
            )
          } else if (error) {
            console.log(error)
          }
        }}
        variables={{}}
      />
    </Theme>
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("navigates to an artwork + calls tracking when a card is tapped", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({
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

    tree.root.findByType(ArtworkCard).props.onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/artwork/nicolas-party-rocks-ii"
    )
    expect(useTracking().trackEvent).toHaveBeenCalledWith(
      tappedArtworkGroupThumbnail(
        Schema.ContextModules.ViewingRoomArtworkRail,
        "5deff4b96fz7e7000f36ce37",
        "nicolas-party-rocks-ii"
      )
    )
  })
})
