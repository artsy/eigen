import { Theme } from "@artsy/palette"
import { ViewingRoomArtworkRailTestsQuery } from "__generated__/ViewingRoomArtworkRailTestsQuery.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ArtworkCard, ViewingRoomArtworkRailContainer } from "../ViewingRoomArtworkRail"

jest.unmock("react-relay")
jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

describe("ViewingRoomSubsections", () => {
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
    // TODO: once we have slugs for viewing rooms, add a test to navigate to the artworks tab
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

  it("navigates to an artwork when a card is tapped", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({ artworks: { edges: [{ node: { href: "/artwork/nicolas-party-rocks-ii" } }] } }),
      })
      return result
    })

    tree.root.findByType(ArtworkCard).props.onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/artwork/nicolas-party-rocks-ii"
    )
  })
})
