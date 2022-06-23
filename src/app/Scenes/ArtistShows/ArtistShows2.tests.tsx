import { ArtistShows2TestsQuery } from "__generated__/ArtistShows2TestsQuery.graphql"
import { ArtistShowFragmentContainer } from "app/Components/Artist/ArtistShows/ArtistShow"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { Text } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtistShows2PaginationContainer } from "./ArtistShows2"

jest.unmock("react-relay")

describe("ArtistShows2", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<ArtistShows2TestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ArtistShows2TestsQuery($artistID: String!) @relay_test_operation {
          artist(id: $artistID) {
            slug
            ...ArtistShows2_artist
          }
        }
      `}
      render={({ props }) => {
        if (props?.artist) {
          return <ArtistShows2PaginationContainer artist={props.artist} />
        }
        return null
      }}
      variables={{ artistID: "artist-id" }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("Renders artist name", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artist: () => ({
        name: "Andy Warhol",
      }),
    })

    expect(extractText(tree.root.findAllByType(Text)[0])).toEqual("Andy Warhol")
    expect(extractText(tree.root.findAllByType(Text)[1])).toEqual("Past Shows")
  })

  it("Renders list of shows", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      // ShowsConnection is named as ShowConnection
      ShowConnection: () => ({
        edges: [{ node: { id: "show1" } }, { node: { id: "show2" } }, { node: { id: "show3" } }],
      }),
    })

    expect(tree.root.findAllByType(FlatList).length).toEqual(1)
    expect(tree.root.findAllByType(ArtistShowFragmentContainer).length).toEqual(3)
  })
})
