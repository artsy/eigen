import { ArtworkTileRailTestsQuery } from "__generated__/ArtworkTileRailTestsQuery.graphql"
import { navigate } from "lib/navigation/navigate"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Schema } from "lib/utils/track"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ArtworkTileRail, tappedArtworkGroupThumbnail } from "../ArtworkTileRail"
import { ArtworkTileRailCard } from "../ArtworkTileRailCard"

jest.unmock("react-relay")

describe("ArtworkTileRail", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
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
            <ArtworkTileRail
              artworksConnection={props.viewingRoom.artworksConnection! /* STRICTNESS_MIGRATION */}
              contextModule={Schema.ContextModules.ViewingRoomArtworkRail}
            />
          )
        } else if (error) {
          console.log(error)
        }
      }}
      variables={{}}
    />
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("navigates to an artwork + calls tracking when a card is tapped", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
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

    tree.root.findByType(ArtworkTileRailCard).props.onPress()

    expect(navigate).toHaveBeenCalledWith("/artwork/nicolas-party-rocks-ii")
    expect(useTracking().trackEvent).toHaveBeenCalledWith(
      tappedArtworkGroupThumbnail(
        Schema.ContextModules.ViewingRoomArtworkRail,
        "5deff4b96fz7e7000f36ce37",
        "nicolas-party-rocks-ii"
      )
    )
  })
})
