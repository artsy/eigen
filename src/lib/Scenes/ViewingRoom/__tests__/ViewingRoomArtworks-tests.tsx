import { ViewingRoomArtworksTestsQuery } from "__generated__/ViewingRoomArtworksTestsQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Touchable } from "palette"
import React from "react"
import { FlatList, TouchableHighlight } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { tracks, ViewingRoomArtworksContainer } from "../ViewingRoomArtworks"

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
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({ artworksConnection: { edges: ["Foo"] } }),
      })
      return result
    })
    expect(tree.root.findAllByType(FlatList)).toHaveLength(1)
    expect(tree.root.findAllByType(TouchableHighlight)).toHaveLength(1)
  })

  it("renders additional information if it exists", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({
          artworksConnection: {
            edges: [
              {
                node: {
                  title: "Described Work",
                  additionalInformation: "Very cool. Love the style.",
                },
              },
            ],
          },
        }),
      })
      return result
    })
    expect(extractText(tree.root.findByProps({ "data-test-id": "artwork-additional-information" }))).toEqual(
      "Very cool. Love the style."
    )
  })

  it("navigates to artwork screen + calls tracking on press", () => {
    const tree = renderWithWrappers(<TestRenderer />)
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

    tree.root.findByType(Touchable).props.onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/viewing-room/gallery-name-viewing-room-name/nicolas-party-rocks-ii"
    )

    expect(useTracking().trackEvent).toHaveBeenCalledWith({
      ...tracks.context("2955ab33-c205-44ea-93d2-514cd7ee2bcd", "gallery-name-viewing-room-name"),
      ...tracks.tappedArtworkGroup(
        "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
        "gallery-name-viewing-room-name",
        "5deff4b96fz7e7000f36ce37",
        "nicolas-party-rocks-ii"
      ),
    })
  })
})
