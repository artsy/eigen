import { ViewingRoomArtworksTestsQuery } from "__generated__/ViewingRoomArtworksTestsQuery.graphql"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { FlatList, TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ViewingRoomArtworksContainer } from "../ViewingRoomArtworks"

jest.unmock("react-relay")

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
})
