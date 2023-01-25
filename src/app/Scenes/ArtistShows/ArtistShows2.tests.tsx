import { ArtistShows2TestsQuery } from "__generated__/ArtistShows2TestsQuery.graphql"
import { ArtistShowFragmentContainer } from "app/Components/Artist/ArtistShows/ArtistShow"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { Text } from "palette"
import { FlatList } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtistShows2PaginationContainer } from "./ArtistShows2"


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
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artist: () => ({
        name: "Andy Warhol",
      }),
    })

    expect(extractText(tree.root.findAllByType(Text)[0])).toEqual("Andy Warhol")
    expect(extractText(tree.root.findAllByType(Text)[1])).toEqual("Past Shows")
  })

  it("Renders list of shows", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

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
